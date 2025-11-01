# Feature Specification: Carousel Manual Controls & Layout Enhancements

**Feature Branch**: `001-carousel-controls`  
**Created**: 2025-10-26  
**Status**: Draft  
**Input**: User description: "Reduce upcoming event carousel size by 50%. Add arrows for user to manually cycle through the events. If item is last item in the list, when user click next, cycle back to first item again. Include title, start date, end date on top of event image. Make text more prominent."

## User Scenarios & Testing (mandatory)

### User Story 1 - Manual carousel navigation (Priority: P1)

As a visitor, I want to click previous/next arrows to manually navigate through upcoming events so I can browse at my own pace.

**Why this priority**: Gives users control over browsing speed; essential for accessibility and user preference.

**Independent Test**: Load the landing page with multiple upcoming events; click next arrow repeatedly and verify it cycles through all items and wraps back to first; click previous and verify reverse cycling.

**Acceptance Scenarios**:

1. **Given** the carousel displays multiple events, **When** I click the "next" arrow, **Then** the carousel advances to the next event with a fade transition.
2. **Given** the carousel is showing the last event, **When** I click "next", **Then** it cycles back to the first event.
3. **Given** the carousel is showing the first event, **When** I click "previous", **Then** it cycles to the last event.
4. **Given** I manually navigate, **When** I stop interacting, **Then** auto-advance resumes after 5 seconds from the last manual interaction.

---

### User Story 2 - Compact carousel display (Priority: P2)

As a visitor, I want the carousel to occupy less vertical space so I can see more page content without scrolling.

**Why this priority**: Improves page density and reduces scrolling; secondary to navigation functionality.

**Independent Test**: Measure carousel height before/after; verify it is reduced by approximately 50% (e.g., from 16:9 aspect to ~8:9 or similar).

**Acceptance Scenarios**:

1. **Given** the carousel is rendered, **When** I view the landing page, **Then** the carousel height is 50% of the original size.
2. **Given** the reduced size, **When** images are displayed, **Then** they remain properly scaled and not distorted.

---

### User Story 3 - Clear event metadata (Priority: P3)

As a visitor, I want to see the event title, start date, and end date prominently overlaid on the carousel image so I can quickly understand event details.

**Why this priority**: Improves information scannability; complements navigation but not blocking.

**Independent Test**: View a carousel item; verify title, start date, and end date are visible, legible, and prominently styled.

**Acceptance Scenarios**:

1. **Given** a carousel item is active, **When** I view it, **Then** the event title is displayed prominently with high contrast and readable font size.
2. **Given** the event has start and end dates, **When** displayed, **Then** dates are formatted clearly (e.g., "Mar 18, 2026 – Mar 18, 2026" or "Mar 18, 2026") and visible.
3. **Given** the text overlay, **When** viewed on various backgrounds, **Then** text remains legible (sufficient contrast via background overlay or shadow).

---

### Edge Cases

- Single upcoming event: arrows are shown but clicking them does nothing or wraps to the same item (graceful no-op).
- No upcoming events: carousel and arrows are hidden; friendly message shown.
- Auto-advance interaction: manual click pauses or resets the 5-second timer to avoid conflicting transitions.
- Long event titles: text truncates or wraps without breaking layout; dates remain visible.
- Date formatting: handle same-day events (show single date) vs multi-day (show date range).

## Requirements (mandatory)

### Functional Requirements

- **FR-001**: Carousel height is reduced by 50% (e.g., aspect ratio changes from 16:9 to approximately 8:9 or similar vertical compression).
- **FR-002**: Previous and next arrow buttons are displayed on the carousel at all times when there are upcoming events.
- **FR-003**: Clicking "next" advances to the next item; clicking on the last item cycles to the first item.
- **FR-004**: Clicking "previous" goes to the previous item; clicking on the first item cycles to the last item.
- **FR-005**: Arrow buttons are keyboard accessible (focusable and activatable with Enter/Space).
- **FR-006**: Event title, start date, and end date are overlaid on the carousel image with prominent styling (large font, high contrast).
- **FR-007**: Date formatting is user-friendly (e.g., "Mar 18, 2026" or "Mar 18 – Mar 20, 2026" for multi-day events).
- **FR-008**: Auto-advance timer resets or pauses when user manually navigates (5-second countdown starts from the last manual interaction).
- **FR-009**: Text overlay has sufficient contrast (background gradient, shadow, or semi-transparent backdrop) to remain legible on all images.
- **FR-010**: Navigation arrows are visually distinct and easy to click (sufficient size, hover states).

### Key Entities (data involved)

- Event: id, title, start_datetime, end_datetime, image_url, slug (used for navigation and display).

## Success Criteria (mandatory)

### Measurable Outcomes

- **SC-001**: Carousel height is measured at 50% ± 10% of the original height across desktop and tablet viewports.
- **SC-002**: Users can cycle through all upcoming events using arrows; 100% of next/previous clicks navigate correctly with wrapping.
- **SC-003**: On the last item, clicking "next" returns to the first item within 400ms (fade transition time).
- **SC-004**: Event title and dates are legible with a contrast ratio of at least 4.5:1 against the background.
- **SC-005**: Manual navigation resets the auto-advance timer; auto-advance resumes 5 seconds after the last user interaction.

## Assumptions

- The carousel already exists and auto-advances every 5 seconds; this spec extends it with manual controls and layout changes.
- Date formatting uses a standard locale-aware format (e.g., browser's Intl.DateTimeFormat or similar).
- "50% size reduction" refers to vertical height; width remains responsive/full-width.

## Dependencies & Risks

- Depends on existing carousel implementation and event data structure.
- Risk: Reduced height may make images less impactful; mitigated by ensuring images scale well and text remains prominent.

## Out of Scope

- Swipe gestures for touch devices (can be added later).
- Pagination indicators (dots showing current position).
- Customizing auto-advance interval or disabling it entirely.
