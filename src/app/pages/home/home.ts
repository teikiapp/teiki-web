import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../services/seo';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
})
export class Home {
  constructor() {
    inject(Seo).update({
      title: 'Teiki | Bills & Subscriptions Tracker',
      description:
        'Teiki keeps recurring payments, bill reminders, payment history, and subscription totals in one calm place. Free on iPhone, iPad & Android.',
      path: '',
    });
  }
}
