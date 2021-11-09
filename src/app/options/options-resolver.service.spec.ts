import { TestBed } from '@angular/core/testing';

import { OptionsResolverService } from './options-resolver.service';

describe('OptionsResolverService', () => {
  let service: OptionsResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OptionsResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
