import { TestBed } from '@angular/core/testing';

import { SwitchMapChannelsService } from './switch-map-channels.service';

describe('SwitchMapChannelsService', () => {
  let service: SwitchMapChannelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwitchMapChannelsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
