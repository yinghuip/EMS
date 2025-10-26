import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule, Router } from '@angular/router';
import { EventModel } from '../../models/event.model';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterModule],
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent {
  event = input<EventModel>();
  private router = inject(Router);

  navigate(e?: Event) {
    // allow inner interactive controls to stop propagation
    if (e) e.stopPropagation();
    const id = this.event()?.id;
    if (id) {
      this.router.navigate(['/events', id]);
    }
  }

  onSpace(e: KeyboardEvent) {
    // prevent page scroll
    e.preventDefault();
    this.navigate(e as unknown as Event);
  }
}
