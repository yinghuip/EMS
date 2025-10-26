# Research & Technology Decisions

**Feature**: Landing Page Redesign  
**Phase**: 0 (Research)  
**Date**: October 26, 2025

## Overview

This document consolidates research findings and technology decisions for implementing the landing page redesign. All NEEDS CLARIFICATION items from the technical context have been resolved with specific implementation approaches.

---

## Research Task 1: Hero Carousel Implementation Pattern

### Question
Should we use Angular CDK Carousel, build custom implementation, or integrate third-party library like Swiper.js?

### Research Findings

**Option A: Angular Material/CDK Carousel**
- Pros: Official Angular ecosystem, TypeScript-first, accessible out-of-box
- Cons: Limited customization, may not match exact screenshot design, heavier bundle
- Bundle impact: ~25KB gzipped

**Option B: Custom Implementation with Angular Animations**
- Pros: Full control, matches existing landing.page.ts pattern, minimal bundle size
- Cons: More development effort, need to handle accessibility manually
- Bundle impact: ~2-3KB (only animation logic)
- Existing code: Project already has carousel logic in `landing.page.ts` with signals and auto-advance

**Option C: Swiper.js Integration**
- Pros: Feature-rich, proven library, excellent touch support
- Cons: Non-Angular library, jQuery-like API, bundle size increase
- Bundle impact: ~40KB gzipped

### Decision

**Selected: Option B - Custom Implementation with Angular Animations**

**Rationale**:
1. Project already has working carousel implementation in `landing.page.ts` using signals, auto-advance timer, and manual navigation
2. Minimal bundle size impact aligns with performance goals (2-second load time)
3. Full customization enables exact match to screenshot design
4. Consistency with existing codebase patterns (signals, standalone components)
5. Accessibility can be controlled with proper ARIA labels and keyboard handlers

**Implementation Pattern**:
```typescript
// Extend existing approach from landing.page.ts
- Signal-based state: currentIndex, previousIndex, direction
- Auto-advance with setInterval (5-second timer)
- Manual navigation with goToNext/goToPrevious methods
- CSS transitions for smooth animations
- Dynamic class binding for enter/exit animations
```

**Alternatives Considered**: Angular Material carousel rejected due to limited customization and bundle size. Swiper.js rejected due to non-Angular nature and unnecessary features for this use case.

---

## Research Task 2: Pagination Strategy

### Question
Should upcoming events grid use client-side pagination, infinite scroll, or "Load More" button pattern?

### Research Findings

**Option A: Client-Side Pagination with Page Numbers**
- Pros: Clear navigation, users know total pages, matches traditional patterns
- Cons: Requires pagination controls UI, may feel less modern
- Performance: Excellent (all data loaded once, instant page switches)

**Option B: Infinite Scroll**
- Pros: Modern UX, seamless browsing, mobile-friendly
- Cons: No footer visibility, difficult to return to specific item, accessibility challenges
- Performance: Good (lazy load as needed)

**Option C: "Load More" Button**
- Pros: User-controlled loading, simple implementation, accessible
- Cons: No direct page jumping, total count unclear until fully loaded
- Performance: Excellent (batch loading on demand)

### Decision

**Selected: Option C - "Load More" Button with Initial Batch**

**Rationale**:
1. Screenshot analysis shows continuous grid without visible pagination controls
2. User clarification specified "show all upcoming events with pagination" - interpreted as progressive disclosure
3. Mobile-friendly interaction (large touch target button)
4. Accessibility: Clearly labeled button, keyboard accessible
5. Performance: Load 12 events initially, then 12 more per click (batch size matches desktop 3-row display)

**Implementation Pattern**:
```typescript
interface PaginationState {
  displayCount: number;    // Currently visible items
  batchSize: number;       // Items to load per "Load More" (12)
  totalAvailable: number;  // Total events available
}

// Component logic
showMore(): void {
  this.displayCount += this.batchSize;
}

get hasMore(): boolean {
  return this.displayCount < this.totalAvailable;
}
```

**Alternatives Considered**: Traditional pagination rejected due to lack of controls in screenshot. Infinite scroll rejected due to accessibility concerns and difficulty returning to specific events.

---

## Research Task 3: Calendar Search Implementation

### Question
Should calendar search use real-time Angular pipe filtering or debounced manual filtering with signals?

### Research Findings

**Option A: Angular Pipe (Real-time)**
- Pros: Declarative, Angular idiom, simple template usage
- Cons: Runs on every change detection, can be inefficient with large lists
- Performance: Acceptable for <100 events, may lag with 500+

