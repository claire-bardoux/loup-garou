import { Routes } from '@angular/router';

import { Home } from './features/home/home';
import { Training } from './features/training/training';
import { Statistics } from './features/statistics/statistics';
import { RoleLibrary } from './features/role-library/role-library';
import { RoleDetail } from './features/role-detail/role-detail';

export const routes: Routes = [
  {
    path: '',
    component: RoleLibrary
  },
  {
    path: 'role-library',
    component: RoleLibrary
  },
  {
    path: 'roles/:id',
    component: RoleDetail
  },
  {
    path: '**',
    redirectTo: ''
  }
];