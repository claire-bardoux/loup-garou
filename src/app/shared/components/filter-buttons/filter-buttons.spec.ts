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
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