**Option B: Debounced Signal with Computed**
- Pros: Efficient (300ms debounce), modern Angular pattern, explicit control
- Cons: More boilerplate than pipe
- Performance: Excellent (controlled execution timing)

**Option C: RxJS Observable with debounceTime**
- Pros: Reactive pattern, well-established Angular approach
- Cons: More complex than signals, subscription management
- Performance: Excellent (controlled execution)

### Decision

**Selected: Option B - Debounced Signal with Computed**

**Rationale**:
1. Success criteria specifies "debounced to 300ms" - explicit requirement
2. Matches existing landing.page.ts signal-based patterns (consistency)
3. Angular 20 modern pattern using `signal()` and `computed()`
4. Search across multiple fields (title, venue, description) benefits from explicit filter logic
5. Better performance control than pipes for multi-field search

**Implementation Pattern**:
```typescript
// Component
readonly searchTerm = signal<string>('');
readonly events = signal<Event[]>([]);

// Debounced search term (RxJS for debounce, then update signal)
private searchInput$ = new Subject<string>();
constructor() {
  this.searchInput$.pipe(
    debounceTime(300)
  ).subscribe(term => this.searchTerm.set(term));
}

// Filtered events (computed, reactive)
readonly filteredEvents = computed(() => {
  const term = this.searchTerm().toLowerCase();
  if (!term) return this.events();
  
  return this.events().filter(event => 
    event.title.toLowerCase().includes(term) ||
    event.venue.toLowerCase().includes(term) ||
    event.description?.toLowerCase().includes(term)
  );
});

// Template binding
onSearchInput(value: string): void {
  this.searchInput$.next(value);
}
```

**Alternatives Considered**: Pipe rejected due to lack of debounce control. RxJS-only approach rejected in favor of hybrid (RxJS debounce + signals) for better integration with existing signal patterns.

---

## Research Task 4: Responsive Grid System

### Question
Should the grid use pure CSS Grid, Bootstrap Grid classes, or Angular Flex Layout?

### Research Findings

**Option A: Pure CSS Grid**
- Pros: Modern, flexible, no framework dependency, smallest footprint
- Cons: More verbose media queries, no utility classes
- Bundle impact: 0KB (native CSS)

**Option B: Bootstrap 5 Grid**
- Pros: Already in project (0KB incremental), proven responsive classes, quick development
- Cons: Less flexible than pure Grid, utility class verbosity
- Bundle impact: 0KB (already imported)

**Option C: Angular Flex Layout**
- Pros: Declarative directives, Angular-first approach
- Cons: Project doesn't use it, deprecated in favor of CSS Grid, bundle size increase
- Bundle impact: ~15KB (new dependency)

### Decision

**Selected: Option B - Bootstrap 5 Grid System**

**Rationale**:
1. Project already imports Bootstrap 5.3.8 in package.json - zero incremental cost
2. Well-defined breakpoints match requirements:
   - `.col-12` (mobile: <768px) = 1 column
   - `.col-md-6` (tablet: 768-1199px) = 2 columns  
   - `.col-lg-3` (desktop: ≥1200px) = 4 columns
3. Rapid development with utility classes (`.row`, `.col-*`, `.g-4` for gaps)
4. Consistent with project's existing styling approach
5. Proven responsive behavior across browsers

**Implementation Pattern**:
```html
<div class="container">
  <div class="row g-4">
    @for (event of events(); track event.id) {
      <div class="col-12 col-md-6 col-lg-3">
        <app-event-card [event]="event"></app-event-card>
      </div>
    }
  </div>
</div>
```

**Alternatives Considered**: Pure CSS Grid rejected despite flexibility due to faster development with Bootstrap utilities already available. Angular Flex Layout rejected due to deprecation and unnecessary dependency.

---

## Research Task 5: Image Optimization Strategy

### Question
How should high-resolution hero carousel images be handled to meet 2-second load time requirement?

### Research Findings

**Option A: Responsive Images (srcset)**
- Pros: Native browser support, automatic selection, no JS needed
- Cons: Requires multiple image sizes generated/stored
- Performance: Excellent (optimal size per device)

**Option B: Lazy Loading with Intersection Observer**
- Pros: Defers offscreen images, reduces initial load
- Cons: Hero images always in viewport (not applicable), best for below-fold content
- Performance: N/A for hero (always visible)

**Option C: Image CDN with Auto-Optimization**
- Pros: Dynamic resizing, format selection (WebP/AVIF), caching
- Cons: Requires CDN setup, external dependency
- Performance: Excellent (optimized delivery)

**Option D: Preload Critical Images**
- Pros: Prioritizes hero image loading, native HTML feature
- Cons: Only helps with priority, doesn't reduce file size
- Performance: Good (faster fetch, but same size)

