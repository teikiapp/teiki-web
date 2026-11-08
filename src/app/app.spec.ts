import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should keep service and contact navigation without release notes', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const nav = compiled.querySelector('nav[aria-label="Main navigation"]');
    expect(nav?.querySelector('a[aria-label="Submit a Service"]')?.getAttribute('href')).toBe('/submit-a-service');
    expect(nav?.querySelector('a[aria-label="Email us"]')?.getAttribute('href')).toBe('mailto:capydev.sys@outlook.com');
    expect(compiled.querySelector('a[href="/release-notes"]')).toBeNull();
  });
});
