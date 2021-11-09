import { TestBed } from '@angular/core/testing';

import { TickerService } from './ticker-service.service';

describe('TickerServiceService', () => {
  let service: TickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TickerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
