import { TestBed } from '@angular/core/testing';

import { WatchlistResolverService } from './watchlist-resolver.service';

describe('WatchlistResolverService', () => {
  let service: WatchlistResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WatchlistResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
