import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-filter-buttons',
  standalone: true,
  templateUrl: './filter-buttons.html',
  styleUrl: './filter-buttons.css',
})
export class FilterButtons {

  filters = input.required<{ label: string; value: string }[]>();

  selectedFilter = input.required<string>();

  filterChange = output<string>();

  selectFilter(value: string): void {
    this.filterChange.emit(value);
  }
}