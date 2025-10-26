# Tasks: Landing Page Redesign

**Input**: Design documents from `/specs/004-landing-redesign/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Unit tests (Jasmine/Karma) and E2E tests (Playwright) are included per constitution requirements.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Web frontend: `ems-frontend/src/app/` for components, services, models
Tests: `ems-frontend/src/app/` for unit tests (*.spec.ts), `ems-frontend/e2e/` for E2E tests

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and environment setup

- [ ] T001 Verify Angular CLI and dependencies are installed per quickstart.md
- [ ] T002 [P] Create placeholder images in ems-frontend/src/assets/images/ (event-placeholder.jpg, hero-fallback.jpg)
- [ ] T003 [P] Review and document existing theme variables in ems-frontend/src/styles.scss

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Update Event model interface in ems-frontend/src/app/models/event.model.ts to include optional speaker_name field for past events
- [ ] T005 Update LandingPage component in ems-frontend/src/app/pages/landing/landing.page.ts to add computed signals for featuredEvents and pastEvents
- [ ] T006 [P] Create shared utility functions for date formatting in ems-frontend/src/app/utils/date-utils.ts (if not exists)
- [ ] T007 [P] Document responsive breakpoint constants in ems-frontend/src/styles.scss or shared constants file

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Hero Carousel with Large Visual Impact (Priority: P1) 🎯 MVP

**Goal**: Implement full-width hero carousel showcasing next 3-5 upcoming events with auto-rotation, manual navigation, and event selection

**Independent Test**: Load landing page and verify hero carousel displays with auto-advance every 5 seconds, manual arrow navigation works, clicking carousel navigates to event detail page

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T008 [P] [US1] Create hero carousel unit test spec in ems-frontend/src/app/components/hero-carousel/hero-carousel.component.spec.ts - test auto-advance logic
- [ ] T009 [P] [US1] Create hero carousel unit test in same file - test manual navigation (goToNext, goToPrevious)
- [ ] T010 [P] [US1] Create hero carousel unit test in same file - test event selection emission
- [ ] T011 [P] [US1] Create E2E test in ems-frontend/e2e/landing-hero-carousel.spec.ts - test carousel visibility and auto-rotation
- [ ] T012 [P] [US1] Create E2E test in same file - test manual navigation arrows click events
- [ ] T013 [P] [US1] Create E2E test in same file - test navigation to event detail on carousel click

### Implementation for User Story 1

- [ ] T014 [US1] Generate HeroCarouselComponent using Angular CLI: ng generate component components/hero-carousel --standalone
- [ ] T015 [US1] Implement component TypeScript logic in ems-frontend/src/app/components/hero-carousel/hero-carousel.component.ts (signals for currentIndex, previousIndex, direction, auto-advance timer, navigation methods)
- [ ] T016 [US1] Implement component HTML template in ems-frontend/src/app/components/hero-carousel/hero-carousel.component.html (carousel structure, navigation arrows, event info overlay, clickable card with routerLink)
- [ ] T017 [US1] Implement component SCSS styles in ems-frontend/src/app/components/hero-carousel/hero-carousel.component.scss (full-width layout, aspect ratio, carousel transitions, button styles, responsive adjustments)
- [ ] T018 [US1] Add ARIA labels and keyboard navigation support in hero carousel component (aria-label on buttons, aria-live on carousel region, keyboard event handlers)
- [ ] T019 [US1] Integrate HeroCarouselComponent into LandingPage template in ems-frontend/src/app/pages/landing/landing.page.html (add component with featuredEvents input and eventSelected output handler)
- [ ] T020 [US1] Update LandingPage component in ems-frontend/src/app/pages/landing/landing.page.ts to handle eventSelected event and navigate to event detail page
- [ ] T021 [US1] Test hero carousel with empty events array and single event edge cases
- [ ] T022 [US1] Run unit tests: npm test -- --include='**/hero-carousel.component.spec.ts'
- [ ] T023 [US1] Run E2E test: npx playwright test e2e/landing-hero-carousel.spec.ts

**Checkpoint**: Hero carousel should be fully functional - auto-rotates, manual navigation works, clicks navigate to event pages

---

## Phase 4: User Story 2 - Upcoming Shows Grid Display (Priority: P1)

**Goal**: Implement responsive event grid with pagination showing upcoming events in 4-2-1 column layout (desktop-tablet-mobile)

**Independent Test**: Scroll below hero carousel and verify upcoming events display in grid, "Load More" button works, clicking event card navigates to detail page

### Tests for User Story 2

- [ ] T024 [P] [US2] Create event grid unit test spec in ems-frontend/src/app/components/event-grid/event-grid.component.spec.ts - test pagination state management
- [ ] T025 [P] [US2] Create event grid unit test in same file - test loadMore functionality
- [ ] T026 [P] [US2] Create event grid unit test in same file - test event click emission
- [ ] T027 [P] [US2] Create event grid unit test in same file - test empty state display
- [ ] T028 [P] [US2] Create E2E test in ems-frontend/e2e/landing-event-grid.spec.ts - test grid displays with correct column counts
- [ ] T029 [P] [US2] Create E2E test in same file - test "Load More" button functionality
- [ ] T030 [P] [US2] Create E2E test in same file - test event card navigation

### Implementation for User Story 2

- [ ] T031 [US2] Generate EventGridComponent using Angular CLI: ng generate component components/event-grid --standalone
- [ ] T032 [US2] Implement component TypeScript logic in ems-frontend/src/app/components/event-grid/event-grid.component.ts (signals for displayCount, pagination state, loadMore method, event click handler)
- [ ] T033 [US2] Implement component HTML template in ems-frontend/src/app/components/event-grid/event-grid.component.html (Bootstrap grid with responsive columns, event cards with routerLink, "Load More" button, empty state)
- [ ] T034 [US2] Implement component SCSS styles in ems-frontend/src/app/components/event-grid/event-grid.component.scss (grid spacing, card hover effects, button styling, responsive adjustments)
- [ ] T035 [US2] Reuse or enhance existing EventCardComponent in ems-frontend/src/app/components/event-card/ for grid display (ensure it shows image, title, date, venue)
- [ ] T036 [US2] Integrate EventGridComponent into LandingPage template in ems-frontend/src/app/pages/landing/landing.page.html below hero carousel (pass upcomingEvents, handle eventClicked output)
- [ ] T037 [US2] Update LandingPage component in ems-frontend/src/app/pages/landing/landing.page.ts to handle event grid click navigation
- [ ] T038 [US2] Test event grid with various event counts (0, 1, 12, 50+ events) and verify pagination
- [ ] T039 [US2] Run unit tests: npm test -- --include='**/event-grid.component.spec.ts'
- [ ] T040 [US2] Run E2E test: npx playwright test e2e/landing-event-grid.spec.ts

**Checkpoint**: Event grid displays correctly with pagination, all responsive breakpoints work, navigation functional

---

## Phase 5: User Story 5 - Responsive Mobile Layout (Priority: P1)

**Goal**: Ensure all sections adapt seamlessly to mobile/tablet/desktop breakpoints with touch-friendly controls

**Independent Test**: Resize browser to 375px, 768px, 1200px widths and verify layout adapts correctly with appropriate column counts and touch targets

### Tests for User Story 5

- [ ] T041 [P] [US5] Create responsive layout E2E test in ems-frontend/e2e/landing-responsive.spec.ts - test mobile viewport (375px)
- [ ] T042 [P] [US5] Create E2E test in same file - test tablet viewport (768px)
- [ ] T043 [P] [US5] Create E2E test in same file - test desktop viewport (1200px)
- [ ] T044 [P] [US5] Create E2E test in same file - test touch target sizes on mobile (minimum 44x44px)

### Implementation for User Story 5

- [ ] T045 [US5] Add responsive media queries to hero carousel SCSS in ems-frontend/src/app/components/hero-carousel/hero-carousel.component.scss (adjust aspect ratio, font sizes, button sizes for mobile/tablet)
- [ ] T046 [US5] Verify event grid Bootstrap responsive classes in ems-frontend/src/app/components/event-grid/event-grid.component.html (.col-12 .col-md-6 .col-lg-3)
- [ ] T047 [US5] Add responsive adjustments to landing page SCSS in ems-frontend/src/app/pages/landing/landing.page.scss (container padding, section spacing for mobile)
- [ ] T048 [US5] Test all interactive elements for touch target size on mobile (carousel arrows, event cards, buttons)
- [ ] T049 [US5] Add viewport meta tag verification in ems-frontend/src/index.html (ensure viewport meta tag exists)
- [ ] T050 [US5] Test horizontal scrolling at all breakpoints and fix any overflow issues
- [ ] T051 [US5] Run E2E tests: npx playwright test e2e/landing-responsive.spec.ts

**Checkpoint**: All sections responsive at mobile (1 col), tablet (2 col), desktop (4 col) breakpoints, touch targets adequate

---

## Phase 6: User Story 3 - Interactive Show Calendar (Priority: P2)

**Goal**: Implement calendar view with month groupings, search functionality (debounced 300ms), and event listings

**Independent Test**: Scroll to calendar section, verify events grouped by month, search bar filters events in real-time matching title/venue/description

### Tests for User Story 3

- [ ] T052 [P] [US3] Create calendar view unit test spec in ems-frontend/src/app/components/calendar-view/calendar-view.component.spec.ts - test month grouping logic
- [ ] T053 [P] [US3] Create calendar view unit test in same file - test search debounce functionality (300ms)
- [ ] T054 [P] [US3] Create calendar view unit test in same file - test search filtering across title, venue, description fields
- [ ] T055 [P] [US3] Create calendar view unit test in same file - test event selection emission
- [ ] T056 [P] [US3] Create E2E test in ems-frontend/e2e/landing-calendar.spec.ts - test calendar section visibility and month groupings
- [ ] T057 [P] [US3] Create E2E test in same file - test search bar filtering updates event list
- [ ] T058 [P] [US3] Create E2E test in same file - test "Find Tickets" button navigation

### Implementation for User Story 3

- [ ] T059 [US3] Generate CalendarViewComponent using Angular CLI: ng generate component components/calendar-view --standalone
- [ ] T060 [US3] Implement component TypeScript logic in ems-frontend/src/app/components/calendar-view/calendar-view.component.ts (signals for searchTerm, filteredEvents, calendarMonths computed, RxJS debounce on search input, grouping logic)
- [ ] T061 [US3] Implement component HTML template in ems-frontend/src/app/components/calendar-view/calendar-view.component.html (search input, month sections, event entries with date/day/title/venue/button)
- [ ] T062 [US3] Implement component SCSS styles in ems-frontend/src/app/components/calendar-view/calendar-view.component.scss (search bar styling, month section headers, event entry layout, responsive adjustments)
- [ ] T063 [US3] Implement groupEventsByMonth utility function in component or separate utility file (group events by month string, sort by date)
- [ ] T064 [US3] Add search input with debounce logic using RxJS debounceTime(300) operator in component
- [ ] T065 [US3] Integrate CalendarViewComponent into LandingPage template in ems-frontend/src/app/pages/landing/landing.page.html below event grid (pass upcomingEvents, handle eventSelected)
- [ ] T066 [US3] Test calendar with various event distributions (single month, multiple months, empty months, search edge cases)
- [ ] T067 [US3] Run unit tests: npm test -- --include='**/calendar-view.component.spec.ts'
- [ ] T068 [US3] Run E2E test: npx playwright test e2e/landing-calendar.spec.ts

**Checkpoint**: Calendar displays events grouped by month, search filters in real-time with 300ms debounce, navigation works

---

## Phase 7: User Story 4 - Past Concerts Archive Gallery (Priority: P3)

**Goal**: Implement past concerts grid showing 8-12 most recent past events with "View More" link

**Independent Test**: Scroll to bottom, verify past concerts section displays with event images and names, "View More" link appears if more than 12 events

### Tests for User Story 4

- [ ] T069 [P] [US4] Create past concerts unit test spec in ems-frontend/src/app/components/past-concerts/past-concerts.component.spec.ts - test display count limit (8-12)
- [ ] T070 [P] [US4] Create past concerts unit test in same file - test "View More" link visibility logic
- [ ] T071 [P] [US4] Create past concerts unit test in same file - test event click emission
- [ ] T072 [P] [US4] Create past concerts unit test in same file - test empty state hiding
- [ ] T073 [P] [US4] Create E2E test in ems-frontend/e2e/landing-past-concerts.spec.ts - test past concerts section displays
- [ ] T074 [P] [US4] Create E2E test in same file - test "View More" link functionality
- [ ] T075 [P] [US4] Create E2E test in same file - test event card navigation

### Implementation for User Story 4

- [ ] T076 [US4] Generate PastConcertsComponent using Angular CLI: ng generate component components/past-concerts --standalone
- [ ] T077 [US4] Implement component TypeScript logic in ems-frontend/src/app/components/past-concerts/past-concerts.component.ts (signals for displayCount, maxDisplay=12, hasMore computed, showMore method)
- [ ] T078 [US4] Implement component HTML template in ems-frontend/src/app/components/past-concerts/past-concerts.component.html (grid with responsive columns, event images with name overlay, "View More" link, empty state)
- [ ] T079 [US4] Implement component SCSS styles in ems-frontend/src/app/components/past-concerts/past-concerts.component.scss (grid layout, image aspect ratio, name overlay styling, responsive 4-2-1 columns)
- [ ] T080 [US4] Update LandingPage component in ems-frontend/src/app/pages/landing/landing.page.ts to add pastEvents computed signal (filter events with start_datetime < now, sort by date descending)
- [ ] T081 [US4] Integrate PastConcertsComponent into LandingPage template in ems-frontend/src/app/pages/landing/landing.page.html at bottom (pass pastEvents, handle eventClicked and viewMoreClicked)
- [ ] T082 [US4] Handle empty pastEvents array to hide section in landing page or component
- [ ] T083 [US4] Test with various past event counts (0, 5, 12, 20+ events) and verify display logic
- [ ] T084 [US4] Run unit tests: npm test -- --include='**/past-concerts.component.spec.ts'
- [ ] T085 [US4] Run E2E test: npx playwright test e2e/landing-past-concerts.spec.ts

**Checkpoint**: Past concerts gallery displays 8-12 events, "View More" appears when needed, section hidden if no past events

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final quality checks

- [ ] T086 [P] Add loading states for event data in ems-frontend/src/app/pages/landing/landing.page.html (skeleton loaders or spinners)
- [ ] T087 [P] Implement image lazy loading for below-fold content (event grid, calendar, past concerts) using loading="lazy" attribute
- [ ] T088 [P] Add error handling for image load failures across all components (onError handler with fallback placeholder)
- [ ] T089 [P] Verify all ARIA labels and semantic HTML across components for accessibility compliance
- [ ] T090 [P] Test keyboard navigation flow through all interactive elements (Tab key navigation order)
- [ ] T091 [P] Add console.log removal or guard for production builds in all components
- [ ] T092 [P] Verify color theme consistency across all new components (use CSS variables from styles.scss)
- [ ] T093 Performance audit: Test hero carousel load time <2s, verify 60fps transitions
- [ ] T094 Performance audit: Test calendar search debounce <300ms, grid pagination <500ms
- [ ] T095 [P] Run full E2E test suite: npm run test:e2e
- [ ] T096 [P] Run full unit test suite with coverage: ng test --code-coverage --watch=false
- [ ] T097 Code review: Check all components follow Angular standalone pattern and signal-based state
- [ ] T098 Code review: Verify all components have proper TypeScript types and no 'any' usage
- [ ] T099 [P] Update landing page documentation in project README if needed
- [ ] T100 Run quickstart.md validation steps (ng serve, ng build, test commands)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 (Hero Carousel) - P1: Can start after Foundational - MVP candidate
  - US2 (Event Grid) - P1: Can start after Foundational - MVP candidate
  - US5 (Responsive) - P1: Can start after US1 and US2 completion (adds responsive styles)
  - US3 (Calendar) - P2: Can start after Foundational
  - US4 (Past Concerts) - P3: Can start after Foundational
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1 - Hero Carousel)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1 - Event Grid)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 5 (P1 - Responsive)**: Depends on US1 and US2 completion (adds responsive styling to existing components)
- **User Story 3 (P2 - Calendar)**: Can start after Foundational (Phase 2) - Independently testable
- **User Story 4 (P3 - Past Concerts)**: Can start after Foundational (Phase 2) - Independently testable

### Within Each User Story

1. Tests MUST be written and FAIL before implementation
2. Component generation (ng generate) before implementation
3. TypeScript logic before HTML template
4. HTML template before SCSS styling
5. Component integration into landing page
6. Run component-specific tests
7. Story complete before moving to next priority

### Parallel Opportunities

**Setup Phase (Phase 1)**:
- T002 and T003 can run in parallel (different files)

**Foundational Phase (Phase 2)**:
- T006 and T007 can run in parallel (different files)

**User Story Tests**: All test files for a story can be written in parallel (marked with [P])

**After Foundational Complete**:
- US1 (Hero Carousel) and US2 (Event Grid) can be developed in parallel by different developers
- US3 (Calendar) and US4 (Past Concerts) can be developed in parallel after US1/US2, or alongside them

**Polish Phase (Phase 8)**:
- Most polish tasks (T086-T092, T095-T099) can run in parallel as they touch different concerns

---

## Parallel Example: User Story 1 (Hero Carousel)

```bash
# Write all tests in parallel:
Task T008: "Create hero carousel unit test spec - auto-advance"
Task T009: "Create unit test - manual navigation"
Task T010: "Create unit test - event selection"
Task T011: "Create E2E test - carousel visibility"
Task T012: "Create E2E test - manual navigation arrows"
Task T013: "Create E2E test - navigation to event detail"

