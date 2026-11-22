import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleCard } from './role-card';
import { ROLES } from '../../../data/roles';
import { provideRouter } from '@angular/router';

describe('RoleCard', () => {
  let component: RoleCard;
  let fixture: ComponentFixture<RoleCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleCard], providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('role', ROLES[0]);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Simple villageois');
  });
});
