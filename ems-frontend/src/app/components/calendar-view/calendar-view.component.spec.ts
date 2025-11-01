import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CalendarViewComponent } from './calendar-view.component';
import { RouterTestingModule } from '@angular/router/testing';

const mk = (title: string, month: number) => ({
  id: `${title}-${month}`,
  title,
  slug: title,
  short_description: title,
  description: '',
  start_datetime: new Date(2026, month - 1, 1).toISOString(),
  end_datetime: new Date(2026, month - 1, 1, 1).toISOString(),
  location: { name: 'Main Hall', address: '' },
  image_url: '',
  speakers: [],
  tags: [],
  published_at: new Date().toISOString(),
  is_featured: false
});

describe('CalendarViewComponent', () => {
  it('groups by month and filters by search after debounce', fakeAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarViewComponent, RouterTestingModule]
    }).compileComponents();
    const fixture = TestBed.createComponent(CalendarViewComponent);
    const comp = fixture.componentInstance;
    fixture.componentRef.setInput('events', [mk('Alpha', 1), mk('Beta', 2), mk('Gamma', 2)] as any);
    fixture.detectChanges();

    expect(comp.monthGroups().length).toBe(2);
    comp.onSearchInput('beta');
    tick(300);
    fixture.detectChanges();
    const groups = comp.monthGroups();
    expect(groups.length).toBe(1);
    expect(groups[0].events.length).toBe(1);
  }));
});
