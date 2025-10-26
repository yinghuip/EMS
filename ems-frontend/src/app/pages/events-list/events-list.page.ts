import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event.service';
import { EventCardComponent } from '../../components/event-card/event-card.component';
import { EventModel } from '../../models/event.model';
import { toSignal } from '@angular/core/rxjs-interop';

type SortOrder = 'upcoming-first' | 'oldest-first';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule, EventCardComponent],
  templateUrl: './events-list.page.html',
  styleUrl: './events-list.page.scss'
})
export class EventsListPage {
  private eventService = inject(EventService);
  
  // State management with signals
  private allEventsSignal = toSignal(this.eventService.getEvents(), { initialValue: [] });
  sortOrder = signal<SortOrder>('upcoming-first');
  includePastEvents = signal(false);
  isLoading = signal(true);
  hasError = signal(false);

  // Computed signal for filtered and sorted events
  displayedEvents = computed(() => {
    const events = this.allEventsSignal();
    const now = new Date();
    
    // Filter past events if needed
    const filtered = this.includePastEvents()
      ? events
      : events.filter(event => new Date(event.start_datetime) >= now);
    
    // Sort events based on selected order
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.start_datetime).getTime();
      const dateB = new Date(b.start_datetime).getTime();
      
      let sortResult: number;
      
      if (this.sortOrder() === 'upcoming-first') {
        // Soonest first: earliest dates at the top (ascending order)
        sortResult = dateA - dateB;
      } else {
        // Newest first: latest dates at the top (descending order)
        sortResult = dateB - dateA;
      }
      
      // Tiebreaker: if same date, sort by title
      if (sortResult === 0) {
        return a.title.localeCompare(b.title);
      }
      
      return sortResult;
    });
    
    return sorted;
  });

  // Check if there are no events to display
  noEvents = computed(() => this.displayedEvents().length === 0);

  constructor() {
    // Simulate loading state
    setTimeout(() => {
      this.isLoading.set(false);
    }, 500);
  }

  togglePastEvents(): void {
    this.includePastEvents.update(value => !value);
  }

  changeSortOrder(order: SortOrder): void {
    this.sortOrder.set(order);
  }

  retry(): void {
    this.hasError.set(false);
    this.isLoading.set(true);
    // Reload events - in a real app this would retry the HTTP call
    setTimeout(() => {
      this.isLoading.set(false);
    }, 500);
  }
}
