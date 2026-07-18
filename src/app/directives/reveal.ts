import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';

/**
 * Fade-up scroll reveal. Elements start slightly offset and transparent, then
 * animate into place when they enter the viewport (or immediately, if already
 * in view on load). No-ops for SSR/prerender and prefers-reduced-motion so the
 * content is always visible without JS.
 */
@Directive({
  selector: '[reveal]',
})
export class Reveal implements OnInit {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Optional stagger delay in milliseconds. */
  @Input('reveal') delay: number | string = 0;

  ngOnInit(): void {
    const node = this.el.nativeElement;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ms = Number(this.delay) || 0;
    if (ms) {
      node.style.transitionDelay = `${ms}ms`;
    }
    node.classList.add('reveal');

    const reveal = () => node.classList.add('is-visible');

    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      // Already in view on load — animate in on the next frame.
      requestAnimationFrame(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal();
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(node);
  }
}
