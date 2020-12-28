import { TestBed } from '@angular/core/testing';

import { HoldingServiceService } from './holding-service.service';

describe('HoldingServiceService', () => {
  let service: HoldingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HoldingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
