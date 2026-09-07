import { Injectable, signal } from '@angular/core';
import { ROLES } from '../constants /roles.data';
import { Role as RoleModel } from '../model/role.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  public rolesSignal = signal<RoleModel[]>(ROLES); 
  
  
  readonly roles = this.rolesSignal.asReadonly();

  constructor() {}

  getRoleById(id: string): RoleModel | undefined {
    return this.rolesSignal().find(role => role.id === id);
  }
}
