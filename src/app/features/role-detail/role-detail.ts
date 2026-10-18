import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { ROLES } from '../../data/roles';
import { TeamBadge } from '../../shared/components/team-badge/team-badge';
import { RoleCard } from '../../shared/components/role-card/role-card';

@Component({
  selector: 'app-role-detail',
  imports: [TeamBadge, RoleCard],
  templateUrl: './role-detail.html',
  styleUrl: './role-detail.css',
})
export class RoleDetail {
  private route = inject(ActivatedRoute);

  private roleId = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('id'))
    ),
    { initialValue: this.route.snapshot.paramMap.get('id') }
  );

  role = computed(() =>
    ROLES.find((role) => role.id === this.roleId())
  );

  otherRoles = computed(() => {
    const currentRoleId = this.roleId();

    const availableRoles = ROLES.filter(
      (role) => role.id !== currentRoleId
    );

    // Mélange aléatoire avec Fisher-Yates
    for (let i = availableRoles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [availableRoles[i], availableRoles[j]] = [
        availableRoles[j],
        availableRoles[i],
      ];
    }

    // Retourne au maximum 4 rôles
    return availableRoles.slice(0, 4);
  });
}