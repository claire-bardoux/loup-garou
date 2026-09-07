import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { RoleService } from './role.service';
import { Role } from '../model/role.model';

@Injectable({
  providedIn: 'root',
})
export class DeckService {
  mapRoleCounterSignal!: WritableSignal<Record<string, number>>;
  roleService = inject(RoleService);

  constructor() {
    this.mapRoleCounterSignal = signal<Record<string, number>>({});
  }


  updateCount(roleId: string, count: number) {
    this.mapRoleCounterSignal.update(current => ({ ...current, [roleId]: count }));
  }

  getDeckEntriesSignal() {
    return this.mapRoleCounterSignal;
  }

  getDeckEntriesNotNull(): {
    role: Role;
    count: number;
}[] {
  const map = this.mapRoleCounterSignal();
    return Object.entries(map)

      .filter(([, count]) => count > 0)

      .map(([roleId, count]) => {

        const role = this.roleService.getRoleById(roleId);

        return role ? { role, count } : null;

      })

      .filter((e): e is { role: Role; count: number } => e !== null);

  
  }

  getTotalPlayers() {
    return Object.values(this.mapRoleCounterSignal()).reduce((sum, count) => sum + count, 0);
  }
  
}
