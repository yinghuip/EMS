import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../components/hero/hero.component';
import { EventCardComponent } from '../../components/event-card/event-card.component';
import { EventService } from '../../services/event.service';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, HeroComponent, EventCardComponent, MatGridListModule],
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss']
})
export class LandingPage {
  private eventService = inject(EventService);
  
  readonly latest = toSignal(this.eventService.getLatest());
  readonly events = toSignal(this.eventService.getEvents(), { initialValue: [] });
}
