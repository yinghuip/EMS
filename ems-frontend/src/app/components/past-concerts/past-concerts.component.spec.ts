import { TestBed } from '@angular/core/testing';
import { PastConcertsComponent } from './past-concerts.component';
import { RouterTestingModule } from '@angular/router/testing';

const mk = (i: number) => ({
  id: String(i),
  title: `Past ${i}`,
  slug: `past-${i}`,
  short_description: '',
  description: '',
  start_datetime: new Date(2023, 11, i).toISOString(),
  end_datetime: new Date(2023, 11, i, 1).toISOString(),
  location: { name: 'Hall', address: '' },
  image_url: '',
  speakers: [],
  tags: [],
  published_at: new Date().toISOString(),
  is_featured: false
});

describe('PastConcertsComponent', () => {
  it('shows up to maxDisplay and view more increases display', async () => {
    await TestBed.configureTestingModule({
      imports: [PastConcertsComponent, RouterTestingModule]
    }).compileComponents();
    const fixture = TestBed.createComponent(PastConcertsComponent);
    const comp = fixture.componentInstance;
    fixture.componentRef.setInput('events', Array.from({ length: 20 }).map((_, i) => mk(i + 1)) as any);
    fixture.detectChanges();

    expect(comp.visible().length).toBe(comp.initialCount);
    comp.showMore();
    expect(comp.visible().length).toBe(Math.min(comp.initialCount + 4, comp.maxDisplay));
  });
});
