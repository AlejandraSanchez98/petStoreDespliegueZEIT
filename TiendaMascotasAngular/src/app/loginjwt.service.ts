import { Injectable } from '@angular/core';
import {HttpClient,  HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class LoginjwtService {
  public headers= new HttpHeaders();


  public api = 'http://localhost:3000/login/verificarUsuario'; //origen de donde se consumira la api
  constructor(private http:HttpClient,private router:Router) { }
  public login(usuario: string, contrasenia: string) {
    let accion:string ="Entrada al sistema";
    this.http.post(this.api, {nombreUsuario: usuario, passwordUsuario:contrasenia})
    .subscribe((resp:any) => {
      if(resp.estatus > 0){
        localStorage.setItem('token',resp.respuesta);
        window.localStorage.setItem("nombreUsuario",usuario.toLowerCase());//almacenamos variables en LS
        this.registrarAccesoUsuario(accion,usuario)
        setTimeout(() => {
          this.router.navigate(['/carrito']);
        },3000);
      }
      else
      {
        alert("Usuario Incorrecto");
      }
    });
  }

  public verificarAcceso(){
    let rolUsuario: string="";
    rolUsuario = localStorage.getItem('tipoUsuario')
    if (rolUsuario != 'gerente') {
      document.getElementById('idmenu').style.display = "none";
      document.getElementById('logo').style.display = "block";
    }
  }

  public registrarAccesoUsuario(accion:string, nombreUsuario: string){
    this.http.post('http://localhost:3000/usuarios/listarUsuariosPornombre/',{nombreUsuario},{headers:this.headers}).subscribe(
      (success:any)=>{
        let usuario: number = 0;
        usuario=success.respuesta[0].idUsuario;
        this.agregarAcceso(accion,usuario)
      },
      (error)=>{
        console.log("algo ocurrio: ",error)
      }
    );
  }

  public agregarAcceso(accion:string,idUsuario:number){
    this.http.post('http://localhost:3000/accesos/agregarAcceso',{accion,idUsuario},{headers:this.headers}).subscribe(
      (success:any)=>{
          console.log("exito: ",JSON.stringify(success.respuesta));
      },
      (error)=>{
          alert("algo anda mal | "+ JSON.stringify(error));
      }
    );
  }

}
