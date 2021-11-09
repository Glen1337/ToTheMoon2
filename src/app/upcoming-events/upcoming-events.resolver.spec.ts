import { TestBed } from '@angular/core/testing';

import { UpcomingEventsResolverService } from './upcoming-events.resolver';

describe('UpcomingEventsResolver', () => {
  let resolver: UpcomingEventsResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(UpcomingEventsResolverService);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
