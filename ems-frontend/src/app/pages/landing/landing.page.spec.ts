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

  const mockEvents: EventModel[] = [
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

    // find the anchor that links to the event detail
    const anchor = compiled.querySelector('a[routerlink]') || compiled.querySelector('a');
    expect(anchor).toBeTruthy();

    // simulate click and assert navigation
    (anchor as HTMLElement).click();
    await fixture.whenStable();
    expect(location.path()).toBe('/events/1');
  });
});
