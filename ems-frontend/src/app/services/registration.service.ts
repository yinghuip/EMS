import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface RegistrationRecord {
  eventId: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private registrations: RegistrationRecord[] = [];

  register(eventId: string, firstName: string, lastName: string, email: string): Observable<RegistrationRecord> {
    const rec: RegistrationRecord = {
      eventId,
      firstName,
      lastName,
      email,
      createdAt: new Date().toISOString()
    };
    this.registrations.push(rec);
    // Keep a copy in localStorage so it persists across reloads for demo purposes
    try {
      localStorage.setItem('registrations', JSON.stringify(this.registrations));
    } catch (e) {
      // ignore
    }
    return of(rec);
  }

  getForEvent(eventId: string): Observable<RegistrationRecord[]> {
    return of(this.registrations.filter(r => r.eventId === eventId));
  }
}
