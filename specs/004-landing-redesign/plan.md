# Implementation Plan: Landing Page Redesign

**Branch**: `004-landing-redesign` | **Date**: October 26, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-landing-redesign/spec.md`

## Summary

Redesign the landing page to match the provided screenshot reference, implementing a full-width hero carousel, upcoming events grid with pagination, interactive calendar with search, and past concerts archive gallery. The redesign maintains existing color theme while introducing modern event discovery patterns with heavy visual emphasis on imagery and clear calls-to-action.

**Technical Approach**: Frontend-only implementation using Angular 20 standalone components, SCSS for styling, and Bootstrap 5 grid system. No backend API changes required; existing EventService provides all necessary data. Client-side filtering and pagination for calendar search and event grids.

## Technical Context

**Language/Version**: TypeScript 5.8.4 / Angular 20.2.0  
**Primary Dependencies**: Angular Material 20.2.10, Bootstrap 5.3.8, RxJS 7.8.0  
**Storage**: N/A (frontend consumes existing backend API via EventService)  
**Testing**: Jasmine/Karma (unit), Playwright (E2E)  
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge); mobile-first responsive  
**Project Type**: Web frontend (Angular single-page application)  
**Performance Goals**: 
- Hero carousel visible and interactive within 2 seconds of page load
- Carousel transitions smooth at 60fps
- Calendar search debounced to 300ms with instant visual feedback
- Grid pagination renders new items within 500ms

**Constraints**: 
- Must preserve existing color theme (CSS variables/SCSS variables)
- Responsive breakpoints: mobile (375px+), tablet (768px+), desktop (1200px+)
- Touch targets minimum 44x44px on mobile
- Accessibility: WCAG AA keyboard navigation, ARIA labels, semantic HTML

**Scale/Scope**: 
- Single landing page component with 5 major sections
- Support for 100+ events in grid pagination
- 3-5 hero carousel items
- 8-12 past concerts archive items

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Library-First ✅
- Hero carousel will be built as a reusable component (`hero-carousel.component.ts`)
- Event card grid component can be extracted for reuse (`event-grid.component.ts`)
- Calendar search logic encapsulated in dedicated service or component method
- All components follow Angular standalone component pattern with clear inputs/outputs

### HTTP-First ✅
- Consumes existing HTTP API via EventService
- No new API endpoints required (uses existing event data endpoints)
- Client-side filtering/pagination reduces server load

### Test-First ✅
- Unit tests required for:
  - Hero carousel auto-advance and manual navigation logic
  - Calendar search filter functionality
  - Event card click navigation
  - Pagination controls
- E2E tests required for:
  - Landing page load and hero carousel interaction
  - Grid pagination flow
  - Calendar search filtering
  - Navigation to event detail pages

### Observability & Reliability ✅
- Console logging for debugging (development only)
- Error boundaries for image loading failures (fallback images)
- Graceful empty state handling when no events exist

### Minimal Technical Requirements ✅
- Frontend: Angular 20 component-based architecture with standalone components
- Buildable via Angular CLI (`ng build`)
- Dependencies pinned in package.json
- SCSS styling follows project conventions
- Accessibility: semantic HTML, ARIA labels, keyboard navigation

### Development Workflow & Quality Gates ✅
- Feature branch: `004-landing-redesign`
- PR required for mainline merge
- CI runs lint, unit tests (Jasmine/Karma), E2E tests (Playwright)
- Code review required before merge
- No secrets/credentials involved (frontend only)

**GATE STATUS**: ✅ PASSED - No constitution violations. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/004-landing-redesign/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file
├── research.md          # Phase 0 output (component design patterns, pagination strategy)
├── data-model.md        # Phase 1 output (component interfaces, event data shapes)
├── quickstart.md        # Phase 1 output (setup and development guide)
├── contracts/           # Phase 1 output (component APIs, service interfaces)
│   └── components.ts    # TypeScript interfaces for component contracts
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
ems-frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── hero-carousel/              # NEW: Full-width hero carousel
│   │   │   │   ├── hero-carousel.component.ts
│   │   │   │   ├── hero-carousel.component.html
│   │   │   │   ├── hero-carousel.component.scss
│   │   │   │   └── hero-carousel.component.spec.ts
│   │   │   ├── event-grid/                 # NEW: Paginated event grid
│   │   │   │   ├── event-grid.component.ts
│   │   │   │   ├── event-grid.component.html
│   │   │   │   ├── event-grid.component.scss
│   │   │   │   └── event-grid.component.spec.ts
│   │   │   ├── calendar-view/              # NEW: Calendar with search
│   │   │   │   ├── calendar-view.component.ts
│   │   │   │   ├── calendar-view.component.html
│   │   │   │   ├── calendar-view.component.scss
│   │   │   │   └── calendar-view.component.spec.ts
│   │   │   ├── past-concerts/              # NEW: Archive gallery
│   │   │   │   ├── past-concerts.component.ts
│   │   │   │   ├── past-concerts.component.html
│   │   │   │   ├── past-concerts.component.scss
│   │   │   │   └── past-concerts.component.spec.ts
│   │   │   └── event-card/                 # EXISTING: Reuse/enhance
│   │   │       └── ...
│   │   ├── pages/
│   │   │   └── landing/                    # MODIFIED: Orchestrate new components
│   │   │       ├── landing.page.ts
│   │   │       ├── landing.page.html
│   │   │       ├── landing.page.scss
│   │   │       └── landing.page.spec.ts
│   │   ├── services/
│   │   │   └── event.service.ts            # EXISTING: No changes needed
│   │   └── models/
│   │       └── event.model.ts              # EXISTING: May add PastEvent interface
│   ├── styles.scss                         # EXISTING: Global theme variables
│   └── assets/
│       └── images/                         # NEW: Fallback placeholder images
└── e2e/
    └── landing-redesign.spec.ts            # NEW: E2E tests for redesigned page
```

