import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleLibrary } from './role-library';

describe('RoleLibrary', () => {
  let component: RoleLibrary;
  let fixture: ComponentFixture<RoleLibrary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleLibrary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleLibrary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
