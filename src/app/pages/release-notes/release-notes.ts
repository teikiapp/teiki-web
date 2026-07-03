import { Component, inject } from '@angular/core';
import { Seo } from '../../services/seo';
import releasesData from './release-notes.data.json';

interface ReleaseBlock {
  type: 'paragraph' | 'heading' | 'list';
  text?: string;
  items?: string[];
  className?: string;
}

interface ReleaseNote {
  version: string;
  title: string;
  blocks: ReleaseBlock[];
}

// Dot colors cycle through this palette so releases alternate as notes are added.
const DOT_COLORS = ['#4ade80', '#60a5fa', '#facc15', '#f472b6'];

@Component({
  selector: 'app-release-notes',
  templateUrl: './release-notes.html',
})
export class ReleaseNotes {
  readonly releases = releasesData as ReleaseNote[];

  constructor() {
    inject(Seo).update({
      title: 'Release Notes | Teiki',
      description:
        'See what is new in Teiki: app updates, Calendar improvements, subscription tracking changes, and release notes by version.',
      path: 'release-notes',
    });
  }

  dotColor(index: number): string {
    return DOT_COLORS[index % DOT_COLORS.length];
  }
}
