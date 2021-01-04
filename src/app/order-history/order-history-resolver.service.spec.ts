import { TestBed } from '@angular/core/testing';

import { OrderHistoryResolverService } from './order-history-resolver.service';

describe('OrderHistoryResolverService', () => {
  let service: OrderHistoryResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderHistoryResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