**Structure Decision**: Web application frontend (Angular SPA). The existing `ems-frontend/` directory contains all frontend code. New components follow the established pattern: standalone components in `src/app/components/`, page-level orchestration in `src/app/pages/landing/`. No backend changes required.

## Complexity Tracking

> **No violations to justify - Constitution Check passed cleanly.**

This feature adds 4 new standalone components but maintains architectural consistency with existing patterns. No additional projects, repositories, or abstraction layers introduced.

## Phase 0: Research & Technology Decisions

### Research Tasks

1. **Hero Carousel Implementation Pattern**
   - Question: Should we use Angular CDK Carousel, build custom, or use third-party library?
   - Research: Compare Angular Material Carousel, custom implementation with Angular animations, Swiper.js integration
   - Decision criteria: Bundle size impact, accessibility support, touch gesture support, ease of customization

2. **Pagination Strategy**
   - Question: Client-side pagination vs infinite scroll vs "Load More" button?
   - Research: Best practices for event listing pagination, performance implications, UX patterns from screenshot
   - Decision criteria: Matches screenshot design, handles 100+ events efficiently, mobile-friendly

3. **Calendar Search Implementation**
   - Question: Real-time filter (pipe) vs debounced manual filter?
   - Research: Angular filter patterns, RxJS debouncing strategies, performance with large event lists
   - Decision criteria: 300ms debounce requirement, search across multiple fields (title, venue, description)

4. **Responsive Grid System**
   - Question: Pure CSS Grid, Bootstrap Grid, or Angular Flex Layout?
   - Research: Project already uses Bootstrap 5 - verify grid capabilities match requirements
   - Decision criteria: 4-2-1 column layout (desktop-tablet-mobile), minimal bundle size increase

5. **Image Optimization Strategy**
   - Question: How to handle high-resolution hero images efficiently?
   - Research: Lazy loading, responsive images (srcset), image CDN patterns, fallback handling
   - Decision criteria: 2-second load time for hero, graceful degradation on slow connections

### Technology Decisions (Initial)

Based on existing project context:

- **Carousel**: Custom implementation using Angular animations and signals (maintains consistency with existing carousel code in landing.page.ts)
- **Styling**: SCSS with Bootstrap 5 grid system (already in project)
- **State Management**: Angular signals (already used in landing.page.ts)
- **Routing**: Angular Router (already configured)
- **Testing**: Jasmine/Karma (unit), Playwright (E2E) - already configured

**Output**: Detailed `research.md` with decisions, rationales, and implementation patterns

## Phase 1: Design & Contracts

### Data Model

**Entities**:

1. **FeaturedEvent** (extension of Event)
   ```typescript
   interface FeaturedEvent extends Event {
     // Inherits: id, title, start_datetime, end_datetime, image_url, venue
     // No additional fields - uses first 3-5 upcoming events
   }
   ```

