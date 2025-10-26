# Data Model: Landing Page Redesign

**Feature**: Landing Page Redesign  
**Phase**: 1 (Design & Contracts)  
**Date**: October 26, 2025

## Overview

This document defines the data structures, component interfaces, and state management patterns for the landing page redesign. All entities are derived from functional requirements in the specification.

---

## Core Entities

### 1. Event (Existing)

**Source**: `src/app/models/event.model.ts` (already exists)

```typescript
export interface Event {
  id: string;
  title: string;
  description?: string;
  start_datetime: string;  // ISO 8601 format
  end_datetime: string;    // ISO 8601 format
  venue: string;
  image_url?: string;
  capacity?: number;
  registered_count?: number;
}
```

**Usage**:
- Hero carousel items (filtered: next 3-5 upcoming)
- Upcoming shows grid (all future events)
- Calendar view (grouped by month)

**Validation Rules** (from FR-008, FR-016):
- `title`: Required, displayed in all sections
- `start_datetime`: Required, used for chronological sorting
- `venue`: Required for calendar view display
- `image_url`: Optional, fallback to placeholder if missing

**State Transitions**: N/A (read-only in frontend)

---

### 2. PastEvent (New or Event Extension)

**Source**: `src/app/models/event.model.ts` (extension)

```typescript
export interface PastEvent {
  id: string;
  title: string;
  artist_name: string;      // Primary display name for past concerts
  image_url: string;        // Required for gallery display
  event_date: string;       // ISO 8601 format for sorting
  venue?: string;           // Optional for past events
}

// Alternative: extend Event and add discriminator
export interface Event {
  // ... existing fields
  event_type?: 'upcoming' | 'past';
  artist_name?: string;     // Only for past events
}
```

**Usage**:
- Past concerts archive gallery (8-12 most recent)
- Sorted by `event_date` descending (newest first)

**Validation Rules** (from FR-015):
- `artist_name`: Required for display overlay
- `image_url`: Required (no fallback for past concerts - hide if missing)
- `event_date`: Required for sorting

**Relationships**:
- May reference same entity as `Event` with additional filtering logic
- Backend may return unified `Event[]` with `event_date < now()` for past

**Design Decision**: Use single `Event` interface with optional `artist_name` field. Filter past vs upcoming based on `start_datetime < Date.now()`. This avoids duplicate interfaces and simplifies EventService.

---

### 3. CalendarEventEntry (Presentation Layer)

**Source**: Computed in `calendar-view.component.ts` from `Event[]`

```typescript
export interface CalendarEventEntry {
  date: Date;              // Parsed from start_datetime
  dayOfWeek: string;       // e.g., "Monday", "Tue"
  title: string;           // Event title
  venue: string;           // Event venue
  eventId: string;         // For navigation on click
  month: string;           // "November 2025" for grouping
}

export interface CalendarMonth {
  monthYear: string;       // "November 2025"
  events: CalendarEventEntry[];
}
```

**Usage**:
- Calendar section display
- Grouped by month (FR-014 requirement)

**Transformation Logic**:
```typescript
function groupEventsByMonth(events: Event[]): CalendarMonth[] {
  const grouped = new Map<string, CalendarEventEntry[]>();
  
  events.forEach(event => {
    const date = new Date(event.start_datetime);
    const monthKey = date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
    
    if (!grouped.has(monthKey)) {
      grouped.set(monthKey, []);
    }
    
    grouped.get(monthKey)!.push({
      date,
      dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
      title: event.title,
      venue: event.venue,
      eventId: event.id,
      month: monthKey
    });
  });
  
  return Array.from(grouped.entries()).map(([monthYear, events]) => ({
    monthYear,
    events: events.sort((a, b) => a.date.getTime() - b.date.getTime())
  }));
}
```

---

### 4. PaginationState (Component State)

**Source**: Managed in `event-grid.component.ts` and `past-concerts.component.ts`

```typescript
export interface PaginationState {
  displayCount: number;     // Currently visible items
  batchSize: number;        // Items per "Load More" click (12)
  totalAvailable: number;   // Total items in source array
}

// Helper computed properties
interface PaginationHelpers {
  hasMore: boolean;         // displayCount < totalAvailable
  visibleItems: any[];      // items.slice(0, displayCount)
  remainingCount: number;   // totalAvailable - displayCount
}
```

**Usage**:
- Event grid pagination (FR-008)
- Past concerts "View More" (FR-015)

**Validation Rules**:
- `displayCount` >= `batchSize` (always show minimum one batch)
- `batchSize` = 12 (matches 3 rows × 4 columns on desktop)

