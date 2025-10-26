# Quickstart Guide: Landing Page Redesign

**Feature**: Landing Page Redesign  
**Branch**: `004-landing-redesign`  
**Date**: October 26, 2025

## Overview

This guide helps developers set up their environment, understand the architecture, and begin implementing the landing page redesign feature.

---

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Git

---

## Setup

### 1. Clone and Checkout Feature Branch

```bash
cd /path/to/EMS
git checkout 004-landing-redesign
```

### 2. Install Dependencies

```bash
cd ems-frontend
npm install
```

### 3. Start Development Server

```bash
npm start
# Or: ng serve
```

Application runs at `http://localhost:4200`

### 4. Verify Setup

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Build for production
npm run build
```

---

## Project Structure

```
ems-frontend/
├── src/
│   ├── app/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── hero-carousel/   # NEW: Hero carousel component
│   │   │   ├── event-grid/      # NEW: Event grid with pagination
│   │   │   ├── calendar-view/   # NEW: Calendar with search
│   │   │   ├── past-concerts/   # NEW: Past concerts gallery
│   │   │   └── event-card/      # EXISTING: Event card component
│   │   ├── pages/
│   │   │   └── landing/         # MODIFIED: Landing page orchestrator
│   │   ├── services/
│   │   │   └── event.service.ts # EXISTING: Event data service
│   │   └── models/
│   │       └── event.model.ts   # EXISTING: Event interface
│   ├── styles.scss              # Global styles & theme variables
│   └── assets/
│       └── images/              # Static images, placeholders
├── e2e/                         # Playwright E2E tests
├── angular.json                 # Angular CLI configuration
├── package.json                 # Dependencies
└── tsconfig.json                # TypeScript configuration
```

---

## Development Workflow

### 1. Create New Component

```bash
# Generate standalone component
ng generate component components/hero-carousel --standalone

# Files created:
# - hero-carousel.component.ts
# - hero-carousel.component.html
# - hero-carousel.component.scss
# - hero-carousel.component.spec.ts
```

### 2. Component Development Pattern

```typescript
// hero-carousel.component.ts
import { Component, input, output, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-hero-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-carousel.component.html',
  styleUrls: ['./hero-carousel.component.scss']
})
export class HeroCarouselComponent {
  // Inputs (signals)
  events = input.required<Event[]>();
  autoAdvanceInterval = input<number>(5000);
  
  // Outputs
  eventSelected = output<Event>();
  
  // Internal state (signals)
  readonly currentIndex = signal<number>(0);
  readonly direction = signal<'next' | 'prev'>('next');
  
  // Computed values
  readonly currentEvent = computed(() => 
    this.events()[this.currentIndex()]
  );
  
  // Lifecycle
  constructor() {
    effect(() => {
      // Auto-advance logic
    });
  }
  
  // Methods
  goToNext(): void {
    // Implementation
  }
}
```

### 3. Styling Guidelines

**Theme Variables** (in `src/styles.scss`):
```scss
// Reference existing theme colors
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --background-color: #ffffff;
  --text-color: #212529;
  // ... existing theme variables
}

// Use in components
.hero-carousel {
  background-color: var(--background-color);
  color: var(--text-color);
}
```

**Bootstrap Utilities**:
```html
<!-- Responsive grid -->
<div class="container">
  <div class="row g-4">
    <div class="col-12 col-md-6 col-lg-3">
      <!-- Event card -->
    </div>
  </div>
</div>
```

**Component Scoped Styles**:
```scss
// hero-carousel.component.scss
:host {
  display: block;
  width: 100%;
}

.carousel {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  
  @media (max-width: 768px) {
    aspect-ratio: 4 / 3;
  }
}
```

### 4. Testing

**Unit Tests** (Jasmine/Karma):
```typescript
// hero-carousel.component.spec.ts
describe('HeroCarouselComponent', () => {
  let component: HeroCarouselComponent;
  let fixture: ComponentFixture<HeroCarouselComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroCarouselComponent]  // Standalone component
    }).compileComponents();
    
    fixture = TestBed.createComponent(HeroCarouselComponent);
    component = fixture.componentInstance;
  });
  
  it('should advance to next event on goToNext()', () => {
    component.events = signal([mockEvent1, mockEvent2]);
    component.goToNext();
    expect(component.currentIndex()).toBe(1);
  });
  
  it('should emit eventSelected on CTA click', () => {
    spyOn(component.eventSelected, 'emit');
    component.selectEvent(mockEvent1);
    expect(component.eventSelected.emit).toHaveBeenCalledWith(mockEvent1);
  });
});
```

**E2E Tests** (Playwright):
```typescript
// e2e/landing-redesign.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Landing Page Redesign', () => {
  test('should display hero carousel', async ({ page }) => {
    await page.goto('/');
    
    const carousel = page.locator('.hero-carousel');
    await expect(carousel).toBeVisible();
    
    const carouselItem = carousel.locator('.carousel-item.active');
    await expect(carouselItem).toBeVisible();
  });
  
  test('should navigate carousel on arrow click', async ({ page }) => {
    await page.goto('/');
    
    const nextButton = page.locator('.carousel-control-next');
    await nextButton.click();
    
    // Wait for transition
    await page.waitForTimeout(500);
    
    // Verify index changed
    const activeItem = page.locator('.carousel-item.active');
    await expect(activeItem).toBeVisible();
  });
});
```

### 5. Running Tests

```bash
# Unit tests (watch mode)
npm test

