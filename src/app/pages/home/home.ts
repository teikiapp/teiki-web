import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { Seo } from '../../services/seo';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
})
export class Home implements AfterViewInit, OnDestroy {
  readonly shots = [1, 2, 3, 4, 5, 6, 7];

  @ViewChild('track') private trackRef?: ElementRef<HTMLElement>;

  private autoTimer?: ReturnType<typeof setInterval>;
  private wrapTimer?: ReturnType<typeof setTimeout>;
  private readonly autoIntervalMs = 3500;

  constructor() {
    inject(Seo).update({
      title: 'Teiki | Bills & Subscriptions Tracker',
      description:
        'Teiki keeps recurring payments, bill reminders, payment history, and subscription totals in one calm place. Free on iPhone, iPad & Android.',
      path: '',
    });
  }

  ngAfterViewInit(): void {
    this.startAuto();
  }

  ngOnDestroy(): void {
    this.stopAuto();
    clearTimeout(this.wrapTimer);
  }

  startAuto(): void {
    if (this.autoTimer) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.autoTimer = setInterval(() => {
      const track = this.trackRef?.nativeElement;
      if (track) {
        this.scrollCarousel(track, 1);
      }
    }, this.autoIntervalMs);
  }

  stopAuto(): void {
    clearInterval(this.autoTimer);
    this.autoTimer = undefined;
  }

  scrollCarousel(track: HTMLElement, direction: 1 | -1): void {
    const card = track.querySelector<HTMLElement>('.promo-shot');
    if (!card) return;
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap) || 0;
    const stride = card.getBoundingClientRect().width + gap;
    // Advance by a whole number of fully-visible cards so every step lands on a
    // card boundary (no uneven partial scrolls on mobile).
    const perPage = Math.max(1, Math.floor((track.clientWidth + gap) / stride));
    const step = stride * perPage;

    // When scrolling back near the start, hop forward one full set first so we
    // can keep going "left" into the duplicated slides instead of hitting 0.
    if (direction === -1 && track.scrollLeft - step < 0) {
      track.scrollLeft += track.scrollWidth / 2;
    }
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
  }

  onCarouselScroll(track: HTMLElement): void {
    clearTimeout(this.wrapTimer);
    // Once scrolling settles, snap back into the first set if we've crossed into
    // the duplicate. The content is identical, so the jump is invisible.
    this.wrapTimer = setTimeout(() => {
      const half = track.scrollWidth / 2;
      if (track.scrollLeft >= half) {
        track.scrollLeft -= half;
      }
    }, 80);
  }
}
