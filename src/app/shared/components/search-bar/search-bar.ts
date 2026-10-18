import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  placeholder = input('Rechercher...');

  search = signal('');

  searchChange = output<string>();

  onSearchChange(value: string): void {

    this.search.set(value);

    this.searchChange.emit(value);

  }
}
