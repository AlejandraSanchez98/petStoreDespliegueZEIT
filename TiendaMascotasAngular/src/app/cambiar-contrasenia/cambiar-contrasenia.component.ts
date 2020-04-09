import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import {CambiarContraseniaService } from '../cambiar-contrasenia.service';
import {sha256} from 'js-sha256';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';


@Component({
  selector: 'app-cambiar-contrasenia',
  templateUrl: './cambiar-contrasenia.component.html',
  styleUrls: ['./cambiar-contrasenia.component.scss']
})
export class CambiarContraseniaComponent implements OnInit {
  public frmCambiarContrasenia:FormGroup;
  public formValid:Boolean=false;
  public contraseniaIgual:Boolean;
  constructor(public formBuilder: FormBuilder,private router:Router,public cambiarContrasenia:CambiarContraseniaService, public activateRoute:ActivatedRoute) {
    this.contraseniaIgual = false;
    this.verificarToken();
    this.frmCambiarContrasenia=this.formBuilder.group({
      contrasenia:["",Validators.required],
      confirmarContrasenia:["",Validators.required]
    })
   }

   public confirmarPassword(event:any){
     console.log("entro a conicidencia",event);
     let  contrasenia = this.frmCambiarContrasenia.get('contrasenia').value;
     let  confirmarContrasenia = this.frmCambiarContrasenia.get('confirmarContrasenia').value;
     if (confirmarContrasenia != contrasenia) {
       this.contraseniaIgual = false;
       return this.contraseniaIgual;
     }else{
       this.contraseniaIgual = true;
       return this.contraseniaIgual;
     }

   }

   public verificarToken(){
     this.activateRoute.queryParams.subscribe((params: any)=>{
      let token: string;
      token=params['token'];
      this.cambiarContrasenia.verificarToken(token).subscribe(
        (success: any)=>{
          if (success.estatus != 1) {
            this.router.navigate(['/login']);
            setTimeout(()=>{
              alert(success.respuesta);
            },0);
            return
          }
        },
        (error:any)=>{
          console.log("Lo siento: ",error);
          this.router.navigate(['/login']);
        }
      )
    }
  )
}

public cambiarPassword(){
  this.activateRoute.queryParams.subscribe((params: any)=>{
    let idUsuario=params['idUsuario'];
    let contraseniaNueva= this.frmCambiarContrasenia.get('contrasenia').value;
    this.cambiarContrasenia.cambiarPassword(idUsuario,sha256(contraseniaNueva)).subscribe(
      (success: any)=>{
        console.log(success)
        if (success.estatus ==1) {
          this.router.navigate(['/login']);
          setTimeout(()=>{
            alert(success.respuesta);
          },0);
          return
        }
      },
      (error:any)=>{
        console.log("Lo siento: ",error);
        this.router.navigate(['/login']);
      }
    )
  }
)
}


  ngOnInit() {
  }

}
