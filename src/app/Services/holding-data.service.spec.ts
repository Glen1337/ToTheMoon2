import { TestBed } from '@angular/core/testing';

import { HoldingService } from './holding-data.service';

describe('HoldingServiceService', () => {
  let service: HoldingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HoldingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
