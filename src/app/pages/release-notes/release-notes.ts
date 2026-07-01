import { Component, inject } from '@angular/core';
import { Seo } from '../../services/seo';

@Component({
  selector: 'app-release-notes',
  templateUrl: './release-notes.html',
})
export class ReleaseNotes {
  constructor() {
    inject(Seo).update({
      title: 'Release Notes | Teiki',
      description:
        'See what is new in Teiki: app updates, Calendar improvements, subscription tracking changes, and release notes by version.',
      path: 'release-notes',
    });
  }
}
