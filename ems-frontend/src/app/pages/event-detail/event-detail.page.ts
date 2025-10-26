import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss']
})
export class EventDetailPage {
  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);

  readonly event = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => this.eventService.getEventById(params.get('id') || ''))
    )
  );

  /**
   * Return true when the event's start time is in the past or now.
   * Uses the event's start_datetime (ISO string) and client clock.
   */
  eventStarted(): boolean {
    const e = this.event();
    if (!e || !e.start_datetime) return false;
    return new Date(e.start_datetime).getTime() <= Date.now();
  }
}
