import { ChangeDetectionStrategy, Component, computed, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventModel } from '../../models/event.model';
import { EventCardComponent } from '../event-card/event-card.component';

@Component({
  selector: 'app-event-grid',
  standalone: true,
  imports: [CommonModule, RouterLink, EventCardComponent],
  templateUrl: './event-grid.component.html',
  styleUrls: ['./event-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventGridComponent {
  events = input<EventModel[]>([]);
  eventClicked = output<EventModel>();
  initialCount = input<number>(8);

  readonly displayCount = signal<number>(0);
  readonly visibleEvents = computed(() => this.events().slice(0, this.displayCount()));
  readonly hasMore = computed(() => this.events().length > this.displayCount());

  constructor() {
    // Initialize and react to input changes
    effect(() => {
      this.displayCount.set(this.initialCount());
    }, { allowSignalWrites: true });
  }

  loadMore(): void {
    const step = Math.max(this.initialCount(), 1);
    this.displayCount.update((n) => n + step);
  }

  onCardClick(ev: EventModel): void {
    this.eventClicked.emit(ev);
  }
}
