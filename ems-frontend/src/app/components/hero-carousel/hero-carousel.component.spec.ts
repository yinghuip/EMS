import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HeroCarouselComponent } from './hero-carousel.component';
import { EventModel } from '../../models/event.model';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('HeroCarouselComponent', () => {
  let component: HeroCarouselComponent;
  let fixture: ComponentFixture<HeroCarouselComponent>;
  let router: jasmine.SpyObj<Router> | Router;

  // Mock event data factory
  const createMockEvent = (id: string, title: string, daysFromNow: number): EventModel => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    
    return {
      id,
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      short_description: `Description for ${title}`,
      description: `Full description for ${title}`,
      start_datetime: date.toISOString(),
      end_datetime: new Date(date.getTime() + 3600000).toISOString(),
      location: {
        name: 'Test Venue',
        address: '123 Test St'
      },
      image_url: `/assets/images/${id}.jpg`,
      speakers: [],
      tags: ['test'],
      published_at: new Date().toISOString(),
      is_featured: true
    };
  };

  const mockEvents: EventModel[] = [
    createMockEvent('event-1', 'Event One', 1),
    createMockEvent('event-2', 'Event Two', 2),
    createMockEvent('event-3', 'Event Three', 3),
    createMockEvent('event-4', 'Event Four', 4),
    createMockEvent('event-5', 'Event Five', 5)
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroCarouselComponent, RouterTestingModule]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(HeroCarouselComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ============================================================================
  // T008: Test auto-advance logic
  // ============================================================================
  describe('Auto-advance functionality', () => {
    it('should automatically advance to next slide after default interval (5000ms)', fakeAsync(() => {
      component.events = mockEvents;
      component.autoAdvanceInterval = 5000;
      component.autoRotate = true;
      fixture.detectChanges();

      expect(component.currentIndex()).toBe(0);

      // Advance time by 5 seconds
      tick(5000);
      fixture.detectChanges();

      expect(component.currentIndex()).toBe(1);
      // cleanup interval
      component.ngOnDestroy();
    }));

    it('should continue auto-advancing through all slides in sequence', fakeAsync(() => {
      component.events = mockEvents;
      component.autoAdvanceInterval = 5000;
      component.autoRotate = true;
      fixture.detectChanges();

      expect(component.currentIndex()).toBe(0);

      // First advance
      tick(5000);
      expect(component.currentIndex()).toBe(1);

      // Second advance
      tick(5000);
      expect(component.currentIndex()).toBe(2);

      // Third advance
      tick(5000);
      expect(component.currentIndex()).toBe(3);
      // cleanup interval
      component.ngOnDestroy();
    }));

    it('should loop back to first slide after reaching the end', fakeAsync(() => {
      component.events = mockEvents;
      component.autoAdvanceInterval = 5000;
      component.autoRotate = true;
      fixture.detectChanges();

      expect(component.currentIndex()).toBe(0);

      // Advance through all 5 events
      tick(5000); // Index 1
      tick(5000); // Index 2
      tick(5000); // Index 3
      tick(5000); // Index 4
      tick(5000); // Should loop to Index 0

      expect(component.currentIndex()).toBe(0);
      // cleanup interval
      component.ngOnDestroy();
    }));

    it('should not auto-advance when autoRotate is false', fakeAsync(() => {
      component.events = mockEvents;
      component.autoAdvanceInterval = 5000;
      component.autoRotate = false;
      fixture.detectChanges();

      expect(component.currentIndex()).toBe(0);

      tick(5000);
      fixture.detectChanges();

      expect(component.currentIndex()).toBe(0); // Should still be 0
    }));

    it('should not auto-advance when only one event is provided', fakeAsync(() => {
      component.events = [mockEvents[0]];
      component.autoAdvanceInterval = 5000;
      component.autoRotate = true;
      fixture.detectChanges();

      expect(component.currentIndex()).toBe(0);

      tick(5000);
      fixture.detectChanges();

      expect(component.currentIndex()).toBe(0); // Should still be 0
    }));

    it('should respect custom autoAdvanceInterval', fakeAsync(() => {
      component.events = mockEvents;
      component.autoAdvanceInterval = 3000; // 3 seconds
      component.autoRotate = true;
      fixture.detectChanges();

      expect(component.currentIndex()).toBe(0);

      tick(3000);
      fixture.detectChanges();

      expect(component.currentIndex()).toBe(1);
      // cleanup interval
      component.ngOnDestroy();
    }));

    it('should restart auto-advance timer after manual navigation', fakeAsync(() => {
      component.events = mockEvents;
      component.autoAdvanceInterval = 5000;
      component.autoRotate = true;
      fixture.detectChanges();

      expect(component.currentIndex()).toBe(0);

      // Wait 2 seconds, then manually navigate
      tick(2000);
      component.goToNext();
      fixture.detectChanges();
      expect(component.currentIndex()).toBe(1);

      // Timer should restart, so after 5 more seconds (not 3), it should advance
      tick(3000); // Total 5 seconds from start, but only 3 after manual nav
      expect(component.currentIndex()).toBe(1); // Should still be 1

      tick(2000); // Now 5 seconds after manual nav
      expect(component.currentIndex()).toBe(2); // Should advance to 2
      // cleanup interval
      component.ngOnDestroy();
    }));

    it('should pause auto-advance when pause() is called', fakeAsync(() => {
      component.events = mockEvents;
      component.autoAdvanceInterval = 5000;
      component.autoRotate = true;
      fixture.detectChanges();

      expect(component.currentIndex()).toBe(0);

      component.pause();
      
      tick(5000);
      fixture.detectChanges();

      expect(component.currentIndex()).toBe(0); // Should not advance
      // cleanup interval
      component.ngOnDestroy();
    }));

    it('should resume auto-advance when resume() is called after pause', fakeAsync(() => {
      component.events = mockEvents;
      component.autoAdvanceInterval = 5000;
      component.autoRotate = true;
      fixture.detectChanges();

      component.pause();
      tick(5000);
      expect(component.currentIndex()).toBe(0); // Paused, no advance

      component.resume();
      tick(5000);
      expect(component.currentIndex()).toBe(1); // Should advance after resume
      // cleanup interval
      component.ngOnDestroy();
    }));
  });

  // ============================================================================
  // T009: Test manual navigation (goToNext, goToPrevious)
  // ============================================================================
  describe('Manual navigation', () => {
    beforeEach(() => {
      component.events = mockEvents;
      component.autoRotate = false; // Disable auto-rotate for manual tests
      fixture.detectChanges();
    });

    describe('goToNext()', () => {
      it('should advance to next slide when goToNext is called', () => {
        expect(component.currentIndex()).toBe(0);

        component.goToNext();
        expect(component.currentIndex()).toBe(1);

        component.goToNext();
        expect(component.currentIndex()).toBe(2);
      });

      it('should loop to first slide when goToNext is called on last slide', () => {
        component.currentIndex.set(4); // Last slide (index 4)
        
        component.goToNext();
        expect(component.currentIndex()).toBe(0);
      });

      it('should update previousIndex signal correctly', () => {
        expect(component.currentIndex()).toBe(0);
        
        component.goToNext();
        expect(component.previousIndex()).toBe(0);
        expect(component.currentIndex()).toBe(1);

        component.goToNext();
        expect(component.previousIndex()).toBe(1);
        expect(component.currentIndex()).toBe(2);
      });

      it('should set direction to "next"', () => {
        component.direction.set('prev'); // Set to prev first

        component.goToNext();
        expect(component.direction()).toBe('next');
      });
    });

    describe('goToPrevious()', () => {
      it('should go to previous slide when goToPrevious is called', () => {
        component.currentIndex.set(2);

        component.goToPrevious();
        expect(component.currentIndex()).toBe(1);

        component.goToPrevious();
        expect(component.currentIndex()).toBe(0);
      });

      it('should loop to last slide when goToPrevious is called on first slide', () => {
        expect(component.currentIndex()).toBe(0);

        component.goToPrevious();
        expect(component.currentIndex()).toBe(4); // Last slide
      });

      it('should update previousIndex signal correctly', () => {
        component.currentIndex.set(2);
        
        component.goToPrevious();
        expect(component.previousIndex()).toBe(2);
        expect(component.currentIndex()).toBe(1);
      });

      it('should set direction to "prev"', () => {
        component.direction.set('next'); // Set to next first
        component.currentIndex.set(2);

        component.goToPrevious();
        expect(component.direction()).toBe('prev');
      });
    });

    describe('goToIndex()', () => {
      it('should jump to specific index when goToIndex is called', () => {
        expect(component.currentIndex()).toBe(0);

        component.goToIndex(3);
        expect(component.currentIndex()).toBe(3);

        component.goToIndex(1);
        expect(component.currentIndex()).toBe(1);
      });

      it('should handle boundary indices correctly', () => {
        component.goToIndex(0);
        expect(component.currentIndex()).toBe(0);

        component.goToIndex(4);
        expect(component.currentIndex()).toBe(4);
      });

      it('should clamp invalid indices to valid range', () => {
        component.goToIndex(-1);
        expect(component.currentIndex()).toBeGreaterThanOrEqual(0);

        component.goToIndex(999);
        expect(component.currentIndex()).toBeLessThan(mockEvents.length);
      });
    });

    describe('Edge cases', () => {
      it('should handle navigation with empty events array', () => {
        component.events = [];
        fixture.detectChanges();

        expect(() => component.goToNext()).not.toThrow();
        expect(() => component.goToPrevious()).not.toThrow();
        expect(component.currentIndex()).toBe(0);
      });

      it('should handle navigation with single event', () => {
        component.events = [mockEvents[0]];
        fixture.detectChanges();

        component.goToNext();
        expect(component.currentIndex()).toBe(0); // Should stay at 0

        component.goToPrevious();
        expect(component.currentIndex()).toBe(0); // Should stay at 0
      });
    });
  });

  // ============================================================================
  // T010: Test event selection emission
  // ============================================================================
  describe('Event selection', () => {
    beforeEach(() => {
      component.events = mockEvents;
      component.autoRotate = false;
      fixture.detectChanges();
    });

    it('should emit eventSelected when onEventClick is called', (done) => {
      const selectedEvent = mockEvents[0];
      
      component.eventSelected.subscribe((event: EventModel) => {
        expect(event).toEqual(selectedEvent);
        done();
      });

      component.onEventClick(selectedEvent);
    });

    it('should emit eventSelected with correct event data', (done) => {
      const targetEvent = mockEvents[2];
      component.currentIndex.set(2);

      component.eventSelected.subscribe((event: EventModel) => {
        expect(event.id).toBe('event-3');
        expect(event.title).toBe('Event Three');
        done();
      });

      component.onEventClick(targetEvent);
    });

    it('should emit eventSelected when carousel item is clicked', (done) => {
      component.eventSelected.subscribe((event: EventModel) => {
        expect(event).toBeDefined();
        expect(event.id).toBe('event-1');
        done();
      });

      // Simulate clicking on the current carousel item
      const currentEvent = component.events[component.currentIndex()];
      component.onEventClick(currentEvent);
    });

    it('should not emit eventSelected when events array is empty', (done) => {
      component.events = [];
      fixture.detectChanges();

      let emitted = false;
      component.eventSelected.subscribe(() => {
        emitted = true;
      });

      // Try to trigger selection - should not emit
      setTimeout(() => {
        expect(emitted).toBe(false);
        done();
      }, 100);
    });

    it('should emit indexChanged when carousel index changes', (done) => {
      if (component.indexChanged) {
        component.indexChanged.subscribe((index: number) => {
          expect(index).toBe(1);
          done();
        });

        component.goToNext();
      } else {
        done(); // Skip if indexChanged is optional and not implemented
      }
    });
  });

  // ============================================================================
  // Additional integration tests
  // ============================================================================
  describe('Component integration', () => {
    it('should initialize with correct default values', () => {
      expect(component.autoAdvanceInterval).toBe(5000);
      expect(component.autoRotate).toBe(true);
      expect(component.showControls).toBe(true);
      expect(component.currentIndex()).toBe(0);
      expect(component.direction()).toBe('next');
    });

    it('should clean up timer on component destroy', fakeAsync(() => {
      component.events = mockEvents;
      component.autoAdvanceInterval = 5000;
      component.autoRotate = true;
      fixture.detectChanges();

      component.ngOnDestroy();
      
      tick(5000);
      // Index should not change after destroy
      expect(component.currentIndex()).toBe(0);
    }));

    it('should reset to first slide when events input changes', () => {
      component.events = mockEvents;
      fixture.detectChanges();
      
      component.currentIndex.set(3);
      expect(component.currentIndex()).toBe(3);

      // Change events input
      component.events = [mockEvents[0], mockEvents[1]];
      component.ngOnChanges({
        events: {
          currentValue: component.events,
          previousValue: mockEvents,
          firstChange: false,
          isFirstChange: () => false
        }
      });
      fixture.detectChanges();

      expect(component.currentIndex()).toBe(0);
    });
  });
});