**State Transitions**:
```
Initial: displayCount = 12, totalAvailable = events.length
User clicks "Load More": displayCount += 12
hasMore = displayCount < totalAvailable
```

---

## Component State Models

### HeroCarouselComponent State

```typescript
interface HeroCarouselState {
  currentIndex: Signal<number>;       // Active carousel item
  previousIndex: Signal<number>;      // For exit animations
  direction: Signal<'next' | 'prev'>; // Animation direction
  autoAdvanceEnabled: boolean;        // Pause on user interaction
  timer: any;                         // setInterval handle
}
```

**Signal Reactivity**:
- `currentIndex` change → update active item CSS class
- `direction` change → determine animation direction (left/right)
- `previousIndex` tracks for smooth transitions

**Derived State**:
```typescript
getItemClass(index: number): string {
  if (index === currentIndex()) return 'active';
  if (index === previousIndex()) {
    return direction() === 'next' ? 'exit-left' : 'exit-right';
  }
  return 'hidden';
}
```

---

### EventGridComponent State

```typescript
interface EventGridState {
  allEvents: Signal<Event[]>;          // Full event list
  displayCount: Signal<number>;        // Currently showing
  batchSize: number = 12;              // Constant
  
  // Computed
  visibleEvents: Signal<Event[]>;      // allEvents().slice(0, displayCount())
  hasMore: Signal<boolean>;            // displayCount() < allEvents().length
  remainingCount: Signal<number>;      // allEvents().length - displayCount()
}
```

**User Actions**:
- `loadMore()`: Increment `displayCount` by `batchSize`
- `reset()`: Reset `displayCount` to `batchSize`

---

### CalendarViewComponent State

```typescript
interface CalendarViewState {
  allEvents: Signal<Event[]>;                      // Source data
  searchTerm: Signal<string>;                      // Debounced search input
  searchInput$: Subject<string>;                   // RxJS debounce stream
  
  // Computed
  filteredEvents: Signal<Event[]>;                 // Filtered by search
  calendarMonths: Signal<CalendarMonth[]>;         // Grouped by month
}
```

**Search Logic**:
```typescript
filteredEvents = computed(() => {
  const term = this.searchTerm().toLowerCase();
  if (!term) return this.allEvents();
  
  return this.allEvents().filter(event => 
    event.title.toLowerCase().includes(term) ||
    event.venue.toLowerCase().includes(term) ||
    (event.description?.toLowerCase().includes(term) ?? false)
  );
});

calendarMonths = computed(() => 
  groupEventsByMonth(this.filteredEvents())
);
```

**Debounce Implementation**:
```typescript
constructor() {
  this.searchInput$.pipe(
    debounceTime(300)
  ).subscribe(term => this.searchTerm.set(term));
}

onSearchInput(value: string): void {
  this.searchInput$.next(value);
}
```

---

### PastConcertsComponent State

```typescript
interface PastConcertsState {
  allPastEvents: Signal<Event[]>;      // Past events (start_datetime < now)
  displayCount: Signal<number>;        // Currently showing (8-12)
  maxDisplay: number = 12;             // Default display limit
  
  // Computed
  visiblePastEvents: Signal<Event[]>;  // allPastEvents().slice(0, displayCount())
  hasMore: Signal<boolean>;            // displayCount() < allPastEvents().length
}
```

**Filtering Logic**:
```typescript
// In parent component or service
pastEvents = computed(() => {
  const now = Date.now();
  return allEvents()
    .filter(event => new Date(event.start_datetime).getTime() < now)
    .sort((a, b) => 
      new Date(b.start_datetime).getTime() - new Date(a.start_datetime).getTime()
    )
    .slice(0, 100); // Reasonable limit for past events
});
```

---

## Data Flow Architecture

### Landing Page Orchestration

```typescript
// landing.page.ts (orchestrator)
export class LandingPage {
  private eventService = inject(EventService);
  
  // Source data
  readonly events = toSignal(this.eventService.getEvents(), { initialValue: [] });
  
  // Computed slices for child components
  readonly upcomingEvents = computed(() => {
    const now = Date.now();
    return this.events()
      .filter(e => new Date(e.start_datetime).getTime() > now)
      .sort((a, b) => 
        new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime()
      );
  });
  
  readonly featuredEvents = computed(() => 
    this.upcomingEvents().slice(0, 5)  // First 5 upcoming for hero
  );
  
  readonly pastEvents = computed(() => {
    const now = Date.now();
    return this.events()
      .filter(e => new Date(e.start_datetime).getTime() < now)
      .sort((a, b) => 
        new Date(b.start_datetime).getTime() - new Date(a.start_datetime).getTime()
      );
  });
}
```

