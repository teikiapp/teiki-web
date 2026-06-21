import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// Formspree endpoint. Create a form at https://formspree.io and paste its
// form ID here (the part after /f/ in the endpoint URL).
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xvzjpdnn';

type SubmitState = 'idle' | 'sending' | 'success' | 'error';

@Component({
  selector: 'app-submit-service',
  imports: [ReactiveFormsModule],
  templateUrl: './submit-service.html',
})
export class SubmitService {
  private fb = inject(FormBuilder);
  state: SubmitState = 'idle';

  form = this.fb.group({
    name: ['', Validators.required],
    website: [''],
    region: [''],
    email: ['', Validators.email],
    notes: [''],
  });

  async submit() {
    if (this.form.invalid || this.state === 'sending') return;
    const v = this.form.value;
    this.state = 'sending';

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Submit a Service: ${v.name}`,
          'Service name': v.name,
          Website: v.website || '—',
          'Country or region': v.region || '—',
          email: v.email || '',
          'Anything else': v.notes || '—',
        }),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      this.state = 'success';
      this.form.reset();
    } catch {
      this.state = 'error';
    }
  }
}
