import { TestBed, inject } from '@angular/core/testing';

import { ContantService } from './contant.service';

describe('ContantService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContantService]
    });
  });

  it('should be created', inject([ContantService], (service: ContantService) => {
    expect(service).toBeTruthy();
  }));
});
