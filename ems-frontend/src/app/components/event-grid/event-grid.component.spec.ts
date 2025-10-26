import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EventGridComponent } from './event-grid.component';

const makeEvents = (n: number) => Array.from({ length: n }).map((_, i) => ({
  id: String(i + 1),
  title: `E${i + 1}`,
  slug: `e-${i + 1}`,
  short_description: '',
  description: '',
  start_datetime: new Date(Date.now() + (i + 1) * 86400000).toISOString(),
  end_datetime: new Date(Date.now() + (i + 1) * 86400000 + 3600000).toISOString(),
  location: { name: 'Venue', address: '' },
  image_url: '',
  speakers: [],
  tags: [],
  published_at: new Date().toISOString(),
  is_featured: false
}));

describe('EventGridComponent', () => {
  it('paginates and loadMore increases visible items', async () => {
    await TestBed.configureTestingModule({
      imports: [EventGridComponent, RouterTestingModule]
    }).compileComponents();
    const fixture = TestBed.createComponent(EventGridComponent);
    const comp = fixture.componentInstance;
  fixture.componentRef.setInput('events', makeEvents(20) as any);
    fixture.detectChanges();

  expect(comp.visibleEvents().length).toBe(comp.initialCount());
    comp.loadMore();
  expect(comp.visibleEvents().length).toBe(comp.initialCount() * 2);
    expect(comp.hasMore()).toBeTrue();
  });
});
