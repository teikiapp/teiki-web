import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// Formspree endpoint. Create a form at https://formspree.io and paste its
// form ID here (the part after /f/ in the endpoint URL).
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xvzjpdnn';

// Anti-spam tuning.
const MIN_FILL_MS = 3000; // submissions faster than this are almost certainly bots
const COOLDOWN_MS = 60 * 60_000; // min gap between submissions from the same browser (1 hour)
const COOLDOWN_KEY = 'teiki:submit-service:lastSent';

type SubmitState = 'idle' | 'sending' | 'success' | 'error' | 'cooldown';

@Component({
  selector: 'app-submit-service',
  imports: [ReactiveFormsModule],
  templateUrl: './submit-service.html',
})
export class SubmitService {
  private fb = inject(FormBuilder);
  private loadedAt = Date.now();
  state: SubmitState = 'idle';
  cooldownMinutes = 0;

  form = this.fb.group({
    name: ['', Validators.required],
    website: [''],
    region: [''],
    email: ['', Validators.email],
    notes: [''],
    // Honeypot: hidden from real users, bots tend to fill it. Formspree drops
    // any submission where _gotcha is non-empty.
    _gotcha: [''],
  });

  async submit() {
    if (this.form.invalid || this.state === 'sending') return;
    const v = this.form.value;

    // Honeypot tripped: pretend success, send nothing.
    if (v._gotcha) {
      this.state = 'success';
      this.form.reset();
      return;
    }

    // Time trap: a human can't read and fill the form this fast.
    if (Date.now() - this.loadedAt < MIN_FILL_MS) {
      this.state = 'error';
      return;
    }

    // Cooldown: throttle repeat submissions from the same browser.
    const last = Number(localStorage.getItem(COOLDOWN_KEY) ?? 0);
    const elapsed = Date.now() - last;
    if (elapsed < COOLDOWN_MS) {
      this.cooldownMinutes = Math.ceil((COOLDOWN_MS - elapsed) / 60_000);
      this.state = 'cooldown';
      return;
    }

    this.state = 'sending';

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Submit a Service: ${v.name}`,
          _gotcha: v._gotcha,
          'Service name': v.name,
          Website: v.website || '—',
          'Country or region': v.region || '—',
          email: v.email || '',
          'Anything else': v.notes || '—',
        }),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
      this.state = 'success';
      this.form.reset();
    } catch {
      this.state = 'error';
    }
  }
}
