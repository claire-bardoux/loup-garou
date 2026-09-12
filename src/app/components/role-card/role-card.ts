import { Component, input } from '@angular/core';
import { Role } from '../../models /role.model';

@Component({
  selector: 'app-role-card',
  imports: [],
  templateUrl: './role-card.html',
  styleUrl: './role-card.scss',
})
export class RoleCard {
  role = input.required<Role>();
}
