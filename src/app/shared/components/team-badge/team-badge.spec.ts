import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamBadge } from './team-badge';

describe('TeamBadge', () => {
  let component: TeamBadge;
  let fixture: ComponentFixture<TeamBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamBadge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamBadge);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('team', 'solitaire');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('SOLITAIRE');
  });
});
