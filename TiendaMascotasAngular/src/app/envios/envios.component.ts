import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator,MatPaginatorIntl} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import {ApiService} from '../api.service';
import { IEnvios } from '../api.service';
import { IViaEnvios } from '../api.service';
import { EliminarService } from '../eliminar.service';
import { LoginjwtService } from '../loginjwt.service';



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


@Component({
  selector: 'app-envios',
  templateUrl: './envios.component.html',
  styleUrls: ['./envios.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useValue: new MyCustomPaginatorIntl() }]
})
export class EnviosComponent implements OnInit {
  myCustomPaginatorIntl: MyCustomPaginatorIntl;
  public arregloEnvios:IEnvios[];
  public arregloVentasSelect:IEnvios[];
  public arregloEnviosSelect:IEnvios[];
  public arregloViaEnvios:IViaEnvios[];

  public modal: NgbModalRef;
  public frmEnvios:FormGroup;
  public frmViaEnvios:FormGroup;
  public formValid:Boolean=false;
  public titulo:string;
  public usuarioEnSesion:string;
  public rolUsuario:string;



  displayedColumns: string[] = ['idEnvio','direccion','ciudad','observaciones','idVenta','medioEnvio']
  dataSource: MatTableDataSource<IEnvios>;

  displayedColumnsViaEnvios: string[] = ['idViaEnvio', 'medioEnvio', 'descripcion','acciones'];
  dsViaEnvios:MatTableDataSource<IViaEnvios>;

  @ViewChild('MatPaginatorEnvios', {static: true}) paginatorEnvios: MatPaginator;
  @ViewChild('MatPaginatorViaEnvios',{static: true}) paginatorViaEnvios:MatPaginator;

  constructor(private modalService: NgbModal,public router:Router,public formBuilder: FormBuilder, public API:ApiService,matPaginatorIntl: MatPaginatorIntl,public eliminarCorrectamente: EliminarService,public jwt:LoginjwtService) {
    this.usuarioEnSesion = window.localStorage.getItem('nombreUsuario');
    this.rolUsuario = window.localStorage.getItem('tipoUsuario');
    this.myCustomPaginatorIntl = <MyCustomPaginatorIntl>matPaginatorIntl;

    //Inizializacion
    this.titulo="";
    this.arregloEnvios=[];
    this.arregloVentasSelect=[];
    this.arregloEnviosSelect=[];
    this.arregloViaEnvios=[];

    this.frmEnvios = this.formBuilder.group({
      idEnvio:[""],
      direccion:["",Validators.required],
      ciudad:["",Validators.required],
      observaciones:["",Validators.required],
      idVenta:["",Validators.required],
      idViaEnvio:["",Validators.required]
    });

    this.frmViaEnvios= this.formBuilder.group({
      idViaEnvio:[""],
      medioEnvio:["",Validators.required],
      descripcion:["",Validators.required]
    });
  }


  //Abrir modal Envios
  public openAgregar(content) {
    this.modal= this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo="Agregar Envio"
    this.listarMediosEnviosSelect();

  }

  //listar Envios
  public  listarEnvios(){
    this.API.listarEnvios().subscribe(
      (success:any)=>{
        console.log("Exito"+JSON.stringify(success));
        this.dataSource = new MatTableDataSource(this.arregloEnvios=success.respuesta);

        this.dataSource.paginator = this.paginatorEnvios;
        this.dataSource.paginator._intl.itemsPerPageLabel = "Elementos por página";

      },
      (error)=>{
        console.log("Lo sentimos"+error);
      }
    );
  }

  public agregarEnvio(){
    //DATOS PROVENIENTES DEL FORMGROUP
    let direccionForm = this.frmEnvios.get('direccion').value;
    let ciudadForm = this.frmEnvios.get('ciudad').value;
    let observacionesForm = this.frmEnvios.get('observaciones').value;
    let idVentaForm = this.frmEnvios.get('idVenta').value;
    let idViaEnvioForm = this.frmEnvios.get('idViaEnvio').value;
    //SE AGREGAN REGISTROS MEDIANTE POST
    this.API.agregarEnvio(direccionForm,ciudadForm,observacionesForm,idVentaForm,idViaEnvioForm).subscribe(
      (success:any)=>{
        console.log("Exito"+success);
        this.listarEnvios();
      },
      (error)=>{
        console.log("Error"+ error);
      }
    );
    this.modal.close();
  }


  //listar el select de ventas
  public listarVentas(){
    this.API.listarVentas().subscribe(
      (success:any)=>{
        return this.arregloVentasSelect = success.respuesta;
      },
      (error)=>{
        console.log("Error", error)
      }
    );
  }

  //listar el select de viaEnvio
  public listarMediosEnviosSelect(){
    this.API.listarMediosEnvios().subscribe(
      (success:any)=>{
        return this.arregloEnviosSelect = success.respuesta;
      },
      (error)=>{
        console.log("Error", error)
      }
    );
  }


  //Abrir modal Medio Envio
  public openAgregarViaEnvio(contentViaEnvio) {
    this.modal= this.modalService.open(contentViaEnvio, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo="Agregar Medio De Envio"
  }

  public openEditarViaEnvio(contentViaEnvio, idViaEnvio: number, medioEnvio: string, descripcion:string){
    this.modal= this.modalService.open(contentViaEnvio,{ariaLabelledBy:'modal-basic-title'});
    this.titulo = "Editar Medio De Envio";

    this.frmViaEnvios.controls['idViaEnvio'].setValue(idViaEnvio);
    this.frmViaEnvios.controls['medioEnvio'].setValue(medioEnvio);
    this.frmViaEnvios.controls['descripcion'].setValue(descripcion);
  }

  public ejecutarPeticionViaEnvio(){
    let medioEnvioForm = this.frmViaEnvios.get('medioEnvio').value;
    let descripcionForm = this.frmViaEnvios.get('descripcion').value;
    if (this.titulo == "Agregar Medio De Envio") {

      this.API.agregarMedioEnvio(medioEnvioForm, descripcionForm).subscribe(
        (success: any)=>{
          console.log("exito: "+ JSON.stringify(success));
          this.listarMediosEnvios();
        },
        (error)=>{
          console.log("Lo siento: "+error);
        }
      );
      this.modal.close();
    }
    if (this.titulo == "Editar Medio De Envio") {
      let idViaEnvio = this.frmViaEnvios.get('idViaEnvio').value;
      let medioEnvioForm = this.frmViaEnvios.get('medioEnvio').value;
      let descripcionForm = this.frmViaEnvios.get('descripcion').value;

      //EJECUTANDO PETICION PUT
      this.API.editarMedioEnvio(idViaEnvio,medioEnvioForm,descripcionForm).subscribe(
        (success: any)=>{
          console.log("Registro editado: "+success);
          this.listarMediosEnvios();
        },
        (error)=>{
          console.log("Lo siento: "+error);
        }
      );
      this.modal.close();
    }
  }
  //eliminar Medio de envio
  public eliminarMedioEnvio(idViaEnvio:number){
    let resultado: boolean = false;
    resultado = this.eliminarCorrectamente.confirmarEliminacion();
    if (resultado==true) {
      this.API.eliminarMedioEnvio(idViaEnvio).subscribe(
        (success:any)=>{
          console.log("Exito"+success);
          this.listarMediosEnvios();
        },
        (error)=>{
          console.log("Error"+ error);
        }
      )
    }
    else{
      console.log("Eliminación cancelada");
    }
  }

  //listar Medios de envio
  public  listarMediosEnvios(){
    this.API.listarMediosEnvios().subscribe(
      (success:any)=>{
        console.log("Exito"+JSON.stringify(success));
        this.arregloViaEnvios=success.respuesta;
        this.dsViaEnvios = new MatTableDataSource(this.arregloViaEnvios);

        this.dsViaEnvios.paginator = this.paginatorViaEnvios;
        this.dsViaEnvios.paginator._intl.itemsPerPageLabel = "Elementos por página";

      },
      (error)=>{
        console.log("Lo sentimos"+error);
      }
    );
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dsViaEnvios.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    if (this.dsViaEnvios.paginator) {
      this.dsViaEnvios.paginator.firstPage();
    }
  }


  //CERRAMOS SESION
  public cerrarSesion(){
    let accion:string="Salida del sistema";
    this.jwt.registrarAccesoUsuario(accion, localStorage.getItem('nombreUsuario'));
    setTimeout(() => {
      localStorage.clear();
      this.router.navigate(['/login']);
    },3000);
  }


  ngOnInit() {
    //this.verificarRolUsuario.verificarAcceso();
    this.listarEnvios();
    this.listarVentas();
    this.listarMediosEnviosSelect();
    this.listarMediosEnvios();
  }

}
