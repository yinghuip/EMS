import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { EventRegisterPage } from './event-register.page';
import { of } from 'rxjs';
import { convertToParamMap, ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { RegistrationService } from '../../services/registration.service';
import { EventService } from '../../services/event.service';

describe('EventRegisterPage', () => {
  let fixture: ComponentFixture<EventRegisterPage>;
  let component: EventRegisterPage;

  const mockEvent = {
    id: '1',
    title: 'Test Event'
  } as any;

  let registrationSpy: jasmine.SpyObj<any>;
  let eventServiceSpy: jasmine.SpyObj<any>;
  let router: Router;

  beforeEach(async () => {
    registrationSpy = jasmine.createSpyObj('RegistrationService', ['register']);
    registrationSpy.register.and.returnValue(of({}));

    eventServiceSpy = jasmine.createSpyObj('EventService', ['getEventById']);
    eventServiceSpy.getEventById.and.returnValue(of(mockEvent));

    @Component({ template: '' })
    class DummyComponent {}

    await TestBed.configureTestingModule({
      imports: [EventRegisterPage, RouterTestingModule.withRoutes([{ path: 'events/:id', component: DummyComponent }])],
      declarations: [DummyComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id: '1' })) } },
        { provide: RegistrationService, useValue: registrationSpy },
        { provide: EventService, useValue: eventServiceSpy }
      ]
    }).compileComponents();

    // Note: EventRegisterPage is a standalone component; TestBed.createComponent works when it is included in imports
    fixture = TestBed.createComponent(EventRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // grab the router and spy on navigate/navigateByUrl so navigation doesn't actually error
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));
  });

  it('should register on valid form submit and navigate back (happy path)', fakeAsync(() => {
    // Arrange: fill the reactive form
    component.form.setValue({ firstName: 'Ada', lastName: 'Developer', email: 'ada@example.com' });

    // Act
    component.submit();

    // Assert registration called
    expect(registrationSpy.register).toHaveBeenCalledWith('1', 'Ada', 'Developer', 'ada@example.com');

    // success flag should be true
    expect(component.success).toBeTrue();

  // After the configured delay, router.navigate should be called
  tick(1300);
  expect((router.navigate as jasmine.Spy)).toHaveBeenCalledWith(['/events', '1']);
  }));

  it('should not call register when form is invalid and should show validation errors', () => {
    // Arrange: leave fields empty / invalid email
    component.form.setValue({ firstName: '', lastName: '', email: 'not-an-email' });

    // Act
    component.submit();
    fixture.detectChanges();

    // Assert
    expect(registrationSpy.register).not.toHaveBeenCalled();
    expect(component.submitted).toBeTrue();
    const compiled = fixture.nativeElement as HTMLElement;
    // There should be validation messages rendered for required fields or invalid email
    expect(compiled.querySelectorAll('.text-danger').length).toBeGreaterThan(0);
  });

  it('should navigate back to event detail when Back button is clicked', fakeAsync(() => {
  const debug = fixture.debugElement;
  const backDe = debug.query(By.css('a.btn-secondary'));
  expect(backDe).toBeTruthy('Back to event link should be present');

  // Trigger the Angular click handler on the RouterLink
  backDe.triggerEventHandler('click', { button: 0 });
  tick();

  // RouterLink may call navigateByUrl internally; assert either navigation method was called
  const navCalls = (router.navigate as jasmine.Spy).calls.count() + (router.navigateByUrl as jasmine.Spy).calls.count();
  expect(navCalls).toBeGreaterThan(0);
  }));
});
