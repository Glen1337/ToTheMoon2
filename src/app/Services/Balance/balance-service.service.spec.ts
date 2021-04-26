import { TestBed } from '@angular/core/testing';

import { BalanceService } from './balance-service.service';

describe('BalanceServiceService', () => {
  let service: BalanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BalanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
