import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Reveal } from '../../directives/reveal';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Reveal],
  templateUrl: './header.html',
})
export class Header {}
