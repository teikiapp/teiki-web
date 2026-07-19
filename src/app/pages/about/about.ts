import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../services/seo';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.html',
})
export class About {
  constructor() {
    inject(Seo).update({
      title: 'About | Teiki',
      description:
        'Teiki is an independent bills and subscriptions tracker built by one developer. Why it exists, how it handles your data, and how to get in touch.',
      path: 'about',
    });
  }
}
