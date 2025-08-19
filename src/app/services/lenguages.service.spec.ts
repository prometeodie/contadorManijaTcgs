import { TestBed } from '@angular/core/testing';

import { LenguagesService } from './lenguages.service';

describe('LenguagesService', () => {
  let service: LenguagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LenguagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