### Decision

**Selected: Multi-layered Approach**
1. **Preload first hero image** (Option D)
2. **Lazy load grid images** (Option B)
3. **Fallback placeholder on error**
4. **Defer CDN optimization** to future iteration (Option C)

**Rationale**:
1. Preloading first hero image ensures immediate visibility:
   ```html
   <link rel="preload" as="image" href="/assets/images/hero-1.jpg">
   ```
2. Grid images below fold benefit from lazy loading (built-in Angular directive)
3. Fallback handling meets error scenario requirement:
   ```typescript
   onImageError(event: Event): void {
     (event.target as HTMLImageElement).src = 'assets/images/placeholder.jpg';
   }
   ```
4. CDN integration requires infrastructure changes - deferred to avoid scope creep
5. Current approach meets 2-second requirement with proper image sizing (recommend 1920x1080 max resolution)

**Implementation Pattern**:
```html
<!-- Hero carousel -->
<img [src]="event.image_url || 'assets/images/placeholder.jpg'"
     [alt]="event.title"
     (error)="onImageError($event)"
     loading="eager">

<!-- Grid cards (below fold) -->
<img [src]="event.image_url || 'assets/images/placeholder.jpg'"
     [alt]="event.title"
     (error)="onImageError($event)"
     loading="lazy">
```

**Alternatives Considered**: Full srcset implementation rejected due to lack of multiple image sizes in current system. CDN optimization deferred to future enhancement. Focus on preload + lazy load as pragmatic first iteration.

---

## Technology Stack Summary

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| **Carousel** | Custom with Angular Animations | Extends existing pattern, minimal bundle size |
| **Pagination** | Client-side "Load More" button | Mobile-friendly, progressive disclosure |
| **Search** | Signals + RxJS debounce | Modern Angular, 300ms debounce control |
| **Grid** | Bootstrap 5 responsive classes | Already in project, zero incremental cost |
| **Images** | Preload (hero) + Lazy load (grid) | Meets 2-second load requirement |
| **State** | Angular signals | Consistency with existing landing page |
| **Routing** | Angular Router | Already configured, no changes |
| **Testing** | Jasmine + Playwright | Project standard, adequate coverage |

---

## Performance Validation

**Load Time Budget**:
- Hero carousel HTML/CSS/JS: <1.5s (critical path)
- First hero image: <2s (preload + reasonable size)
- Below-fold content: <3s (deferred, lazy-loaded)

**Runtime Performance**:
- Carousel animations: 60fps (CSS transitions, GPU-accelerated)
- Search filter: 300ms debounce + instant visual update
- Pagination: <500ms per batch load (client-side array slice)

**Bundle Size Impact**:
- New components: ~15-20KB (minified, gzipped)
- No new dependencies (uses existing Angular, Bootstrap, RxJS)
- Total page size increase: <50KB (components + images preload metadata)

---

## Accessibility Considerations

1. **Keyboard Navigation**:
   - Hero carousel: Arrow keys for manual navigation
   - All buttons: Tab-accessible with visible focus indicators
   - Search: Live region announces filter results count

2. **Screen Readers**:
   - ARIA labels: `aria-label="Previous event"` on navigation buttons
   - Live regions: `aria-live="polite"` on carousel for transitions
   - Semantic HTML: `<nav>`, `<section>`, `<article>` for structure

3. **Touch Targets**:
   - Minimum 44x44px on mobile (Bootstrap default button size)
   - Adequate spacing between interactive elements (Bootstrap gutters)

4. **Color Contrast**:
   - Maintain existing theme (already validated)
   - Overlay text on hero images: ensure sufficient contrast with gradient backgrounds

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Hero images too large (slow load) | Image size guidelines (1920x1080 max), preload only first image |
| Calendar search slow with 500+ events | Debounced filtering (300ms), computed signals optimize reactivity |
| Mobile performance on older devices | CSS transitions (GPU-accelerated), avoid JavaScript animations |
| Pagination UX unclear | Clear "Load More" button with count indicator ("Showing 12 of 45") |
| Accessibility gaps | ARIA labels, keyboard handlers, semantic HTML, manual testing |

---

## Next Phase

With all research tasks resolved, proceed to **Phase 1: Design & Contracts**:
1. Generate `data-model.md` (component interfaces, event data shapes)
2. Generate `contracts/components.ts` (TypeScript component contracts)
3. Generate `quickstart.md` (developer setup guide)
4. Update agent context with new components and patterns

**Status**: ✅ Phase 0 Complete - All NEEDS CLARIFICATION items resolved
