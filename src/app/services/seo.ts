import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

/** Canonical origin Google should index. Keep in sync with sitemap.xml / robots.txt. */
export const SITE_URL = 'https://teikiapp.github.io/teiki-web';
const SITE_NAME = 'Teiki';
const DEFAULT_IMAGE = `${SITE_URL}/thumbnail.png`;
const DEFAULT_IMAGE_WIDTH = '1200';
const DEFAULT_IMAGE_HEIGHT = '630';
const DEFAULT_IMAGE_ALT = 'Track bills. Plan subscriptions. Teiki showing tracked bills and a grid of subscription services';

export interface SeoData {
  /** Full <title> text. */
  title: string;
  /** Meta description (~150–160 chars). */
  description: string;
  /** Route path without leading slash. Use '' for the home page. */
  path: string;
}

/**
 * Sets per-page title, description, canonical URL, and Open Graph / Twitter
 * tags. Called from each page component so the values are baked into the
 * prerendered static HTML at build time (good for crawlers).
 */
@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  update({ title, description, path }: SeoData): void {
    const url = path ? `${SITE_URL}/${path}` : `${SITE_URL}/`;

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.setCanonical(url);

    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:image', content: DEFAULT_IMAGE });
    // Dimensions let scrapers (WhatsApp, Slack, iMessage) lay out the card
    // before the image finishes downloading, so the preview renders first try.
    this.meta.updateTag({ property: 'og:image:width', content: DEFAULT_IMAGE_WIDTH });
    this.meta.updateTag({ property: 'og:image:height', content: DEFAULT_IMAGE_HEIGHT });
    this.meta.updateTag({ property: 'og:image:alt', content: DEFAULT_IMAGE_ALT });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: DEFAULT_IMAGE });
    this.meta.updateTag({ name: 'twitter:image:alt', content: DEFAULT_IMAGE_ALT });
  }

  private setCanonical(url: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
