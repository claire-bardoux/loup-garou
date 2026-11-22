import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBar } from './search-bar';

describe('SearchBar', () => {
  let component: SearchBar;
  let fixture: ComponentFixture<SearchBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('met à jour le signal et émet la nouvelle recherche', () => {
    const values: string[] = [];
    component.searchChange.subscribe((value) => values.push(value));
    component.onSearchChange('voyante');
    expect(component.search()).toBe('voyante');
    expect(values).toEqual(['voyante']);
  });
});
