import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import {HttpClient,  HttpHeaders} from '@angular/common/http';
import { LoginjwtService } from '../loginjwt.service';
import { sha256, sha224 } from 'js-sha256';
import { OverlayService } from '../overlay.service';
import { TemplateProgressSpinnerComponent } from '../template-progress-spinner/template-progress-spinner.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public headers= new HttpHeaders();
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  displayProgressSpinner = false;
  public nombreUsuario: FormControl;
  public password:FormControl;
  public formValid:boolean;
  public rolUsuario: string="";
  public accion:string="";
  public usuario:number = 0;

  constructor(public router:Router, private jwt: LoginjwtService,private http:HttpClient ) {

    this.nombreUsuario=new FormControl("",Validators.required);
    this.password=new FormControl("",Validators.required);
    this.formValid=false;
    localStorage.clear()
  }

  validarFormulario(){
    if(this.nombreUsuario.valid && this.password.valid)
    {
      this.formValid=true;
    }
    else{
      this.formValid=false;
    }
  }

  public login(){
    this.displayProgressSpinner = true;
    setTimeout(() => {
      this.displayProgressSpinner = false;
    },3000);
    var constrasenaEncriptada = sha256(this.password.value)
    console.log("variable de usuario: ",this.nombreUsuario)
    this.jwt.login(this.nombreUsuario.value, constrasenaEncriptada);
    setTimeout(() => {
      this.mostrarPorNombreUsuario();
    },1000);
    setTimeout(() => {
      window.localStorage.setItem("tipoUsuario",this.rolUsuario.toLowerCase());

    },3000);
  };


  public mostrarPorNombreUsuario(){
    let nombreUsuario=localStorage.getItem("nombreUsuario");
    this.http.post('http://localhost:3000/usuarios/listarUsuariosPornombre/',{nombreUsuario},{headers:this.headers}).subscribe(
      (success:any)=>{
          this.rolUsuario=success.respuesta[0].tipoUsuario;

      },
      (error)=>{
        console.log("algo ocurrio: ",error)
      }
    );
  }



  ngOnInit() {
  }
}
