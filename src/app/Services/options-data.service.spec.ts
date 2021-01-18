import { TestBed } from '@angular/core/testing';

import { OptionsDataService } from './options-data.service';

describe('OptionsDataService', () => {
  let service: OptionsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OptionsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
