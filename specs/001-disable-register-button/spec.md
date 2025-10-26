```markdown
# Feature Specification: Disable Register Button for Started Events

**Feature Branch**: `001-disable-register-button`  
**Created**: 2025-10-26  
**Status**: Draft  
**Input**: User description: "i want to disable register button if event has already started"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Prevent new registrations after event start (Priority: P1)

As a site visitor who wants to register for an event, I must not be able to start a new registration if the event has already started so that registrations are only accepted before the event begins.

**Why this priority**: Prevents users from registering for an event they have already missed and protects business rules about registration windows.

**Independent Test**: Open an event whose start time is in the past and verify the register action is disabled and submitting a registration is not possible.

**Acceptance Scenarios**:

1. **Given** an event with start time in the past, **When** a visitor views the event detail page, **Then** the register button is disabled (not clickable), and an explanatory label or tooltip is shown (e.g., "Event started").
2. **Given** an event with start time in the past, **When** a visitor views the event in a list or card, **Then** the register control on the card is disabled and shows the same explanatory label.
3. **Given** the event starts right now (edge timing), **When** the page is viewed/auto-updated, **Then** the register control becomes disabled within 5 seconds and shows the explanatory label.

---

### User Story 2 - Already-registered users (Priority: P2)

As a user who registered before the event start, I should still be able to view my registration details but not create duplicate registrations after the event starts.

**Why this priority**: Preserves user access to their registration while preventing duplicate registrations.

**Independent Test**: For a user who already has a registration, view the event after start and verify there is no option to register again; existing registration details remain viewable.

**Acceptance Scenarios**:

1. **Given** a user already registered, **When** they view the event after its start time, **Then** they see a read-only/confirmation state (e.g., "Registered") and no option to submit another registration.

---

### User Story 3 - Future events (Priority: P3)

As a visitor viewing upcoming events, I should see a working register button for events that have not yet started.

**Why this priority**: Ensures registrations remain possible for upcoming events.

**Independent Test**: Open an event with start time in the future and verify the register control is enabled and functions normally.

**Acceptance Scenarios**:

1. **Given** an event that starts in the future, **When** a visitor views the event, **Then** the register button is enabled and allows starting a registration flow.

---

### Edge Cases

- Events with missing or malformed start time: the register control should default to "enabled" and flag the event for content review.
- Timezone differences between user device and event's official timezone (see Assumptions).
- Recurring events or events that change start time after a user loads the page: UI should update to reflect the latest start time when the user reloads or navigates.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST determine whether an event has started using the event's official start time and the current authoritative time.
- **FR-002**: The register control (button or link) MUST be visually and programmatically disabled for any event whose start time is in the past or equal to the authoritative current time.
- **FR-003**: Disabled register controls MUST display an explanatory label or tooltip (e.g., "Event started") so users understand why registration is not available.
- **FR-004**: The disabled state MUST appear consistently in all places where registration is offered: event list cards, event detail page, and the registration page entry point.
- **FR-005**: Attempts to submit a new registration for an event that has already started MUST be declined and the user shown a clear message indicating registration is closed for that event.
- **FR-006**: Users who completed registration before the event started MUST retain read-only access to their registration details after start, and MUST NOT be able to create duplicate registrations.
- **FR-007**: The UI MUST update within a short, user-meaningful interval after an event's start time (target: within 5 seconds of the authoritative start time being reached) to avoid confusing users around the exact start moment.

### Key Entities *(include if feature involves data)*

- **Event**: id, title, startTime, registrationOpen (conceptual) — used to determine registration availability.
- **Registration**: id, eventId, userId, status — represents an existing registration and is used to decide whether the user can create another registration.
- **User**: id, name, (contextual attributes used for UI personalization)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of events with start time <= authoritative current time show the register control disabled in both list and detail views.
- **SC-002**: 100% of attempted new registrations for events already started are prevented, and users receive a clear message explaining registration is closed.
- **SC-003**: The UI reflects the event-started state within 5 seconds of the start time in at least 95% of observed cases (to account for client update intervals and clock skew).
- **SC-004**: 0% of future events (start time in future) show the register control disabled.
- **SC-005**: Automated tests exist that cover primary scenarios (P1–P3) and a set of edge cases (timezones, missing startTime).

## Assumptions

- Events expose a reliable start timestamp (ISO 8601) in the app's data model.
- The system has an authoritative notion of "current time" (server or coordinated time) used to decide whether an event has started; client devices may have small clock skew.
- The product owner prefers disabling the UI control and preventing submissions rather than allowing late registrations.
- Existing registrations taken before start are valid and should remain viewable.

## Notes / Non-Goals

- This feature does not change registration refund/cancellation policies or post-start check-in workflows.
- This spec focuses on preventing new registrations after start; how organizers manage attendees after start (check-in, waitlists) is out of scope.

## Test Cases (examples)

1. List view: event with past startTime -> register control disabled and shows "Event started".
2. Detail view: event with past startTime -> register button disabled and clicking it does nothing but shows explanatory message.
3. Registration attempt: direct API/submit attempt after event start -> no new registration created and user shown message "Registration closed — event has started".
4. Already-registered user: view event after start -> see "Registered" state and access to registration details.
5. Timezone test: event startTime set in another timezone -> UI decision uses authoritative time and results are consistent.

```
