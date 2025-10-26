import { Component, Input, Output, EventEmitter, signal, effect, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventModel } from '../../models/event.model';
import { formatDate, formatDateRange } from '../../utils/date-utils';

@Component({
  selector: 'app-hero-carousel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero-carousel.component.html',
  styleUrl: './hero-carousel.component.scss'
})
export class HeroCarouselComponent implements OnDestroy, OnChanges {
  // INPUTS
  @Input() events: EventModel[] = [];
  @Input() autoAdvanceInterval: number = 5000; // 5 seconds default
  @Input() autoRotate: boolean = true;
  @Input() showControls: boolean = true;

  // OUTPUTS
  @Output() eventSelected = new EventEmitter<EventModel>();
  @Output() indexChanged = new EventEmitter<number>();

  // SIGNALS for reactive state management
  readonly currentIndex = signal<number>(0);
  readonly previousIndex = signal<number>(-1);
  readonly direction = signal<'next' | 'prev'>('next');

  // Internal state
  private timer: any = null;
  private isPaused = false;

  constructor() {
    // Effect to manage auto-advance when events change
    effect(() => {
      // Access events to trigger effect
      const items = this.events;
      
      // Reset to first slide when dataset changes
      this.currentIndex.set(0);
      this.previousIndex.set(-1);
      
      // Restart auto-advance if enabled
      if (this.autoRotate && !this.isPaused) {
        this.startAutoAdvance();
      }
    }, { allowSignalWrites: true });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['events'] && !changes['events'].firstChange) {
      // Reset carousel when events input changes
      this.currentIndex.set(0);
      this.previousIndex.set(-1);
      
      if (this.autoRotate && !this.isPaused) {
        this.startAutoAdvance();
      }
    }

    if (changes['autoRotate']) {
      if (this.autoRotate && !this.isPaused) {
        this.startAutoAdvance();
      } else {
        this.stopAutoAdvance();
      }
    }

    if (changes['autoAdvanceInterval'] && this.autoRotate && !this.isPaused) {
      this.startAutoAdvance();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoAdvance();
  }

  // ============================================================================
  // AUTO-ADVANCE LOGIC
  // ============================================================================

  private startAutoAdvance(): void {
    // Clear existing timer
    this.stopAutoAdvance();

    // Only start if we have more than one event
    if (this.events.length <= 1) {
      return;
    }

    this.timer = setInterval(() => {
      this.goToNext();
    }, this.autoAdvanceInterval);
  }

  private stopAutoAdvance(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  // ============================================================================
  // NAVIGATION METHODS (Public API)
  // ============================================================================

  goToNext(): void {
    if (this.events.length === 0) {
      return;
    }

    const len = this.events.length;
    this.previousIndex.set(this.currentIndex());
    this.direction.set('next');
    this.currentIndex.update((i: number) => (i + 1) % len);
    
    // Emit index changed event
    this.indexChanged.emit(this.currentIndex());

    // Restart auto-advance timer
    if (this.autoRotate && !this.isPaused) {
      this.startAutoAdvance();
    }
  }

  goToPrevious(): void {
    if (this.events.length === 0) {
      return;
    }

    const len = this.events.length;
    this.previousIndex.set(this.currentIndex());
    this.direction.set('prev');
    this.currentIndex.update((i: number) => (i - 1 + len) % len);
    
    // Emit index changed event
    this.indexChanged.emit(this.currentIndex());

    // Restart auto-advance timer
    if (this.autoRotate && !this.isPaused) {
      this.startAutoAdvance();
    }
  }

  goToIndex(index: number): void {
    if (this.events.length === 0) {
      return;
    }

    // Clamp index to valid range
    const clampedIndex = Math.max(0, Math.min(index, this.events.length - 1));
    
    this.previousIndex.set(this.currentIndex());
    this.direction.set(clampedIndex > this.currentIndex() ? 'next' : 'prev');
    this.currentIndex.set(clampedIndex);
    
    // Emit index changed event
    this.indexChanged.emit(this.currentIndex());

    // Restart auto-advance timer
    if (this.autoRotate && !this.isPaused) {
      this.startAutoAdvance();
    }
  }

  pause(): void {
    this.isPaused = true;
    this.stopAutoAdvance();
  }

  resume(): void {
    this.isPaused = false;
    if (this.autoRotate) {
      this.startAutoAdvance();
    }
  }

  // ============================================================================
  // EVENT HANDLING
  // ============================================================================

  onEventClick(event: EventModel): void {
    this.eventSelected.emit(event);
  }

  // ============================================================================
  // TEMPLATE HELPERS
  // ============================================================================

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

  formatEventDate(event: EventModel): string {
    return formatDateRange(event.start_datetime, event.end_datetime);
  }

  getEventLocation(event: EventModel): string {
    return event.location?.name || 'TBA';
  }

  // Image error handler
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/images/hero-fallback.svg';
  }
}
