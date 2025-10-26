import { Component, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ems-frontend';
  isScrolled = false;
  private scrollThreshold = 80; // px

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const y = typeof window !== 'undefined' ? window.scrollY || window.pageYOffset : 0;
    this.isScrolled = y > this.scrollThreshold;
  }
}


