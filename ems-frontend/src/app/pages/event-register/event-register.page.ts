import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';
import { RegistrationService } from '../../services/registration.service';
import { switchMap, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { EventModel } from '../../models/event.model';

interface RegistrationForm {
  firstName: string;
  lastName: string;
  email: string;
}

@Component({
  selector: 'app-event-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './event-register.page.html',
  styleUrls: ['./event-register.page.scss']
})
export class EventRegisterPage {
  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);
  private registrationService = inject(RegistrationService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  readonly eventId = signal('');
  readonly submitted = signal(false);
  readonly success = signal(false);

  readonly form = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  });

  readonly event = toSignal(
    this.route.paramMap.pipe(
      map(pm => {
        const id = pm.get('id') || '';
        this.eventId.set(id);
        return id;
      }),
      switchMap(id => this.eventService.getEventById(id))
    )
  );

  submit() {
    this.submitted.set(true);
    if (this.form.invalid) return;

    const formValue = this.form.value as RegistrationForm;
    this.registrationService.register(
      this.eventId(), 
      formValue.firstName, 
      formValue.lastName, 
      formValue.email
    ).subscribe(() => {
      this.success.set(true);
      setTimeout(() => this.router.navigate(['/events', this.eventId()]), 1200);
    });
  }
}
