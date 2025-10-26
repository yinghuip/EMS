import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { EventCardComponent } from './event-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('EventCardComponent', () => {
  @Component({
    template: `<app-event-card [event]="mockEvent"></app-event-card>`,
    standalone: true,
    imports: [EventCardComponent]
  })
  class HostComponent {
    mockEvent: any = null;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [RouterTestingModule, HostComponent] }).compileComponents();
  });

  it('should navigate to event detail on click', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    const mockEvent = { id: '42', title: 'Test Event', short_description: 'desc', start_datetime: new Date().toISOString() } as any;

  const hostFixture = TestBed.createComponent(HostComponent as any);
  (hostFixture as any).componentInstance.mockEvent = mockEvent;
  hostFixture.detectChanges();

    const card = hostFixture.nativeElement.querySelector('.event-card');
    expect(card).toBeTruthy();

    card.click();

    expect(router.navigate).toHaveBeenCalledWith(['/events', '42']);
  });

  it('should navigate to event detail on Enter key', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    const mockEvent = { id: '7', title: 'Key Event', short_description: 'desc', start_datetime: new Date().toISOString() } as any;

  const hostFixture = TestBed.createComponent(HostComponent as any);
  (hostFixture as any).componentInstance.mockEvent = mockEvent;
  hostFixture.detectChanges();

    const card = hostFixture.nativeElement.querySelector('.event-card');
    expect(card).toBeTruthy();

    const enter = new KeyboardEvent('keydown', { key: 'Enter' });
    card.dispatchEvent(enter);

    expect(router.navigate).toHaveBeenCalledWith(['/events', '7']);
  });
});