# Unit tests (single run with coverage)
ng test --code-coverage --watch=false

# E2E tests
npm run test:e2e

# E2E tests (headed mode for debugging)
npx playwright test --headed

# E2E tests (specific file)
npx playwright test e2e/landing-redesign.spec.ts
```

---

## Key Patterns & Conventions

### Signals-Based State Management

```typescript
// ✅ Use signals for reactive state
readonly count = signal<number>(0);
readonly items = signal<Item[]>([]);

// ✅ Use computed for derived state
readonly filteredItems = computed(() => 
  this.items().filter(item => item.active)
);

// ✅ Use effect for side effects
constructor() {
  effect(() => {
    console.log('Count changed:', this.count());
  });
}

// ❌ Avoid getters for derived state
get filteredItems(): Item[] {
  return this.items().filter(item => item.active);  // Recalculates every CD
}
```

### Component Communication

```typescript
// Parent → Child: Use input signals
@Component({
  template: '<app-child [data]="myData()" />'
})

// Child → Parent: Use output events
@Component({
  selector: 'app-child'
})
class ChildComponent {
  itemClicked = output<Item>();
  
  onClick(item: Item): void {
    this.itemClicked.emit(item);
  }
}
```

### Async Data Handling

```typescript
// ✅ Convert Observable to Signal
readonly events = toSignal(this.eventService.getEvents(), { 
  initialValue: [] 
});

// ✅ Use async pipe in templates (for Observables)
<div *ngIf="events$ | async as events">
  @for (event of events; track event.id) {
    <!-- content -->
  }
</div>

// ✅ Use signals directly (after toSignal conversion)
<div>
  @for (event of events(); track event.id) {
    <!-- content -->
  }
</div>
```

### Control Flow (Angular 17+)

```typescript
// ✅ Use @if/@for/@switch (modern)
@if (events().length > 0) {
  @for (event of events(); track event.id) {
    <app-event-card [event]="event" />
  }
} @else {
  <p>No events found</p>
}

// ❌ Avoid *ngIf/*ngFor (legacy)
<div *ngIf="events.length > 0">
  <div *ngFor="let event of events; trackBy: trackById">
    <!-- content -->
  </div>
</div>
```

---

## Common Tasks

### Add a New Route

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'events', component: EventsListPage },
  { path: 'events/:id', component: EventDetailPage },
  // ... existing routes
];
```

### Access Route Parameters

```typescript
import { ActivatedRoute } from '@angular/router';

export class EventDetailPage {
  private route = inject(ActivatedRoute);
  
  readonly eventId = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id')))
  );
}
```

### Navigate Programmatically

```typescript
import { Router } from '@angular/router';

export class LandingPage {
  private router = inject(Router);
  
  navigateToEvent(event: Event): void {
    this.router.navigate(['/events', event.id]);
  }
}
```

### Add Global Style

```scss
// src/styles.scss
.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  
  &:hover {
    background-color: darken(var(--primary-color), 10%);
  }
}
```

### Add Component Style

```scss
// component.scss (scoped to component)
:host {
  display: block;
}

.event-card {
  border-radius: 8px;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-4px);
  }
}
```

---

## Debugging Tips

### Angular DevTools

```bash
# Install Chrome extension: Angular DevTools
# View component tree, change detection, profiler
```

### Console Logging

```typescript
// Use effect for debugging signals
effect(() => {
  console.log('Events changed:', this.events());
}, { allowSignalWrites: false });
```

### Source Maps

```bash
# Development builds include source maps
ng serve  # Source maps enabled by default

# Production builds (minified, no source maps)
ng build --configuration production
```

### Network Debugging

```typescript
// Intercept HTTP requests (for debugging)
import { HttpInterceptor } from '@angular/common/http';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('HTTP Request:', req.url);
    return next.handle(req);
  }
}
```

---

## Build & Deploy

### Development Build

```bash
ng build
# Output: dist/ems-frontend/
```

### Production Build

```bash
ng build --configuration production
# Output: dist/ems-frontend/ (minified, optimized)
```

### Build Analysis

```bash
# Analyze bundle size
ng build --stats-json
npx webpack-bundle-analyzer dist/ems-frontend/stats.json
```

---

## Troubleshooting

### Port Already in Use

```bash
# Use different port
ng serve --port 4300
```

### Clear Cache

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Regenerate tsconfig
ng update @angular/cli @angular/core

# Check TypeScript version matches project
npm list typescript
```

### Test Failures

```bash
# Clear Karma cache
rm -rf .angular/cache

# Run tests in debug mode
ng test --browsers=ChromeDebug
```

---

## Resources

- **Angular Documentation**: https://angular.dev
- **Angular Signals Guide**: https://angular.dev/guide/signals
- **Bootstrap 5 Docs**: https://getbootstrap.com/docs/5.3/
- **Playwright Docs**: https://playwright.dev/
- **RxJS Documentation**: https://rxjs.dev/

---

## Next Steps

1. ✅ Setup complete - environment ready
2. 📋 Review contracts in `specs/004-landing-redesign/contracts/`
3. 📋 Review data model in `specs/004-landing-redesign/data-model.md`
4. 🚀 Begin component implementation (see tasks.md when generated)
5. ✅ Write tests alongside implementation
6. 🔍 Run E2E tests before PR

---

**Questions?** Refer to `specs/004-landing-redesign/plan.md` for architecture overview.
