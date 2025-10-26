import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { EventModel } from '../../models/event.model';

@Component({
  selector: 'app-feature-event',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './feature-event.component.html',
  styleUrls: ['./feature-event.component.scss']
})
export class FeatureEventComponent {
  event = input<EventModel>();
}
