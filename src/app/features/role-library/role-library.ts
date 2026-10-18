import { Component, computed, signal } from '@angular/core';

import { ROLES } from '../../data/roles';
import { RoleCard } from '../../shared/components/role-card/role-card';
import { SearchBar } from '../../shared/components/search-bar/search-bar';
import { FilterButtons } from '../../shared/components/filter-buttons/filter-buttons';

type Filter = 'tous' | 'village' | 'loup' | 'solitaire';

@Component({
  selector: 'app-role-library',
  imports: [RoleCard, SearchBar, FilterButtons],
  templateUrl: './role-library.html',
  styleUrl: './role-library.scss',
})
export class RoleLibrary {

  roles = ROLES;

  search = signal('');

  selectedFilter = signal<Filter>('tous');

  filters: { label: string; value: Filter }[] = [
    { label: 'Tous', value: 'tous' },
    { label: 'Loups', value: 'loup' },
    { label: 'Village', value: 'village' },
    { label: 'Solitaires', value: 'solitaire' }
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
}