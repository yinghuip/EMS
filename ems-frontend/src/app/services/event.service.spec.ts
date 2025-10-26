import { TestBed } from '@angular/core/testing';
import { EventService } from './event.service';

describe('EventService', () => {
  let service: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [EventService] });
    service = TestBed.inject(EventService);
  });

  it('should return events list', (done) => {
    service.getEvents().subscribe((events) => {
      expect(events.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should return latest featured event', (done) => {
    service.getLatest().subscribe((evt) => {
      expect(evt).toBeTruthy();
      expect(evt?.is_featured).toBeTrue();
      done();
    });
  });

  it('should find event by id', (done) => {
    service.getEventById('1').subscribe((evt) => {
      expect(evt).toBeDefined();
      expect(evt?.id).toBe('1');
      done();
    });
  });
});
