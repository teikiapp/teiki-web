import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-submit-service',
  imports: [ReactiveFormsModule],
  templateUrl: './submit-service.html',
})
export class SubmitService {
  private fb = inject(FormBuilder);
  submitted = false;

  form = this.fb.group({
    name: ['', Validators.required],
    website: [''],
    region: [''],
    notes: [''],
  });

  submit() {
    if (this.form.invalid) return;
    const v = this.form.value;

    const body = [
      `Service name: ${v.name}`,
      `Website: ${v.website || '—'}`,
      `Country or region: ${v.region || '—'}`,
      `Anything else: ${v.notes || '—'}`,
    ].join('\n');

    const mailto = `mailto:capydev.sys@outlook.com?subject=${encodeURIComponent('Submit a Service')}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    this.submitted = true;
  }
}
