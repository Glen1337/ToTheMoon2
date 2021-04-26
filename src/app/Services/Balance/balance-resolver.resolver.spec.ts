import { TestBed } from '@angular/core/testing';

import { BalanceResolver } from './balance-resolver.resolver';

describe('BalanceResolverResolver', () => {
  let resolver: BalanceResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(BalanceResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
