/**
 * Component Contracts: Landing Page Redesign
 * 
 * This file defines TypeScript interfaces for all component inputs, outputs,
 * and public APIs for the landing page redesign feature.
 * 
 * Generated: October 26, 2025
 * Feature Branch: 004-landing-redesign
 */

import { EventEmitter } from '@angular/core';
import { Event } from '../../../ems-frontend/src/app/models/event.model';

// ============================================================================
// COMPONENT: HeroCarouselComponent
// ============================================================================

/**
 * Hero carousel component for displaying featured events with auto-rotation
 * and manual navigation controls.
 * 
 * Location: src/app/components/hero-carousel/
 * 
 * Requirements: FR-001, FR-002, FR-003, FR-004, FR-005
 */
export interface HeroCarouselComponentContract {
  // INPUTS
  
  /** 
   * Array of featured events to display in carousel (typically 3-5 items)
   * @required
   */
  events: Event[];
  
  /**
   * Auto-advance interval in milliseconds
   * @default 5000 (5 seconds)
   */
  autoAdvanceInterval?: number;
  
  /**
   * Enable/disable auto-rotation
   * @default true
   */
  autoRotate?: boolean;
  
  /**
   * Show/hide navigation arrow buttons
   * @default true
   */
  showControls?: boolean;
  
  // OUTPUTS
  
  /**
   * Emitted when user clicks on a carousel item or CTA button
   * Consumer should navigate to event detail page
   */
  eventSelected: EventEmitter<Event>;
  
  /**
   * Emitted when carousel index changes (for analytics/tracking)
   */
  indexChanged?: EventEmitter<number>;
}

/**
 * Public methods exposed by HeroCarouselComponent
 */
export interface HeroCarouselPublicAPI {
  /**
   * Manually advance to next event
   */
  goToNext(): void;
  
  /**
   * Manually go to previous event
   */
  goToPrevious(): void;
  
  /**
   * Jump to specific index
   * @param index - Zero-based index of event to display
   */
  goToIndex(index: number): void;
  
  /**
   * Pause auto-rotation
   */
  pause(): void;
  
  /**
   * Resume auto-rotation
   */
  resume(): void;
}

// ============================================================================
// COMPONENT: EventGridComponent
// ============================================================================

/**
 * Event grid component with pagination support for displaying upcoming events.
 * 
 * Location: src/app/components/event-grid/
 * 
 * Requirements: FR-006, FR-007, FR-008, FR-009
 */
export interface EventGridComponentContract {
  // INPUTS
  
  /**
   * Array of events to display in grid
   * @required
   */
  events: Event[];
  
  /**
   * Number of items to load per "Load More" click
   * @default 12
   */
  pageSize?: number;
  
  /**
   * Initial number of items to display
   * @default 12
   */
  initialDisplayCount?: number;
  
  /**
   * Show grid section heading
   * @default true
   */
  showHeading?: boolean;
  
  /**
   * Custom heading text
   * @default "UPCOMING SHOWS"
   */
  headingText?: string;
  
  // OUTPUTS
  
  /**
   * Emitted when user clicks an event card
   * Consumer should navigate to event detail page
   */
  eventClicked: EventEmitter<Event>;
  
  /**
   * Emitted when user clicks "Load More" button
   * @param page - New page number (for analytics)
   */
  loadMoreClicked?: EventEmitter<number>;
}

/**
 * Public methods exposed by EventGridComponent
 */
export interface EventGridPublicAPI {
  /**
   * Load more events (increment display count)
   */
  loadMore(): void;
  
  /**
   * Reset pagination to initial state
   */
  reset(): void;
  
  /**
   * Get current pagination state (read-only)
   */
  getPaginationState(): {
    displayCount: number;
    totalAvailable: number;
    hasMore: boolean;
  };
}

// ============================================================================
// COMPONENT: CalendarViewComponent
// ============================================================================

/**
 * Calendar view component with search functionality for browsing events by date.
 * 
 * Location: src/app/components/calendar-view/
 * 
 * Requirements: FR-010, FR-011, FR-012, FR-013
 */
export interface CalendarViewComponentContract {
  // INPUTS
  
  /**
   * Array of events to display in calendar format
   * @required
   */
  events: Event[];
  
  /**
   * Search debounce time in milliseconds
   * @default 300
   */
  searchDebounceMs?: number;
  
  /**
   * Placeholder text for search input
   * @default "Search events..."
   */
  searchPlaceholder?: string;
  
  /**
   * Show search bar
   * @default true
   */
  showSearch?: boolean;
  
  /**
   * Show section heading
   * @default true
   */
  showHeading?: boolean;
  
  /**
   * Custom heading text
   * @default "SHOW CALENDAR"
   */
  headingText?: string;
  
  // OUTPUTS
  
  /**
   * Emitted when user clicks "Find Tickets" button or event entry
   * Consumer should navigate to event detail/registration page
   */
  eventSelected: EventEmitter<Event>;
  
  /**
   * Emitted when search term changes (for analytics)
   */
  searchChanged?: EventEmitter<string>;
}

/**
 * Calendar event entry (presentation model)
 */
export interface CalendarEventEntry {
  date: Date;
  dayOfWeek: string;      // "Mon", "Tue", etc.
  title: string;
  venue: string;
  eventId: string;
  monthYear: string;      // "November 2025"
}

/**
 * Calendar month grouping
 */
export interface CalendarMonth {
  monthYear: string;      // "November 2025"
  events: CalendarEventEntry[];
}

/**
 * Public methods exposed by CalendarViewComponent
 */
export interface CalendarViewPublicAPI {
  /**
   * Programmatically set search term
   */
  setSearchTerm(term: string): void;
  
  /**
   * Clear search and show all events
   */
  clearSearch(): void;
  
