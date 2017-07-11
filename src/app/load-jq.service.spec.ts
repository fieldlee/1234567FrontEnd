import { TestBed, inject } from '@angular/core/testing';

import { LoadJQService } from './load-jq.service';

describe('LoadJQService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadJQService]
    });
  });

  it('should be created', inject([LoadJQService], (service: LoadJQService) => {
    expect(service).toBeTruthy();
  }));
});
