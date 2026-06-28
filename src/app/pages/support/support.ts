import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../services/seo';

@Component({
  selector: 'app-support',
  imports: [RouterLink],
  templateUrl: './support.html',
})
export class Support {
  constructor() {
    inject(Seo).update({
      title: 'Support | Teiki',
      description:
        'Get help with Teiki: bug reports, billing and purchase questions, and general feedback for the bills and subscriptions tracker.',
      path: 'support',
    });
  }
}