  /**
   * Get current search term (read-only)
   */
  getSearchTerm(): string;
  
  /**
   * Get filtered events count
   */
  getFilteredCount(): number;
}

// ============================================================================
// COMPONENT: PastConcertsComponent
// ============================================================================

/**
 * Past concerts archive gallery component.
 * 
 * Location: src/app/components/past-concerts/
 * 
 * Requirements: FR-014, FR-015, FR-016
 */
export interface PastConcertsComponentContract {
  // INPUTS
  
  /**
   * Array of past events to display in gallery grid
   * @required
   */
  pastEvents: Event[];
  
  /**
   * Maximum number of events to display initially
   * @default 12
   */
  maxDisplay?: number;
  
  /**
   * Show "View More" link when more events available
   * @default true
   */
  showViewMore?: boolean;
  
  /**
   * Show section heading
   * @default true
   */
  showHeading?: boolean;
  
  /**
   * Custom heading text
   * @default "PAST CONCERTS"
   */
  headingText?: string;
  
  // OUTPUTS
  
  /**
   * Emitted when user clicks a past event card
   * Consumer should navigate to event detail/archive page
   */
  eventClicked: EventEmitter<Event>;
  
  /**
   * Emitted when user clicks "View More" link
   * Consumer should navigate to full archive page
   */
  viewMoreClicked: EventEmitter<void>;
}

/**
 * Public methods exposed by PastConcertsComponent
 */
export interface PastConcertsPublicAPI {
  /**
   * Show more past events (if available)
   */
  showMore(): void;
  
  /**
   * Reset to initial display count
   */
  reset(): void;
}

// ============================================================================
// SHARED TYPES
// ============================================================================

/**
 * Pagination state (used internally by grid components)
 */
export interface PaginationState {
  displayCount: number;     // Currently visible items
  batchSize: number;        // Items to load per action
  totalAvailable: number;   // Total items in source
}

/**
 * Image error event handler signature
 */
export type ImageErrorHandler = (event: Event) => void;

/**
 * Navigation action (for event clicks)
 */
export interface NavigationAction {
  eventId: string;
  targetPage: 'detail' | 'registration' | 'archive';
}

// ============================================================================
// COMPONENT USAGE EXAMPLES
// ============================================================================

/**
 * Example: Using HeroCarouselComponent
 * 
 * ```typescript
 * // In parent component
 * @Component({
 *   template: `
 *     <app-hero-carousel
 *       [events]="featuredEvents()"
 *       [autoAdvanceInterval]="5000"
 *       (eventSelected)="onEventSelected($event)">
 *     </app-hero-carousel>
 *   `
 * })
 * export class LandingPage {
 *   featuredEvents = computed(() => this.upcomingEvents().slice(0, 5));
 *   
 *   onEventSelected(event: Event): void {
 *     this.router.navigate(['/events', event.id]);
 *   }
 * }
 * ```
 */

/**
 * Example: Using EventGridComponent
 * 
 * ```typescript
 * @Component({
 *   template: `
 *     <app-event-grid
 *       [events]="upcomingEvents()"
 *       [pageSize]="12"
 *       (eventClicked)="navigateToEvent($event)">
 *     </app-event-grid>
 *   `
 * })
 * export class LandingPage {
 *   upcomingEvents = computed(() => 
 *     this.events().filter(e => new Date(e.start_datetime) > new Date())
 *   );
 *   
 *   navigateToEvent(event: Event): void {
 *     this.router.navigate(['/events', event.id]);
 *   }
 * }
 * ```
 */

/**
 * Example: Using CalendarViewComponent
 * 
 * ```typescript
 * @Component({
 *   template: `
 *     <app-calendar-view
 *       [events]="upcomingEvents()"
 *       [searchDebounceMs]="300"
 *       (eventSelected)="navigateToEvent($event)">
 *     </app-calendar-view>
 *   `
 * })
 * export class LandingPage {
 *   navigateToEvent(event: Event): void {
 *     this.router.navigate(['/events', event.id]);
 *   }
 * }
 * ```
 */

/**
 * Example: Using PastConcertsComponent
 * 
 * ```typescript
 * @Component({
 *   template: `
 *     <app-past-concerts
 *       [pastEvents]="pastEvents()"
 *       [maxDisplay]="12"
 *       (eventClicked)="viewEventArchive($event)"
 *       (viewMoreClicked)="navigateToArchive()">
 *     </app-past-concerts>
 *   `
 * })
 * export class LandingPage {
 *   pastEvents = computed(() => 
 *     this.events()
 *       .filter(e => new Date(e.start_datetime) < new Date())
 *       .sort((a, b) => new Date(b.start_datetime).getTime() - new Date(a.start_datetime).getTime())
 *   );
 *   
 *   viewEventArchive(event: Event): void {
 *     this.router.navigate(['/events', event.id]);
 *   }
 *   
 *   navigateToArchive(): void {
 *     this.router.navigate(['/events/archive']);
 *   }
 * }
 * ```
 */

// ============================================================================
// TESTING CONTRACTS
// ============================================================================

/**
 * Component test harness interface
 */
export interface ComponentTestHarness<T> {
  /**
   * Get component instance
   */
  getComponent(): T;
  
  /**
   * Trigger input change
   */
  setInput<K extends keyof T>(prop: K, value: T[K]): void;
  
  /**
   * Get output emitter
   */
  getOutput<K extends keyof T>(prop: K): EventEmitter<any>;
  
  /**
   * Trigger DOM event
   */
  triggerEvent(selector: string, event: string): void;
}

/**
 * Mock event factory for testing
 */
export interface MockEventFactory {
  createEvent(overrides?: Partial<Event>): Event;
  createEvents(count: number): Event[];
  createPastEvent(overrides?: Partial<Event>): Event;
}
