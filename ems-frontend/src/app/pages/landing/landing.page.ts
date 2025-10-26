import { Component, inject, computed, effect, OnDestroy, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FeatureEventComponent } from '../../components/feature-event/feature-event.component';
import { HeroCarouselComponent } from '../../components/hero-carousel/hero-carousel.component';
import { EventGridComponent } from '../../components/event-grid/event-grid.component';
import { CalendarViewComponent } from '../../components/calendar-view/calendar-view.component';
import { PastConcertsComponent } from '../../components/past-concerts/past-concerts.component';
import { EventService } from '../../services/event.service';
import { EventModel } from '../../models/event.model';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FeatureEventComponent, HeroCarouselComponent, EventGridComponent, CalendarViewComponent, PastConcertsComponent, RouterLink],
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss']
})
export class LandingPage implements OnDestroy {
  private eventService = inject(EventService);
  private router = inject(Router);
  private timer: any;
  
  readonly latest = toSignal(this.eventService.getLatest());
  readonly events = toSignal(this.eventService.getEvents(), { initialValue: [] });

  // Upcoming events: strictly future start time, soonest-first, all items (no 90-day cap)
  readonly upcomingEvents = computed(() => {
    const all = this.events();
    const now = new Date();

    return all
      .filter((e) => new Date(e.start_datetime) > now)
      .sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime());
  });

  // Featured events for hero carousel: next 3-5 upcoming events (chronologically)
  readonly featuredEvents = computed(() => {
    const upcoming = this.upcomingEvents();
    return upcoming.slice(0, Math.min(5, upcoming.length));
  });

  // Past events: events with start_datetime < now, sorted by date descending (most recent first)
  readonly pastEvents = computed(() => {
    const all = this.events();
    const now = new Date();

    return all
      .filter((e) => new Date(e.start_datetime) < now)
      .sort((a, b) => new Date(b.start_datetime).getTime() - new Date(a.start_datetime).getTime());
  });

  // Carousel state
  readonly currentIndex = signal<number>(0);
  readonly previousIndex = signal<number>(-1);
  readonly direction = signal<'next' | 'prev'>('next');

  constructor() {
    // Manage auto-advance timer whenever the upcoming list changes
    effect(() => {
      const items = this.upcomingEvents();
      // reset index when dataset changes
      this.currentIndex.set(0);
      // clear any existing timer
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      // start timer only if 2 or more items
      if (items.length > 1) {
        this.startAutoAdvance();
      }
    }, { allowSignalWrites: true });
  }

  private startAutoAdvance(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      const len = this.upcomingEvents().length;
      if (len > 0) {
        this.previousIndex.set(this.currentIndex());
        this.direction.set('next');
        this.currentIndex.update((i: number) => (i + 1) % len);
      }
    }, 5000);
  }

  goToNext(): void {
    const len = this.upcomingEvents().length;
    if (len > 0) {
      this.previousIndex.set(this.currentIndex());
      this.direction.set('next');
      this.currentIndex.update((i: number) => (i + 1) % len);
      this.startAutoAdvance(); // reset timer
    }
  }

  goToPrevious(): void {
    const len = this.upcomingEvents().length;
    if (len > 0) {
      this.previousIndex.set(this.currentIndex());
      this.direction.set('prev');
      this.currentIndex.update((i: number) => (i - 1 + len) % len);
      this.startAutoAdvance(); // reset timer
    }
  }

  getItemClass(index: number): string {
    const current = this.currentIndex();
    const previous = this.previousIndex();
    const dir = this.direction();

    if (index === current) {
      return 'active';
    }
    
    if (index === previous) {
      // Exit animation based on direction
      return dir === 'next' ? 'exit-left' : 'exit-right';
    }

    // Items waiting to enter (not visible yet)
    return dir === 'next' ? 'enter-right' : 'enter-left';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }

  formatDateRange(start: string, end: string): string {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startStr = this.formatDate(start);
    const endStr = this.formatDate(end);
    
    // Same day event
    if (startDate.toDateString() === endDate.toDateString()) {
      return startStr;
    }
    return `${startStr} – ${endStr}`;
  }

  // Hero carousel event handler
  onHeroEventSelected(event: EventModel): void {
    this.router.navigate(['/events', event.id]);
  }

  onGridEventClicked(event: EventModel): void {
    this.router.navigate(['/events', event.id]);
  }

  onCalendarEventSelected(event: EventModel): void {
    this.router.navigate(['/events', event.id]);
  }

  onPastEventClicked(event: EventModel): void {
    this.router.navigate(['/events', event.id]);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
