import { TestBed } from '@angular/core/testing';

import { SymbolLookupService } from './symbol-lookup.service';

describe('SymbolLookupService', () => {
  let service: SymbolLookupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SymbolLookupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
