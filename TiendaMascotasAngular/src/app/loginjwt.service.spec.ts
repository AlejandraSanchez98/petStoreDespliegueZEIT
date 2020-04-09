import { TestBed } from '@angular/core/testing';

import { LoginjwtService } from './loginjwt.service';

describe('LoginjwtService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoginjwtService = TestBed.get(LoginjwtService);
    expect(service).toBeTruthy();
  });
});
