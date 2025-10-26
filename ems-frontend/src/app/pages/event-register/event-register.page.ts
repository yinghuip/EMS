import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';
import { RegistrationService } from '../../services/registration.service';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-event-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './event-register.page.html',
  styleUrls: ['./event-register.page.scss']
})
export class EventRegisterPage {
  eventId = '';
  event$: Observable<any> | undefined;
  form: any;

  submitted = false;
  success = false;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private registrationService: RegistrationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.event$ = this.route.paramMap.pipe(
      map((pm) => pm.get('id') || ''),
      switchMap((id) => {
        this.eventId = id;
        return this.eventService.getEventById(id);
      })
    );
  }

  submit() {
    this.submitted = true;
    if (this.form.invalid) return;
    const { firstName, lastName, email } = this.form.value as any;
    this.registrationService.register(this.eventId, firstName, lastName, email).subscribe(() => {
      this.success = true;
      // Optionally navigate back after a short delay
      setTimeout(() => this.router.navigate(['/events', this.eventId]), 1200);
    });
  }
}
