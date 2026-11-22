import { Routes } from '@angular/router';

import { Home } from './features/home/home';
import { RoleLibrary } from './features/role-library/role-library';
import { RoleDetail } from './features/role-detail/role-detail';
import { GameSetup } from './features/game-setup/game-setup';
import { RoleSummary } from './features/role-summary/role-summary';
import { GamePlay } from './features/game-play/game-play';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'role-library',
    component: RoleLibrary
  },
  {
    path: 'game-setup',
    component: GameSetup
  },
  {
    path: 'role-summary',
    component: RoleSummary
  },
  {
    path: 'game-play',
    component: GamePlay
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
