import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator,MatPaginatorIntl} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { sha256, sha224 } from 'js-sha256';
import {ApiService} from '../api.service';
import { IUsuarios } from '../api.service';

export class MyCustomPaginatorIntl extends MatPaginatorIntl {
  nextPageLabel = 'Siguiente Página';
  previousPageLabel = 'Página Anterior';
  showPlus: boolean;

  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) { return `0 de ${length}`; }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;
    const endIndex = startIndex < length ?
        Math.min(startIndex + pageSize, length) :
        startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} de ${length}${this.showPlus ? '+' : ''}`;
  }
}


export interface Tipo {
  tipoU: string;
}


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useValue: new MyCustomPaginatorIntl() }]

})
export class UsuariosComponent implements OnInit {
  myCustomPaginatorIntl: MyCustomPaginatorIntl;
  tipo: Tipo[] = [
    {tipoU: 'Vendedor'},
    {tipoU: 'Gerente'}
  ];
  public arregloUsuarios:IUsuarios[];
  public modal: NgbModalRef;

  public frmUsuarios:FormGroup;
  public formValid:Boolean=false;
  public titulo:string;

  displayedColumns: string[] = ['idUsuario', 'nombreUsuario','telefonoUsuario','direccionUsuario','correo','tipoUsuario','acciones'];
  dataSource:MatTableDataSource<IUsuarios>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private modalService: NgbModal,public router:Router,public formBuilder: FormBuilder, public API:ApiService,matPaginatorIntl: MatPaginatorIntl) {
    this.myCustomPaginatorIntl = <MyCustomPaginatorIntl>matPaginatorIntl;
    //Inizializacion
    this.titulo="";
    this.arregloUsuarios=[];
    this.frmUsuarios= this.formBuilder.group({
      idUsuario:[""],
      nombreUsuario:["",Validators.required],
      telefonoUsuario:["",Validators.required],
      direccionUsuario:["",Validators.required],
      correo:["",Validators.required],
      passwordUsuario:["",Validators.required],
      tipoUsuario:["",Validators.required]
    });
  }

  //Abrir modal
  public openAgregar(content) {
    this.modal= this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo="Agregar Usuario"
  }

  public openEditar(content, idUsuario: number, nombreUsuario: string, telefonoUsuario:string, direccionUsuario:string, correo:string, passwordUsuario:string, tipoUsuario:string){
    this.modal= this.modalService.open(content,{ariaLabelledBy:'modal-basic-title'});
    this.titulo = "Editar Usuario";

    this.frmUsuarios.controls['idUsuario'].setValue(idUsuario);
    this.frmUsuarios.controls['nombreUsuario'].setValue(nombreUsuario);
    this.frmUsuarios.controls['telefonoUsuario'].setValue(telefonoUsuario);
    this.frmUsuarios.controls['direccionUsuario'].setValue(direccionUsuario);
    this.frmUsuarios.controls['correo'].setValue(correo);
    this.frmUsuarios.controls['tipoUsuario'].setValue(tipoUsuario);
  }

  public ejecutarPeticion(){
    let nombreUsuarioForm = this.frmUsuarios.get('nombreUsuario').value;
    let telefonoUsuarioForm = this.frmUsuarios.get('telefonoUsuario').value;
    let direccionUsuarioForm = this.frmUsuarios.get('direccionUsuario').value;
    let correoForm = this.frmUsuarios.get('correo').value;
    let passwordUsuarioForm = sha256(this.frmUsuarios.get('passwordUsuario').value);
    let tipoUsuarioForm = this.frmUsuarios.get('tipoUsuario').value;    //EVITAMOS CREAR 2 MODALES, SIMPLEMENTE USAMOS 1 MODAL Y TIENE SU FUNCION SEGUN SU NOMBRE
    if (this.titulo == "Agregar Usuario") {

      //SE AGREGAN REGISTROS MEDIANTE POST
      this.API.agregarUsuario(nombreUsuarioForm, telefonoUsuarioForm, direccionUsuarioForm,correoForm, passwordUsuarioForm, tipoUsuarioForm).subscribe(
        (success: any)=>{
          this.listarUsuarios();
          this.frmUsuarios.reset();

        },
        (error)=>{
          console.log("Lo siento: "+error);
        }
      );
      this.modal.close();
    }
    if (this.titulo == "Editar Usuario") {
      //OBTENEMOS LOS VALORES DEL FORMULARIO
      let idUsuario = this.frmUsuarios.get('idUsuario').value;
      let nombreUsuarioForm = this.frmUsuarios.get('nombreUsuario').value;
      let telefonoUsuarioForm = this.frmUsuarios.get('telefonoUsuario').value;
      let direccionUsuarioForm = this.frmUsuarios.get('direccionUsuario').value;
      let correoForm = this.frmUsuarios.get('correo').value;
      let passwordUsuarioForm = sha256(this.frmUsuarios.get('passwordUsuario').value);
      let tipoUsuarioForm = this.frmUsuarios.get('tipoUsuario').value;

      
      this.API.editarUsuario(idUsuario,nombreUsuarioForm, telefonoUsuarioForm, direccionUsuarioForm, correoForm, passwordUsuarioForm, tipoUsuarioForm).subscribe(
        (success: any)=>{
          console.log("Registro editado: "+success);
          this.listarUsuarios();
        },
        (error)=>{
          console.log("Lo siento: "+error);
        }
      );
      this.modal.close();
    }
  }

  //eliminar usuario
  public eliminarUsuario(idUsuario:number){
    this.API.eliminarUsuario(idUsuario).subscribe(
      (success:any)=>{
        console.log("Exito"+success);
        this.listarUsuarios();
      },
      (error)=>{
        console.log("Error"+ error);
      }
    );
    this.modal.close();
  }

  //listar usuario
  public  listarUsuarios(){
    this.API.listarUsuarios().subscribe(
      (success:any)=>{
        this.arregloUsuarios=success.respuesta;
        this.dataSource = new MatTableDataSource(this.arregloUsuarios);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator._intl.itemsPerPageLabel = "Elementos por página";

      },
      (error)=>{
        console.log("Lo sentimos"+error);
      }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit() {
    this.listarUsuarios();
  }
}
