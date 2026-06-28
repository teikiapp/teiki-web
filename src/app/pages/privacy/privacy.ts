import { Component, inject } from '@angular/core';
import { Seo } from '../../services/seo';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.html',
})
export class Privacy {
  constructor() {
    inject(Seo).update({
      title: 'Privacy Policy | Teiki',
      description:
        'How Teiki handles your data: a local-first bills and subscriptions tracker with optional iCloud Sync. Learn what is stored and how it is used.',
      path: 'privacy',
    });
  }
}
