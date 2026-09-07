import { TestBed } from '@angular/core/testing';
import { Role } from '../../model/role.model';
import { RoleService } from '../role.service';

describe('Role', () => {
  let service: Role;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleService).roles()[0]; // Inject the first role for testing
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
