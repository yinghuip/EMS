import { Injectable, signal, computed } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { EventModel } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class EventService {
  private eventsSignal = signal<EventModel[]>([
    {
      id: '1',
      title: 'Modern Web Conference 2026',
      slug: 'modern-web-conference-2026',
      short_description: 'A conference about modern web development practices.',
      description: '<p>Join us to hear talks about web frameworks, accessibility, and performance.</p>',
      start_datetime: '2026-03-18T09:00:00Z',
      end_datetime: '2026-03-18T17:00:00Z',
      location: { name: 'Convention Center', address: '123 Main St, City' },
      hero_image_url: 'assets/images/ng-conf.png',
      speakers: [
        { name: 'Ada Developer', bio: 'Frontend Engineer' },
        { name: 'Linus Architect', bio: 'Platform Architect' }
      ],
      tags: ['conference', 'web', 'frontend'],
      published_at: new Date().toISOString(),
      is_featured: true
    },
    {
      id: '2',
      title: 'Local Dev Meetup',
      short_description: 'Community meetup for local developers.',
      description: '<p>Monthly meetup for developers to network and share knowledge.</p>',
      start_datetime: '2026-01-20T18:30:00Z',
      end_datetime: '2026-01-20T21:30:00Z',
      location: { name: 'Community Hall', address: '456 Dev St, City' },
      tags: ['meetup', 'community'],
      published_at: new Date().toISOString(),
      is_featured: false
    }
  ]);

  private latestEventSignal = computed(() => {
    const events = this.eventsSignal();
    const featured = events.find(e => e.is_featured);
    if (featured) return featured;
    return events.sort((a, b) => 
      new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime()
    )[0];
  });

  getEvents(): Observable<EventModel[]> {
    return toObservable(this.eventsSignal);
  }

  getLatest(): Observable<EventModel | undefined> {
    return toObservable(this.latestEventSignal);
  }

  getEventById(id: string): Observable<EventModel | undefined> {
    return toObservable(computed(() => this.eventsSignal().find(e => e.id === id)));
  }
}
    {
      id: '2',
      title: 'Local Dev Meetup',
      short_description: 'Community meetup for local developers.',
      start_datetime: '2026-01-20T18:30:00Z',
      location: { name: 'Community Hall' },
      published_at: new Date().toISOString()
    }
  ];

  getEvents(): Observable<EventModel[]> {
    return of(this.events);
  }

  getLatest(): Observable<EventModel | undefined> {
    const featured = this.events.find((e) => e.is_featured);
    if (featured) return of(featured);
    const sorted = [...this.events].sort((a, b) => (a.published_at! < b.published_at! ? 1 : -1));
    return of(sorted[0]);
  }

  getEventById(id: string): Observable<EventModel | undefined> {
    return of(this.events.find((e) => e.id === id));
  }
}
