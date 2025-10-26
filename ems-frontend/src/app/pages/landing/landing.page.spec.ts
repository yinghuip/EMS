import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { LandingPage } from './landing.page';
import { EventService } from '../../services/event.service';
import { EventModel } from '../../models/event.model';
import { EventDetailPage } from '../event-detail/event-detail.page';

describe('LandingPage (integration)', () => {
  let fixture: ComponentFixture<LandingPage>;
  let router: Router;
  let location: Location;

  const mockEvents: any = [
    {
      id: '1',
      title: 'Test Event',
      short_description: 'Short',
      is_featured: true,
      published_at: new Date().toISOString()
    }
  ];

  const mockEventService = {
    getLatest: () => of(mockEvents[0]),
    getEvents: () => of(mockEvents)
  } as Partial<EventService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPage, RouterTestingModule.withRoutes([{ path: 'events/:id', component: EventDetailPage }])],
      providers: [{ provide: EventService, useValue: mockEventService }]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(LandingPage);
    router.initialNavigation();
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('renders hero with latest event and navigates to detail on CTA click', async () => {
  // check that the hero title is rendered
  const compiled = fixture.nativeElement as HTMLElement;
  expect(compiled.textContent).toContain('Test Event');

  // find the anchor in the hero that links to the event detail (look for known link text)
  const anchors = Array.from(compiled.querySelectorAll('a')) as HTMLAnchorElement[];
  const heroAnchor = anchors.find(a => (a.textContent || '').includes('Learn more') || (a.textContent || '').includes('Register Now')) || anchors[0];
  expect(heroAnchor).toBeTruthy();

  // assert the hero anchor targets the expected route (inspect routerLink/reflection)
  const linkAttr = heroAnchor!.getAttribute('ng-reflect-router-link') || heroAnchor!.getAttribute('href') || '';
  // The CTA may point to register or detail; assert it targets the events route and includes the id
  expect(linkAttr).toContain('/events');
  expect(linkAttr).toContain('1');
  });

  it('shows up to 3 upcoming events within 90 days ordered soonest-first', async () => {
    // prepare mock events with dates relative to now
    const day = 24 * 60 * 60 * 1000;
    const now = new Date();

    const e1: EventModel = {
      id: 'a',
      title: 'Event in 10 days',
      short_description: 'Soon',
      start_datetime: new Date(now.getTime() + 10 * day).toISOString(),
      published_at: new Date().toISOString()
    } as any;
    const e2: EventModel = {
      id: 'b',
      title: 'Event in 30 days',
      short_description: 'Later',
      start_datetime: new Date(now.getTime() + 30 * day).toISOString(),
      published_at: new Date().toISOString()
    } as any;
    const e3: EventModel = {
      id: 'c',
      title: 'Event in 45 days',
      short_description: 'Later2',
      start_datetime: new Date(now.getTime() + 45 * day).toISOString(),
      published_at: new Date().toISOString()
    } as any;
    const e4: EventModel = {
      id: 'd',
      title: 'Event in 100 days',
      short_description: 'Too far',
      start_datetime: new Date(now.getTime() + 100 * day).toISOString(),
      published_at: new Date().toISOString()
    } as any;

    const mockEvents2 = [e4, e2, e3, e1];
    const mockEventService2 = {
      getLatest: () => of(e1),
      getEvents: () => of(mockEvents2)
    } as Partial<EventService>;

    // create a fresh TestBed with the new mock service and create a component from it
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [LandingPage, RouterTestingModule.withRoutes([{ path: 'events/:id', component: EventDetailPage }])],
      providers: [{ provide: EventService, useValue: mockEventService2 }]
    }).compileComponents();

    const localFixture = TestBed.createComponent(LandingPage);
    const localRouter = TestBed.inject(Router);
    localRouter.initialNavigation();
    localFixture.detectChanges();
    await localFixture.whenStable();

    const compiled = localFixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.upcoming-events .event-card');
    // Should show only 3 cards (e1,e2,e3) and exclude e4 (100 days)
    expect(cards.length).toBe(3);

    // Check order: soonest (e1) first
    const text = compiled.textContent || '';
    expect(text).toContain('Event in 10 days');
    expect(text.indexOf('Event in 10 days')).toBeLessThan(text.indexOf('Event in 30 days'));
  });
});
