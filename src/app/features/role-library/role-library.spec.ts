import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleLibrary } from './role-library';
import { provideRouter } from '@angular/router';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { ROLES } from '../../data/roles';
import { GameSession } from '../game-setup/game-session';

describe('RoleLibrary', () => {
  let component: RoleLibrary;
  let fixture: ComponentFixture<RoleLibrary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleLibrary], providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap({ from: 'game-setup' }) } } },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleLibrary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('combine la recherche avec le filtre de camp', () => {
    component.onSearchChange('loup');
    expect(component.filteredRoles().every((role) => role.name.toLowerCase().includes('loup'))).toBe(true);
    component.selectFilter('loup');
    expect(component.filteredRoles().length).toBeGreaterThan(0);
    expect(component.filteredRoles().every((role) => role.team === 'loup' && role.name.toLowerCase().includes('loup'))).toBe(true);
    component.onSearchChange('nom inexistant');
    expect(component.filteredRoles()).toEqual([]);
    component.onSearchChange('');
    component.selectFilter('tous');
    expect(component.filteredRoles()).toHaveLength(ROLES.length);
  });

  it('ajoute et retire des rôles sans dépasser le nombre de joueurs', () => {
    component.session.playerCount.set(2);
    const role = ROLES[0];
    component.adjustRole(role.id, 1);
    component.adjustRole(role.id, 1);
    component.adjustRole(ROLES[1].id, 1);

    expect(component.roleCount(role.id)).toBe(2);
    expect(component.selectedRoleCount()).toBe(2);
    expect(component.remainingRoles()).toBe(0);

    component.adjustRole(role.id, 1);
    expect(component.selectedRoleCount()).toBe(2);
    component.adjustRole(role.id, -1);
    component.adjustRole(role.id, -1);
    component.adjustRole(role.id, -1);
    expect(component.roleCount(role.id)).toBe(0);
    expect(component.selectedRoleCount()).toBe(0);
  });

  it('compte les Deux Sœurs comme deux cartes et deux joueurs dans la composition manuelle', () => {
    component.session.playerCount.set(2);
    const sisters = ROLES.find((role) => role.id === 'deux-soeurs')!;

    component.adjustRole(sisters.id, 1);

    expect(component.roleCount(sisters.id)).toBe(2);
    expect(component.selectedRoleCount()).toBe(2);
    expect(component.remainingRoles()).toBe(0);
    component.adjustRole(sisters.id, 1);
    expect(component.roleCount(sisters.id)).toBe(2);

    component.adjustRole(sisters.id, -1);
    expect(component.roleCount(sisters.id)).toBe(0);
    expect(component.selectedRoleCount()).toBe(0);
  });

  it('enregistre la composition complète et ouvre le résumé', () => {
    component.session.playerCount.set(2);
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component.adjustRole(ROLES[0].id, 2);

    component.saveComposition();

    expect(component.session.roles()).toEqual([ROLES[0], ROLES[0]]);
    expect(component.session.compositionChosen()).toBe(true);
    expect(navigate).toHaveBeenCalledWith(['/role-summary']);
  });

  it('refuse de valider une composition incomplète', () => {
    component.session.playerCount.set(2);
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    component.adjustRole(ROLES[0].id, 1);

    component.saveComposition();

    expect(component.session.roles()).toEqual([]);
    expect(component.session.compositionChosen()).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
  });
});
