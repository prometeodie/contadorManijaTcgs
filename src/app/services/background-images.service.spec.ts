import { TestBed } from '@angular/core/testing';

import { BackgroundImagesService } from './background-images.service';

describe('BackgroundImagesService', () => {
  let service: BackgroundImagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackgroundImagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
