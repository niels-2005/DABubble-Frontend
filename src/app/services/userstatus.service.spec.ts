import { TestBed } from '@angular/core/testing';

import { UserstatusService } from './userstatus.service';

describe('UserstatusService', () => {
  let service: UserstatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserstatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
