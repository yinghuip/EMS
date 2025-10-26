Navigate to event detail from Event Card

Short name: 003-event-card-nav

Created: 2025-10-26

Summary
-------
Make the entire Event Card clickable so that clicking the card (not only the title) navigates the user to the event detail page. This improves discoverability and makes the UI easier to use on touch devices.

Why
---
- Current behavior: only the event title (or a small link) navigates to the event detail.
- Problem: Users expect clickable cards; on touch devices tapping outer parts of the card often feels intuitive. Limiting navigation to the title reduces discoverability and increases friction.
- Value: Faster navigation to event details, improved mobile/touch usability, and a clearer affordance for users.

Actors
------
- Visitor (unauthenticated user) browsing events lists or landing page
- Keyboard users (accessibility)
- Screen reader users (ensure accessible semantics)

User scenarios (flows)
----------------------
1) Browse events list (desktop)
   - Given a user sees an event card in the events list
   - When they click anywhere on the card (except on secondary action controls like explicit CTA buttons that have other behaviors)
   - Then the app navigates to `/events/:id` for that event

2) Browse events list (mobile / touch)
   - Given a user taps an event card
   - Then the app navigates to `/events/:id`

3) Keyboard interaction
   - Given a keyboard user focuses the event card (via Tab)
   - When they press Enter or Space
   - Then the app navigates to `/events/:id`

4) Landing page featured card
   - Given the landing hero or compact cards reuse the Event Card component
   - When clicking the card it should navigate similarly to the event detail (unless the hero intentionally has different CTAs; preserve hero CTA behavior)

Functional requirements (testable)
---------------------------------
FR-1 The `EventCard` component must navigate to the event detail route `/events/:id` when the user clicks anywhere on the card surface.
  - Test: clicking the card element results in router navigation to `/events/<id>`.

FR-2 Keyboard accessibility: the card root must be keyboard-focusable and activated with Enter/Space producing the same navigation.
  - Test: ``tab`` to the card -> press Enter -> navigation to `/events/<id>`.

FR-3 Preserve existing CTA/button behaviors: if the card contains explicit action buttons (e.g., Register, Learn more) they must continue to work and should not double-trigger navigation.
  - Test: clicking the Register button triggers register flow instead of navigating to detail (or triggers its existing link target).

FR-4 Screen-reader semantics: the card must expose a clear accessible name (e.g., aria-label or role + inner heading) so users know activating the card opens event details.
  - Test: accessible name present and references event title.

FR-5 Non-breaking change: visual appearance and hover/focus styles may be enhanced to show the card is interactive but existing layout must not regress.
  - Test: snapshot or visual smoke check passes.

FR-6 Tests: Unit tests for `EventCard` and integration tests for events list and landing must be added/updated.
  - Test: `EventCard` unit test covers click, keyboard activation, and that contained buttons still function.

Success criteria (measurable & verifiable)
-----------------------------------------
- SC1: 100% of automated tests (new and existing) covering EventCard click and keyboard activation pass in CI.
- SC2: In manual QA, clicking or tapping any non-interactive area of an event card navigates to event detail 100% of the time (sample: 10 cards across pages).
- SC3: Keyboard users can navigate to and activate an event card using Tab + Enter/Space on major browsers (Chrome, Safari, Firefox) — test pass in accessibility checklist.
- SC4: No change in behavior for explicit action buttons inside the card (Register, Learn more) — their handlers still trigger expected actions.

Key entities
------------
- Event: { id, title, slug, start_datetime, ... }
- EventCard component: card DOM root, action buttons, inner title element
- Router: application routes for `/events/:id`

Assumptions
-----------
- Event detail route already exists at `/events/:id` and accepts an `id` path parameter.
- The EventCard component is a reusable standalone component used across events list and landing pages.
- If the hero component intentionally has separate CTA behaviors (e.g., Register Now), we will keep the hero CTAs unchanged; for consistency, hero may still navigate on card click unless explicitly overridden.
- Implementation will attach navigation to the card root via `routerLink` or programmatic Router navigation; tests will assert the intent rather than implementation details.

Acceptance tests (examples)
---------------------------
AT-1 Unit: EventCard navigates on click
  - Arrange: render EventCard with event id = '42' inside a RouterTestingModule
  - Act: click the card root element
  - Assert: router navigated to `/events/42`

AT-2 Unit: EventCard respects inner button actions
  - Arrange: render EventCard with a Register button that has its own click handler
  - Act: click Register button
  - Assert: register handler called; navigation to detail was not triggered by this click

AT-3 Keyboard: focus + enter activates
  - Arrange: render EventCard, focus card root
  - Act: press Enter
  - Assert: navigation to `/events/<id>`

AT-4 Integration: events list shows multiple cards; clicking second card navigates to its id
  - Render events list with sample events
  - Click second card -> expect `/events/<second-id>`

Implementation notes (non-normative)
----------------------------------
- Prefer using a semantic anchor element or a button with role="link" for accessibility; if using a div, ensure role="link" and tabindex="0" plus keyboard handlers.
- Ensure inner interactive elements (buttons, links) stop propagation where appropriate to prevent double navigation.

Spec status
-----------
Status: Ready for planning
