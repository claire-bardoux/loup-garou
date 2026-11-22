import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterButtons } from './filter-buttons';

describe('FilterButtons', () => {
  let component: FilterButtons;
  let fixture: ComponentFixture<FilterButtons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterButtons]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterButtons);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('filters', [{ label: 'Tous', value: 'tous' }]);
    fixture.componentRef.setInput('selectedFilter', 'tous');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const emitted: string[] = [];
    component.filterChange.subscribe((value) => emitted.push(value));
    component.selectFilter('loup');
    expect(emitted).toEqual(['loup']);
  });
});
