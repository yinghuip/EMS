import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventModel } from '../../models/event.model';

type MonthGroup = { key: string; label: string; events: EventModel[] };

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarViewComponent {
  events = input<EventModel[]>([]);
  eventSelected = output<EventModel>();

  readonly searchTerm = signal<string>('');
  readonly fallback = 'assets/images/ng-conf.png';

  private normalize = (v: string) => (v || '').toLowerCase();

  readonly filteredEvents = computed(() => {
    const list = this.events();
    const q = this.normalize(this.searchTerm());
    if (!q) return list;
    return list.filter((e) => {
      const inTitle = this.normalize(e.title).includes(q);
      const inVenue = this.normalize(e.location?.name || '').includes(q);
      const inDesc = this.normalize(e.short_description || '').includes(q) || this.normalize(e.description || '').includes(q);
      return inTitle || inVenue || inDesc;
    });
  });

  readonly monthGroups = computed<MonthGroup[]>(() => {
    const groups = new Map<string, EventModel[]>();
    const fmt = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
    for (const e of this.filteredEvents().slice().sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime())) {
      const d = new Date(e.start_datetime);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(e);
    }
    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, events]) => {
        const [y, m] = key.split('-').map((n) => parseInt(n, 10));
        const label = fmt.format(new Date(y, m - 1, 1));
        return { key, label, events };
      });
  });

  onSearchInput(value: string) {
    clearTimeout((this as any)._debounceTimer);
    (this as any)._debounceTimer = setTimeout(() => this.searchTerm.set(value), 300);
  }

  onImgError(ev: Event) {
    const img = ev.target as HTMLImageElement | null;
    if (img && img.src !== this.fallback) {
      img.src = this.fallback;
    }
  }

  selectEvent(e: EventModel) {
    this.eventSelected.emit(e);
  }
}
