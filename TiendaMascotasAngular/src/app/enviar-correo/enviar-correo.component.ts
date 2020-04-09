import { Component, OnInit } from '@angular/core';
import{CambiarContraseniaService } from '../cambiar-contrasenia.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-enviar-correo',
  templateUrl: './enviar-correo.component.html',
  styleUrls: ['./enviar-correo.component.scss']
})
export class EnviarCorreoComponent implements OnInit {
  public correo:any;
  public frmEnviarCorreo: FormGroup;
  constructor(public cambiarContrasenia:CambiarContraseniaService,private formBuilder: FormBuilder,) {
    this.frmEnviarCorreo = this.formBuilder.group({
      correo:["",Validators.required]
    });
  }

  public enviarCorreo(correo:string){
    console.log(correo);
    this.cambiarContrasenia.enviarCorreo(correo);

  }
  ngOnInit() {
  }

}
