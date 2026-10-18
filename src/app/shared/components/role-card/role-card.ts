import { Component, input } from '@angular/core';
import { Role } from '../../../models /role.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-role-card',
  imports: [RouterLink],
  templateUrl: './role-card.html',
  styleUrl: './role-card.scss',
})
export class RoleCard {
  role = input.required<Role>();
}