# After component generation (T014), work sequentially:
# T015 (TypeScript) → T016 (HTML) → T017 (SCSS) → T018 (Accessibility) → T019-T023 (Integration & Testing)
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T007) - CRITICAL
3. Complete Phase 3: Hero Carousel (T008-T023)
4. Complete Phase 4: Event Grid (T024-T040)
5. Complete Phase 5: Responsive Layout (T041-T051)
6. **STOP and VALIDATE**: Test landing page with hero + grid + responsive
7. Deploy/demo MVP if ready

**MVP Scope**: Landing page with hero carousel (auto-rotating featured events) + event grid (paginated upcoming events) + responsive design

### Incremental Delivery

1. **Foundation** (Phase 1-2) → Ready for components
2. **MVP** (Phase 3-5: US1, US2, US5) → Hero + Grid + Responsive → Deploy/Demo
3. **Calendar** (Phase 6: US3) → Add search-based discovery → Deploy/Demo
4. **Archive** (Phase 7: US4) → Add social proof → Deploy/Demo
5. **Polish** (Phase 8) → Final refinements → Production ready

### Parallel Team Strategy

With 2+ developers after Foundational phase:

1. **Team completes Phase 1-2 together** (Setup + Foundation)
2. **Split User Stories**:
   - Developer A: US1 (Hero Carousel) - T008-T023
   - Developer B: US2 (Event Grid) - T024-T040
