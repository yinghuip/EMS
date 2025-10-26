# Feature Specification: Landing — top upcoming events

**Feature Branch**: `002-landing-upcoming-events`
**Created**: 2025-10-26
**Status**: Draft
**Input**: Update landing page to display the top 3 upcoming events happening in the next 90 days; match site theme and accessibility standards.

## Summary
Show a concise list of up to three upcoming events on the landing page. "Upcoming" is defined as events whose start date/time is within the next 90 days (inclusive). Items must be ordered by start date/time (soonest first). Each entry is tappable/clickable and links to the event detail page. If fewer than three upcoming events exist, show only the available events. When none exist, show a friendly message and a CTA to view the full Events page.

## User Scenarios & Testing (mandatory)

### User Story 1 — See immediate upcoming events (Priority: P1)
As a visitor, I want to see the next few events happening soon so I can quickly find things to attend.

Independent Test: Open the landing page and confirm up to three events are shown. Each event shown must have start date/time falling within the next 90 days and must be ordered soonest-first.

Acceptance Scenarios:
1. Given multiple events in the next 90 days, When I open the landing page, Then I see at most three event cards ordered by start date/time (soonest first) with the page section labeled "Upcoming events".
2. Given fewer than three events in the next 90 days, When I open the landing page, Then I see only the available event(s) (0–3) and a link to view all events.
3. Given no events in the next 90 days, When I open the landing page, Then I see a friendly message (e.g., "No upcoming events in the next 90 days") and a CTA to view all events or subscribe for updates.
4. Given an event card, When I click/tap it, Then I am navigated to the event detail page for that event.

### User Story 2 — Accessibility & quick scan (Priority: P2)
As a user relying on keyboard or screen reader, I want the event list to be accessible so I can navigate and perceive event metadata easily.

Independent Test: Tab through the landing page and verify each event card is keyboard-focusable and each metadata (date, title, short description, location) is readable by a screen reader.

Acceptance Scenarios:
1. Each event card must be reachable via keyboard (tab) and expose a meaningful accessible name (e.g., "Event: Modern Web Conference, March 18, 2026").
2. The section header must be marked as a landmark/heading and announced by screen readers.

### Edge Cases
- Two events share the same start date/time: tiebreaker is stable sort by title (A→Z).
- Events with missing short description or location: show placeholder text such as "Location TBD" or omit gracefully.
- Timezone differences: use the event's start_datetime (ISO timestamp) interpreted in the user's local timezone for display and in comparisons.

## Requirements (mandatory)

- FR-001: The landing page MUST include a section titled "Upcoming events" visible on desktop and mobile.
- FR-002: The landing section MUST display up to three events whose start_datetime is within the next 90 days (inclusive).
- FR-003: Events MUST be ordered soonest-first (earliest start_datetime first).
- FR-004: Each event card MUST display: title, start date/time (formatted for the locale), short description (<=150 chars if available), and location (or "Location TBD").
- FR-005: Each event card MUST be a link to the event detail page and keyboard-focusable.
- FR-006: If fewer than 3 upcoming events exist, show only the available events and a link/button to "View all events".
- FR-007: If no upcoming events exist within 90 days, show a clear empty state with a CTA to view all events or subscribe.
- FR-008: The section must follow the global site theme and styling conventions.
- FR-009: Date comparisons MUST use the event's ISO start_datetime and consider the user's local timezone for presentation and for determining "within 90 days".
- FR-010: Sorting tiebreaker: for identical start_datetime, sort alphabetically by title.
- FR-011: The section MUST be testable via automated UI tests (selectors and semantic labels present).

## Key Entities

- Event (from existing domain model) — key fields used:
  - id (string)
  - title (string)
  - start_datetime (ISO string)
  - short_description (string, optional)
  - location (object with name/address, optional)
  - slug or id for linking

## Success Criteria (mandatory)

- SC-001: The landing page shows at most three events, each with start_datetime within the next 90 days (inclusive) and ordered soonest-first.
- SC-002: Clicking any event opens its event detail page in under 2 seconds (median in local dev environment).
- SC-003: When there are zero events in the next 90 days, the empty state and CTA are visible and actionable.
- SC-004: 100% of interactive elements in the section are keyboard-focusable and have accessible names.
- SC-005: The section renders in under 2 seconds (median) on a typical dev machine.

## Assumptions

- Use the existing `EventService` API (in-memory eventsSignal for local dev) to source events.
- "Within 90 days" is calculated from current client time (now) and includes events starting exactly 90 days from now.
- Date/time display will be localized using the app's existing date pipe/formatting conventions.
- The landing section is read-only (no inline filtering by users) and always shows the top 3 by default.

## Implementation notes (non-normative)

- Implementation should filter events by comparing `new Date(event.start_datetime)` against `now` and `now + 90 days`.
- For consistency with the rest of the app, display date/time using the same formatting pipe used elsewhere (e.g., `date:'medium'`).
- Add a clearly labeled link/button "View all events" that routes to `/events`.
- Ensure the event cards used on landing reuse the existing `app-event-card` component, but provide an input or variant that supports the compact display required on the landing page.

## Testing notes

- Unit tests: add tests for the filtering function (eventsWithinNext90Days), ordering, and tiebreaker behavior.
- E2E tests: ensure landing page shows up to three upcoming events and that the "View all events" link navigates to `/events`.

## Notes

- This spec focuses on presentation and filtering on the landing page only; it does not change the global events API or event model.
- If requirements change (e.g., to show 5 events or a different timeframe), update FR-002 accordingly.

