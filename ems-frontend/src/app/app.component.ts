import { Component, signal, effect, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly scrollThreshold = 80; // px
  readonly title = signal('ems-frontend');
  readonly isScrolled = signal(false);

  constructor() {
    effect(() => {
      // This effect will run whenever isScrolled changes
      document.body.classList.toggle('header-scrolled', this.isScrolled());
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const y = typeof window !== 'undefined' ? window.scrollY || window.pageYOffset : 0;
    this.isScrolled.set(y > this.scrollThreshold);
  }
}


