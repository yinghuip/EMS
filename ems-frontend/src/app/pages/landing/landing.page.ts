import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { EventModel } from '../../models/event.model';
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
  latest$!: Observable<EventModel | undefined>;
  events$!: Observable<EventModel[]>;

  constructor(private eventService: EventService) {
    this.latest$ = this.eventService.getLatest();
    this.events$ = this.eventService.getEvents();
  }
}