2. **PastEvent** (may be new or extension of Event)
   ```typescript
   interface PastEvent {
     id: string;
     title: string;
     artist_name: string;  // Primary display name
     image_url: string;
     event_date: string;   // ISO date for sorting
   }
   ```

3. **CalendarEvent** (presentation layer formatting)
   ```typescript
   interface CalendarEvent {
     date: Date;
     dayOfWeek: string;
     title: string;
     venue: string;
     eventId: string;
   }
   
   interface CalendarMonth {
     monthYear: string;  // "November 2025"
     events: CalendarEvent[];
   }
   ```

4. **PaginationState**
   ```typescript
   interface PaginationState {
     currentPage: number;
     pageSize: number;
     totalItems: number;
     totalPages: number;
   }
   ```

### Component Contracts

**Output**: `contracts/components.ts` defining:

```typescript
// HeroCarouselComponent
@Input() events: Event[];
@Input() autoAdvanceInterval: number = 5000;
@Output() eventSelected: EventEmitter<Event>;

// EventGridComponent
@Input() events: Event[];
@Input() pageSize: number = 12;
@Output() eventClicked: EventEmitter<Event>;
@Output() pageChanged: EventEmitter<number>;

// CalendarViewComponent
@Input() events: Event[];
@Output() eventSelected: EventEmitter<Event>;
// Internal: search signal, filtered events computed signal

// PastConcertsComponent
@Input() pastEvents: PastEvent[];
@Input() maxDisplay: number = 12;
@Output() eventClicked: EventEmitter<PastEvent>;
@Output() viewMoreClicked: EventEmitter<void>;
```

### API Contracts

No new backend endpoints required. Existing EventService methods:

```typescript
// Existing - no changes
getEvents(): Observable<Event[]>
getLatest(): Observable<Event>
```

**Potential enhancement** (optional, can be deferred):
```typescript
// If past events need separate endpoint
getPastEvents(limit?: number): Observable<PastEvent[]>
```

### Quickstart Guide

**Output**: `quickstart.md` containing:

1. **Setup**
   ```bash
   cd ems-frontend
   npm install
   ng serve
   ```

2. **Development**
   - Component location: `src/app/components/`
   - Page orchestration: `src/app/pages/landing/`
   - Testing: `ng test` (unit), `npm run test:e2e` (Playwright)

3. **Styling**
   - Theme variables: `src/styles.scss`
   - Component styles: Component `.scss` files (scoped)
   - Bootstrap utilities: Available globally

4. **Testing Strategy**
   - Unit tests: Component logic, signal reactivity, filter functions
   - E2E tests: Full user flows (carousel interaction, pagination, search, navigation)

### Agent Context Update

After generating contracts and data model, update agent context:

```bash
# This would run if script available
.specify/scripts/powershell/update-agent-context.ps1 -AgentType copilot
```

**Manual alternative**: Document in `.github/copilot-instructions.md` or similar:
- New components: hero-carousel, event-grid, calendar-view, past-concerts
- Patterns: Standalone components, signals-based state, Angular animations
- Testing requirements: Unit + E2E coverage for all user interactions

## Phase 2: Task Breakdown (NOT EXECUTED BY /speckit.plan)

**Note**: Phase 2 task generation is handled by the separate `/speckit.tasks` command after planning is complete.

Tasks will include:
- Component scaffolding (ng generate component)
- Hero carousel implementation with auto-advance
- Event grid with client-side pagination
- Calendar view with search filtering
- Past concerts archive grid
- Landing page integration and orchestration
- Responsive styling (mobile/tablet/desktop)
- Unit test implementation
- E2E test scenarios
- Accessibility audit and fixes

## Next Steps

1. ✅ Planning complete - review this document
2. 📋 Generate research.md (Phase 0 - part of this command)
3. 📋 Generate data-model.md (Phase 1 - part of this command)
4. 📋 Generate contracts/ (Phase 1 - part of this command)
5. 📋 Generate quickstart.md (Phase 1 - part of this command)
6. ⏭️ Run `/speckit.tasks` to generate task breakdown (Phase 2 - separate command)
7. 🚀 Begin implementation following task order

---

**Plan Status**: Phase 0 & 1 outputs generating below...
