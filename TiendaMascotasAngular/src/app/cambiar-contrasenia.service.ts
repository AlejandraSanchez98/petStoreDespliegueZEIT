import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class CambiarContraseniaService {

  public headers:any;
  public api:string;
  public apiVerificar:string;
  public apiCambiarContrasenia:string;



  constructor(private http:HttpClient,private router:Router, public activateRoute:ActivatedRoute) {

    this.api = 'http://localhost:3000/enviarMensaje/verificarCorreoUsuario'; //origen de donde se consumira la api
    this.apiVerificar='http://localhost:3000/enviarMensaje/verificarToken';
    this.apiCambiarContrasenia='http://localhost:3000/enviarMensaje/cambiarContrasenia';
    this.activateRoute.queryParams.subscribe((params:any)=>{
      let token: string;
      token=params['token'];
      localStorage.setItem('token',token)

    })
    setTimeout(()=>{
      this.headers= new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token'), //token almacenado en LS
        'Content-Type': 'application/json',//tipo de contenido JSON
        'Accept': 'application/json' //acepta el cuerpo de la peticion JSON
      });
    },0);

  }


public prueba(){
  console.log("esto es una prueba")
}

  public enviarCorreo(correo: string) {
    console.log("este es el error antes de entrar al subscribe");
    this.http.post(this.api, {correo},{headers:this.headers})
    .subscribe((resp:any) => {
      if (resp.estatus == 0) {
        alert("Verificar el correo electronico")
        return;
      }
      console.log("este es el error despues de entrar al subscribe",resp)

      alert("Mensaje Enviado correctamente");
    },
    (error)=>{
      console.log(error);
      alert("Mensaje no enviado");
    });
  }

  public verificarToken(jwt:string){
    return this.http.post(this.apiVerificar,{jwt},{headers:this.headers});
  }

  public cambiarPassword(idUsuario:number, passwordUsuario:string){
    return this.http.put(this.apiCambiarContrasenia,{idUsuario,passwordUsuario},{headers:this.headers});
  }
}