**Data Flow**:
```
EventService.getEvents()
  ↓ (Observable → Signal)
LandingPage.events
  ↓ (Computed filters)
├─ featuredEvents → HeroCarouselComponent
├─ upcomingEvents → EventGridComponent
├─ upcomingEvents → CalendarViewComponent
└─ pastEvents → PastConcertsComponent
```

---

## API Service Contracts

### EventService (Existing - No Changes)

```typescript
@Injectable({ providedIn: 'root' })
export class EventService {
  private http = inject(HttpClient);
  private apiUrl = 'API_BASE_URL/events';
  
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }
  
  getLatest(): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/latest`);
  }
}
```

**No API changes required**:
- All data transformations happen client-side
- Filtering (upcoming/past), sorting, and grouping performed in components
- Pagination is client-side array slicing

---

## Validation & Error Handling

### Required Field Validation

```typescript
// In component
function validateEvent(event: Event): boolean {
  return !!(
    event.id &&
    event.title &&
    event.start_datetime &&
    event.venue
  );
}

// Filter invalid events
validEvents = computed(() => 
  this.events().filter(validateEvent)
);
```

### Image Error Handling

```typescript
// In component template
<img [src]="event.image_url || defaultImageUrl"
     [alt]="event.title"
     (error)="onImageError($event)">

// In component class
private readonly defaultImageUrl = 'assets/images/event-placeholder.jpg';

onImageError(event: Event): void {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = this.defaultImageUrl;
}
```

### Empty State Handling

```typescript
// In templates
@if (upcomingEvents().length === 0) {
  <div class="empty-state">
    <p>No upcoming events.</p>
    <a routerLink="/events">View all events</a>
  </div>
} @else {
  <!-- Event grid -->
}
```

---

## Performance Considerations

### Computed Signal Optimization

```typescript
// ✅ Good: Memoized, only recomputes when dependencies change
readonly filteredEvents = computed(() => {
  const term = this.searchTerm();
  return this.events().filter(e => e.title.includes(term));
});

// ❌ Bad: Function call, recalculates every change detection
get filteredEvents(): Event[] {
  return this.events().filter(e => e.title.includes(this.searchTerm()));
}
```

### Large List Rendering

```typescript
// Use @for with track for efficient DOM updates
@for (event of visibleEvents(); track event.id) {
  <app-event-card [event]="event"></app-event-card>
}

// ❌ Avoid trackBy with index for dynamic lists
// ✅ Always track by unique ID
```

### Debounced Search

```typescript
// RxJS debounce prevents excessive filtering
private searchInput$ = new Subject<string>();

constructor() {
  this.searchInput$.pipe(
    debounceTime(300),  // Wait 300ms after user stops typing
    distinctUntilChanged()  // Skip duplicate values
  ).subscribe(term => this.searchTerm.set(term));
}
```

---

## Testing Data Fixtures

### Mock Events

```typescript
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Accusefive [Run. Run. Run!] 2025 Live Tour',
    description: 'Rock concert featuring Accusefive',
    start_datetime: '2025-11-15T19:00:00Z',
    end_datetime: '2025-11-15T22:00:00Z',
    venue: 'Singapore Indoor Stadium',
    image_url: 'https://example.com/event1.jpg',
    capacity: 5000,
    registered_count: 3200
  },
  // ... more mock events
];

export const mockPastEvents: Event[] = [
  {
    id: '100',
    title: 'BLACKPINK World Tour',
    artist_name: 'BLACKPINK',
    start_datetime: '2025-09-20T20:00:00Z',
    end_datetime: '2025-09-20T23:00:00Z',
    venue: 'National Stadium',
    image_url: 'https://example.com/blackpink.jpg'
  },
  // ... more past events
];
```

### Test Scenarios

1. **Empty State**: `events = []`
2. **Single Event**: `events = [mockEvents[0]]`
3. **Pagination**: `events = Array(50).fill(mockEvents[0]).map((e, i) => ({ ...e, id: `${i}` }))`
4. **Search**: Test search term matches across title, venue, description
5. **Date Edge Cases**: Events with same date, events spanning multiple days

---

## Summary

**Key Data Structures**:
- `Event` (existing): Core entity for all event data
- `CalendarEventEntry` (computed): Presentation layer for calendar view
- `PaginationState` (component): Manages "Load More" functionality
- Component signals: Reactive state management with computed values

**Data Flow**:
- Single source: `EventService.getEvents()`
- Transform in parent: Filter upcoming/past, sort chronologically
- Pass to children: Components receive filtered slices via `@Input()`
- Local state: Pagination, search, carousel index managed per component

**No Backend Changes**: All filtering, sorting, grouping, and pagination handled client-side.

**Next**: Generate component contracts in `contracts/components.ts`
