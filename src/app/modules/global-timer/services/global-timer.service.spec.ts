import { TestBed } from '@angular/core/testing';

import { GlobalTimerService } from './global-timer.service';

describe('GlobalTimerService', () => {
  let service: GlobalTimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalTimerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
