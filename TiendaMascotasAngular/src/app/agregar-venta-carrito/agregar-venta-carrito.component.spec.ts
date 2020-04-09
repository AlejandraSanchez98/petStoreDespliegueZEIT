import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarVentaCarritoComponent } from './agregar-venta-carrito.component';

describe('AgregarVentaCarritoComponent', () => {
  let component: AgregarVentaCarritoComponent;
  let fixture: ComponentFixture<AgregarVentaCarritoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarVentaCarritoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarVentaCarritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
