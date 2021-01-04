import { TestBed } from '@angular/core/testing';

import { OrderHistoryDataService } from './order-history-data.service';

describe('OrderHistoryDataService', () => {
  let service: OrderHistoryDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderHistoryDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
