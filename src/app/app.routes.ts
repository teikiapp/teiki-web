import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then(m => m.About),
  },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/privacy/privacy').then(m => m.Privacy),
  },
  {
    path: 'support',
    loadComponent: () => import('./pages/support/support').then(m => m.Support),
  },
  {
    path: 'release-notes',
    loadComponent: () => import('./pages/release-notes/release-notes').then(m => m.ReleaseNotes),
  },
  {
    path: 'submit-a-service',
    loadComponent: () => import('./pages/submit-service/submit-service').then(m => m.SubmitService),
  },
  { path: '**', redirectTo: '' },
];
