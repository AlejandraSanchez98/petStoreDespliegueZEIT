import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EliminarService {
  constructor() { }

  public confirmarEliminacion(): boolean{
    let elegirOpcion=confirm("¿Seguro que lo deseas eliminar?");
    if(elegirOpcion==true){
      return true;
    }else
    return false;
  }
}
