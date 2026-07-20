import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { Seo } from '../../services/seo';
import { Reveal } from '../../directives/reveal';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  imports: [Reveal],
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
        'Teiki keeps recurring payments, bill reminders, payment history, and subscription totals organized and easy to check. Free on iPhone, iPad & Android.',
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
    const perPage = Math.max(1, Math.floor((track.clientWidth + gap) / stride));
    const starts = this.carouselStarts(perPage);
    const slideCount = this.shots.length;
    const cycleWidth = stride * slideCount;

    if (direction === -1 && track.scrollLeft < stride) {
      track.scrollLeft += cycleWidth;
    }

    const currentIndex = Math.round(track.scrollLeft / stride);
    const currentStart = ((currentIndex % slideCount) + slideCount) % slideCount;
    const currentGroup = this.nearestStartIndex(starts, currentStart);
    const nextGroup = (currentGroup + direction + starts.length) % starts.length;
    const wrapsForward = direction === 1 && nextGroup <= currentGroup;
    const wrapsBackward = direction === -1 && nextGroup >= currentGroup;

    let targetIndex = Math.floor(track.scrollLeft / cycleWidth) * slideCount + starts[nextGroup];
    if (wrapsForward || (direction === 1 && targetIndex <= currentIndex)) {
      targetIndex += slideCount;
    }
    if (wrapsBackward || (direction === -1 && targetIndex >= currentIndex)) {
      targetIndex -= slideCount;
    }

    track.scrollTo({ left: targetIndex * stride, behavior: 'smooth' });
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

  private carouselStarts(perPage: number): number[] {
    if (perPage >= 3) return [0, 2, 4];
    if (perPage === 2) return [0, 2, 3, 5];
    return this.shots.map((_, index) => index);
  }

  private nearestStartIndex(starts: number[], currentStart: number): number {
    return starts.reduce((nearest, start, index) => {
      const nearestDistance = Math.abs(starts[nearest] - currentStart);
      const distance = Math.abs(start - currentStart);
      return distance < nearestDistance ? index : nearest;
    }, 0);
  }
}
