import { TestBed } from '@angular/core/testing';

import { TimerServicesService } from './timer-services.service';

describe('TimerServicesService', () => {
  let service: TimerServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimerServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
