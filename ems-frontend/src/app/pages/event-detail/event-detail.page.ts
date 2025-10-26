import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { EventModel } from '../../models/event.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss']
})
export class EventDetailPage {
  event$!: Observable<EventModel | undefined>;

  constructor(private route: ActivatedRoute, private eventService: EventService) {
    this.event$ = this.route.paramMap.pipe(
      switchMap((params) => this.eventService.getEventById(params.get('id') || ''))
    );
  }
}
