import { TestBed } from '@angular/core/testing';

import { CambiarContraseniaService } from './cambiar-contrasenia.service';

describe('CambiarContraseniaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CambiarContraseniaService = TestBed.get(CambiarContraseniaService);
    expect(service).toBeTruthy();
  });
});
