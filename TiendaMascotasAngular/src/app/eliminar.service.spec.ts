import { TestBed } from '@angular/core/testing';

import { EliminarService } from './eliminar.service';

describe('EliminarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EliminarService = TestBed.get(EliminarService);
    expect(service).toBeTruthy();
  });
});
