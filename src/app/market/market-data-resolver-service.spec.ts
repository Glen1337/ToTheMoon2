import { TestBed } from '@angular/core/testing';

import { MarketDataResolverService } from './market-data-resolver.service';

describe('MarketDataResolverServiceService', () => {
  let service: MarketDataResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketDataResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
