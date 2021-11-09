import { TestBed } from '@angular/core/testing';

import { PortfolioListResolverService } from './portfolio-list-resolver.service';

describe('PortfolioListResolverService', () => {
  let service: PortfolioListResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortfolioListResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