3. **Merge and test together**: US5 (Responsive) - T041-T051
4. **Parallel again**:
   - Developer A: US3 (Calendar) - T052-T068
   - Developer B: US4 (Past Concerts) - T069-T085
5. **Team completes Phase 8 together** (Polish)

---

## Notes

- **Tests Required**: Constitution requires unit tests (Jasmine/Karma) and E2E tests (Playwright)
- **[P] tasks**: Different files, no dependencies on incomplete work
- **[Story] label**: Maps task to specific user story for traceability
- **File paths**: Always include exact file path in task description
- **Standalone components**: All new components use Angular standalone pattern
- **Signals-based state**: Use signal() and computed() for reactive state
- **Bootstrap grid**: Use existing Bootstrap 5 responsive classes (.col-12 .col-md-6 .col-lg-3)
- **No backend changes**: All data transformations client-side using existing EventService
- **Accessibility**: ARIA labels, keyboard navigation, semantic HTML required
- **Performance**: Verify 2s hero load, 60fps transitions, 300ms search debounce
- **Commit strategy**: Commit after each task or logical group
- **Stop at checkpoints**: Validate each user story independently before proceeding

---

## Task Count Summary

- **Total Tasks**: 100
- **Setup**: 3 tasks
- **Foundational**: 4 tasks (BLOCKING)
- **User Story 1 (Hero Carousel)**: 16 tasks (6 tests + 10 implementation)
- **User Story 2 (Event Grid)**: 17 tasks (7 tests + 10 implementation)
- **User Story 5 (Responsive)**: 11 tasks (4 tests + 7 implementation)
- **User Story 3 (Calendar)**: 17 tasks (7 tests + 10 implementation)
- **User Story 4 (Past Concerts)**: 17 tasks (7 tests + 10 implementation)
- **Polish**: 15 tasks

**Suggested MVP**: Phase 1-5 (US1 + US2 + US5) = 51 tasks total
**Full Feature**: All 100 tasks
