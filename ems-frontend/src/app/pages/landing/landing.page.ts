import { Component, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FeatureEventComponent } from '../../components/feature-event/feature-event.component';
import { EventCardComponent } from '../../components/event-card/event-card.component';
import { EventService } from '../../services/event.service';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FeatureEventComponent, EventCardComponent, MatGridListModule],
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss']
})
export class LandingPage {
  private eventService = inject(EventService);
  
  readonly latest = toSignal(this.eventService.getLatest());
  readonly events = toSignal(this.eventService.getEvents(), { initialValue: [] });

  // Upcoming events within next 90 days (inclusive), ordered soonest-first, limit to top 3
  readonly upcomingEvents = computed(() => {
    const all = this.events();
    const now = new Date();
    const limit = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const within = all
      .filter((e) => {
        const d = new Date(e.start_datetime);
        return d >= now && d <= limit;
      })
      .sort((a, b) => {
        const da = new Date(a.start_datetime).getTime();
        const db = new Date(b.start_datetime).getTime();
        if (da === db) return a.title.localeCompare(b.title);
        return da - db;
      })
      .slice(0, 3);

    return within;
  });
}
