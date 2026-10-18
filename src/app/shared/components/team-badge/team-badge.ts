import { Component, input } from '@angular/core';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-team-badge',
  imports: [UpperCasePipe],
  templateUrl: './team-badge.html',
  styleUrl: './team-badge.css',
})
export class TeamBadge {
  team = input.required<'village' | 'loup' | 'solitaire' | 'ambigu' | 'autres'>();
}
