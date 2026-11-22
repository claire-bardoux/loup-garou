import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ROLES } from '../../data/roles';
import { RoleCard } from '../../shared/components/role-card/role-card';
import { SearchBar } from '../../shared/components/search-bar/search-bar';
import { FilterButtons } from '../../shared/components/filter-buttons/filter-buttons';
import { GameSession } from '../game-setup/game-session';

type Filter = 'tous' | 'village' | 'loup' | 'solitaire' | 'ambigu' | 'autres';

@Component({
  selector: 'app-role-library',
  imports: [RoleCard, SearchBar, FilterButtons, RouterLink],
  templateUrl: './role-library.html',
  styleUrl: './role-library.scss',
})
export class RoleLibrary {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly session = inject(GameSession);
  readonly cameFromGameSetup = this.route.snapshot.queryParamMap.get('from') === 'game-setup';

  roles = ROLES;

  search = signal('');

  selectedFilter = signal<Filter>('tous');
  readonly selectedRoles = signal<Record<string, number>>({});
  readonly selectedRoleCount = computed(() => Object.values(this.selectedRoles()).reduce((sum, count) => sum + count, 0));
  readonly remainingRoles = computed(() => this.session.playerCount() - this.selectedRoleCount());

  filters: { label: string; value: Filter }[] = [
    { label: 'Tous', value: 'tous' },
    { label: 'Loups', value: 'loup' },
    { label: 'Village', value: 'village' },
    { label: 'Solitaires', value: 'solitaire' },
    { label: 'Ambigus', value: 'ambigu' },
    { label: 'Autres', value: 'autres' }
  ];

  filteredRoles = computed(() => {

    const search = this.search().toLowerCase();

    const filter = this.selectedFilter();

    return this.roles.filter(role => {

      const matchesSearch =
        role.name.toLowerCase().includes(search);

      const matchesFilter =
        filter === 'tous' ||
        role.team === filter;

      return matchesSearch && matchesFilter;

    });

  });

  onSearchChange(value: string): void {
    this.search.set(value);
  }

  selectFilter(filter: string): void {
    this.selectedFilter.set(filter as Filter);
  }

  roleCount(roleId: string): number {
    return this.selectedRoles()[roleId] ?? 0;
  }

  adjustRole(roleId: string, delta: number): void {
    const current = this.roleCount(roleId);
    if (delta > 0 && this.remainingRoles() <= 0) return;
    const next = Math.max(0, current + delta);
    this.selectedRoles.update((roles) => {
      const updated = { ...roles };
      if (next === 0) delete updated[roleId];
      else updated[roleId] = next;
      return updated;
    });
  }

  saveComposition(): void {
    if (!this.cameFromGameSetup || this.remainingRoles() !== 0) return;
    const roles = Object.entries(this.selectedRoles()).flatMap(([id, count]) => {
      const role = this.roles.find((item) => item.id === id);
      return role ? Array.from({ length: count }, () => role) : [];
    });
    this.session.setDraft(this.session.playerCount(), roles, [], this.session.compositionStyle(), []);
    this.session.chooseDraft();
    void this.router.navigate(['/role-summary']);
  }
}
