import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventModel } from '../../models/event.model';

@Component({
  selector: 'app-past-concerts',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './past-concerts.component.html',
  styleUrls: ['./past-concerts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PastConcertsComponent {
  events = input<EventModel[]>([]);
  eventClicked = output<EventModel>();
  viewMoreClicked = output<void>();

  readonly fallback = 'assets/images/ng-conf.png';
  readonly initialCount = 8;
  readonly maxDisplay = 12;
  readonly displayCount = signal<number>(this.initialCount);

  readonly visible = computed(() => this.events().slice(0, Math.min(this.displayCount(), this.maxDisplay)));
  readonly hasMore = computed(() => this.events().length > this.displayCount() && this.displayCount() < this.maxDisplay);

  showMore(): void {
    const next = Math.min(this.displayCount() + 4, this.maxDisplay);
    this.displayCount.set(next);
    if (!this.hasMore()) {
      this.viewMoreClicked.emit();
    }
  }

  onImgError(ev: Event) {
    const img = ev.target as HTMLImageElement | null;
    if (img && img.src !== this.fallback) {
      img.src = this.fallback;
    }
  }
}
