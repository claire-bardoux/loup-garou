import { Component, input } from '@angular/core';
import { Role } from '../../../models /role.model';
import { RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { TeamBadge } from '../team-badge/team-badge';

@Component({
  selector: 'app-role-card',
  imports: [RouterLink, TeamBadge],
  templateUrl: './role-card.html',
  styleUrl: './role-card.scss',
})
export class RoleCard {
  role = input.required<Role>();
}
