import { TestBed } from '@angular/core/testing';

import { TurnTimerService } from './turn-timer.service';

describe('TurnTimerService', () => {
  let service: TurnTimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TurnTimerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
