import { Component, computed, signal } from '@angular/core';
import { ROLES } from '../../data/roles';
import { RoleCard } from '../../components/role-card/role-card';

type Filter = 'tous' | 'village' | 'loup' | 'solitaire';

@Component({
  selector: 'app-role-library',
  imports: [RoleCard],
  templateUrl: './role-library.html',
  styleUrl: './role-library.scss',
})
export class RoleLibrary {


  roles = ROLES;

  search = signal('');

  selectedFilter = signal<Filter>('tous');

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

  selectFilter(filter: Filter) {

    this.selectedFilter.set(filter);

  }
}
