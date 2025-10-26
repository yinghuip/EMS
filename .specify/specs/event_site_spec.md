# Event Site Specification

Short summary
- Project: Modern, mobile-responsive event management website (EMS).
- Purpose: List and showcase events, allow users to view event details, and provide marketing/branding pages.
- Minimum pages: Landing page (features latest event), About page, Event detail page.

Goals & non-goals
- Goals:
  - Modern visual design, mobile-first, fully responsive.
  - Landing page highlights the latest event with CTA to view details or register.
  - Clear, accessible About page.
  - Event detail page with event metadata, images, schedule, location (map), and registration link.
- Non-goals (v0): ticketing checkout flow, user accounts, payments — can be added later.

User journeys (minimum)
1. Visitor lands on site -> sees featured/latest event -> taps CTA -> opens Event Detail page.
2. Visitor navigates to About -> reads organization mission and contact information.
3. Visitor opens an event from list or featured card -> reads details and clicks register (external or future flow).

Pages & routes
- / (Landing)
  - Hero showing latest event: title, date/time, location, short blurb, primary CTA.
  - Section: upcoming events (list or cards), link to event list
  - Section: testimonials / quick about blurb
  - Footer: contact, social links
- /about
  - Organization description, mission, team, contact
- /events/:id (Event Detail)
  - Event title, full description, start/end times, location (with map embed), speakers, image gallery, schedule, FAQs, registration CTA

Data model (basic)
- Event
  - id: string
  - title: string
  - slug: string
  - short_description: string
  - description: markdown/html
  - start_datetime: iso8601
  - end_datetime: iso8601
  - location: { name, address, lat, lng }
  - hero_image_url: string
  - gallery: string[]
  - speakers: [{ name, bio, avatar_url }]
  - tags: string[]
  - published_at: iso8601
  - is_featured: boolean

Minimal API (HTTP-first as per constitution)
- GET /api/events/latest -> returns single Event (used by landing hero)
- GET /api/events?limit=...&upcoming=true -> list of events
- GET /api/events/:id -> event detail

Frontend components (reusable)
- Header (logo, nav, mobile menu)
- Hero (used for landing featured event)
- EventCard (image, title, date, short blurb)
- EventList (grid/list of EventCard)
- EventDetail (composed of subcomponents: Gallery, Schedule, Speakers, Map, CTA)
- Footer

Design & UX guidance
- Visual style: modern, clean, generous whitespace, large hero image. Use a single, strong accent color.
- Typography: legible font stack; scale for headings and body; ensure contrast ratios meet WCAG AA.
- Mobile-first: layout should be optimized for phones first, then progressively enhanced for larger screens.
- Breakpoints (suggested):
  - small: up to 640px (mobile)
  - medium: 641–1024px (tablet)
  - large: 1025px+ (desktop)
- Buttons/CTAs: prominent and consistent; primary action (View Details / Register) visible in hero.

Accessibility
- Keyboard navigable interactive elements
- Semantic HTML and ARIA where needed
- Alt text for images
- Sufficient color contrast
- Focus states clearly visible

SEO & Social
- Each event has meta tags (title, description, og:image, og:title, og:description)
- Use canonical URLs and sitemaps; support server-side rendering (SSR) or prerendering for social previews and SEO.

Analytics & Observability
- Capture page views and key CTAs (clicks on featured CTA, register clicks)
- Structured logging for backend endpoints (request ids, latency)

Tests & Quality Gate
- Unit tests for core components
- Integration test for /api/events/latest and /api/events/:id
- One end-to-end test: landing -> open featured event -> event detail visible
- Linting and formatting enforced in CI

Tech suggestions (minimal, pick one stack)
- Option A (React/SSG): Next.js + React + Tailwind CSS + Vercel for hosting. Use Next.js API routes or separate API.
- Option B (SPA): React + Vite + React Router + Tailwind; backend service (Node/Express or Python/FastAPI) for API.
- DB: Postgres for events; migrations via Prisma or framework migrations.

Chosen stack
- Angular + Angular Material + Bootstrap 5 (requested): a modern, component-driven approach with strong UX primitives (Material) and Bootstrap utility/layout helpers for quick responsive design.

Scaffolding & setup (recommended, run in project root)
1. Install Angular CLI (if not installed):

  npm install -g @angular/cli

2. Create a new Angular workspace and app (example name: ems-frontend):

  ng new ems-frontend --routing --style=scss

3. Change into the new app directory and add Angular Material:

  cd ems-frontend
  ng add @angular/material

  (choose a Material theme when prompted; enable global typography and animations)

4. Add Bootstrap 5 (via npm) and import SCSS in `src/styles.scss`:

  npm install bootstrap@5

  // in src/styles.scss
  @import "~bootstrap/scss/bootstrap";

5. Optionally install Angular CDK, Flex Layout or other helpers if needed.

Useful commands
- Start dev server: npm start (or ng serve)
- Build production: ng build --prod
- Run unit tests: ng test
- Run end-to-end tests: ng e2e

Project structure guidance (within `ems-frontend`)
- `src/app/components` — shared, presentational components (Header, Footer, Hero, EventCard)
- `src/app/pages` — route pages (LandingPage, AboutPage, EventDetailPage)
- `src/app/services` — API clients and stateful services (EventService)
- `src/app/models` — TypeScript interfaces for Event, Location, Speaker
- `src/app/material.module.ts` — centralize Angular Material imports (MatToolbarModule, MatCardModule, MatButtonModule, MatIconModule, MatGridListModule)

Example Angular wiring notes
- Use `EventService` to fetch from `/api/events/latest` and `/api/events/:id` using `HttpClient`.
- Make the landing `HeroComponent` a Material Card with a full-bleed hero image and a primary `mat-raised-button` as the CTA.
- Use Bootstrap utility classes for quick responsive spacing and grid helpers alongside Material components for consistent layout.

Next steps I can take for you
- Run the scaffold commands here in the workspace (I can execute `ng new` and wire Material + Bootstrap) and commit the generated app into `/ems-frontend`.
- Or create manual starter files (app shell, a few components and services) if you prefer not to run the CLI here.

If you want me to scaffold now, tell me whether to run the CLI commands in this workspace (I'll install deps and commit the generated files). If you'd rather scaffold locally, follow the commands above and I can continue from your created project.

Acceptance criteria (v0)
- Landing page loads and shows the latest event (data from GET /api/events/latest).
- Landing hero CTA navigates to the correct /events/:id route.
- About page accessible and responsive.
- Event detail page displays full event data including image, title, date/time, and location.
- Site is mobile responsive across suggested breakpoints.
- Basic accessibility checks pass (keyboard nav, alt text, color contrast).

Minimal deliverables for first milestone (MVP)
- Implement backend endpoints for events (latest & detail) with seed data
- Static landing page and About page
- Event detail page wired to API
- Mobile responsive styles and basic SEO meta tags
- CI that runs lint and unit tests

Next steps I can take for you
- Scaffold a starter project for your chosen stack (Next.js or Vite + backend) with the pages and example data.
- Create basic HTML/CSS mockups for the hero and event card components.
- Implement the API endpoints and a tiny frontend to connect to them.

---

Notes
- The spec is intentionally minimal to get an MVP shipped quickly. We can iterate on ticketing, user accounts, RSVPs, and admin UI in follow-ups.
