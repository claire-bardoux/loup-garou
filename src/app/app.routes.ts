import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Training } from './pages/training/training';
import { Statistics } from './pages/statistics/statistics';
import { RoleLibrary } from './pages/role-library/role-library';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'training',
    component: Training
  },
  {
    path: 'statistics',
    component: Statistics
  },
  {
    path: 'role-library',
    component: RoleLibrary
  },
  {
    path: '**',
    redirectTo: ''
  }
];