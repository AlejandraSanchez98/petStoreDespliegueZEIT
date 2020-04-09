import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator,MatPaginatorIntl} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import {ApiService} from '../api.service';
import { IDevoluciones } from '../api.service';
import { ITiposDevoluciones } from '../api.service';
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
  selector: 'app-devoluciones',
  templateUrl: './devoluciones.component.html',
  styleUrls: ['./devoluciones.component.scss']
})
export class DevolucionesComponent implements OnInit {
  myCustomPaginatorIntl: MyCustomPaginatorIntl;
  public arregloDevoluciones:IDevoluciones[];
  public arregloClientesSelect:IDevoluciones[];
  public arregloTipoDevolucionSelect:IDevoluciones[];
  public arregloProductosSelect:IDevoluciones[];
  public arregloTiposDevoluciones:ITiposDevoluciones[];

  public modal: NgbModalRef;
  public frmDevoluciones:FormGroup;
  public frmTiposDevoluciones:FormGroup;
  public formValid:Boolean=false;
  public titulo:string;
  public usuarioEnSesion:string;
  public rolUsuario:string;


  displayedColumns: string[] = ['idDevolucion', 'montoDevolucion', 'motivoDevolucion', 'nombreCliente', 'tipoDevolucion', 'nombreProducto'];
  dataSource: MatTableDataSource<IDevoluciones>;
  displayedColumnsTiposDevoluciones: string[] = ['idTipoDevolucion', 'tipoDevolucion', 'descripcion','acciones'];
  dsTiposDevoluciones:MatTableDataSource<ITiposDevoluciones>;

  @ViewChild('MatPaginatorDevoluciones', { static: true }) paginatorDevoluciones: MatPaginator;
  @ViewChild('MatPaginatorTiposDevoluciones', { static: true }) paginatorTiposDevoluciones: MatPaginator;

  constructor(private modalService: NgbModal,public router:Router,public formBuilder: FormBuilder, public API:ApiService,matPaginatorIntl: MatPaginatorIntl,public eliminarCorrectamente: EliminarService,public jwt:LoginjwtService) {
    this.usuarioEnSesion = window.localStorage.getItem('nombreUsuario');
    this.rolUsuario = window.localStorage.getItem('tipoUsuario');
    this.myCustomPaginatorIntl = <MyCustomPaginatorIntl>matPaginatorIntl;

    //Inilzializacion
    this.titulo="";
    this.arregloDevoluciones=[];
    this.arregloClientesSelect=[];
    this.arregloTipoDevolucionSelect=[];
    this.arregloProductosSelect=[];
    this.arregloTiposDevoluciones=[];


    //INICIALIZACION (CONSTRUCCION) DEL FORMGROUP, SOLO SE AGREGARAN ESTOS DATOS YA QUE SON LOS ESPECIFICADOS EN EL MODAL
    this.frmDevoluciones= this.formBuilder.group({
      idDevolucion:[""],
      montoDevolucion:["",Validators.required],
      motivoDevolucion:["",Validators.required],
      idCliente:["",Validators.required],
      idTipoDevolucion:["",Validators.required],
      idProducto:["",Validators.required]
    });

    this.frmTiposDevoluciones= this.formBuilder.group({
      idTipoDevolucion:[""],
      tipoDevolucion:["",Validators.required],
      descripcion:["",Validators.required]
    });

  }


  //Abrir modal Devoluciones
  public openAgregar(content) {
    this.modal= this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.listarTiposDevolucionesSelect();
  }

  //listar devoluciones
  public  listarDevoluciones(){
    this.API.listarDevoluciones().subscribe(
      (success:any)=>{
        console.log("Exito"+JSON.stringify(success));
        this.dataSource = new MatTableDataSource(this.arregloDevoluciones=success.respuesta);

        this.dataSource.paginator = this.paginatorDevoluciones;
      },
      (error)=>{
        console.log("Lo sentimos"+error);
      }
    );
  }

  public agregarDevolucion(){
    //DATOS PROVENIENTES DEL FORMGROUP
    let montoDevolucionForm = this.frmDevoluciones.get('montoDevolucion').value;
    let motivoDevolucionForm = this.frmDevoluciones.get('motivoDevolucion').value;
    let idClienteForm = this.frmDevoluciones.get('idCliente').value;
    let idTipoDevolucionForm = this.frmDevoluciones.get('idTipoDevolucion').value;
    let idProductoForm = this.frmDevoluciones.get('idProducto').value;
    //SE AGREGAN REGISTROS MEDIANTE POST
    this.API.agregarDevolucion(montoDevolucionForm,motivoDevolucionForm,idClienteForm,idTipoDevolucionForm,idProductoForm).subscribe(
      (success:any)=>{
        console.log("Exito"+success);
        this.listarDevoluciones();
      },
      (error)=>{
        console.log("Error"+ error);
      }
    );
    this.modal.close();
  }


  //listar el select de clientes
  public listarClientes(){
    this.API.listarClientes().subscribe(
      (success:any)=>{
        return this.arregloClientesSelect = success.respuesta;
      },
      (error)=>{
        console.log("Error", error)
      }
    );
  }

  //listar el select de tipo de devoluciones
  public listarTiposDevolucionesSelect(){
    this.API.listarTiposDevoluciones().subscribe(
      (success:any)=>{
        return this.arregloTipoDevolucionSelect = success.respuesta;
      },
      (error)=>{
        console.log("Error", error)
      }
    );
  }

  //listar el select de productos
  public listarProductos(){
    this.API.listarProductos().subscribe(
      (success:any)=>{
        return this.arregloProductosSelect = success.respuesta;
      },
      (error)=>{
        console.log("Error", error)
      }
    );
  }

  //Abrir modal Tipo De Devoluciones
  public openAgregarTiposDevoluciones(contentTiposDevoluciones) {
    this.modal= this.modalService.open(contentTiposDevoluciones, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo="Agregar Tipo De Devolución"
  }

  public openEditarTiposDevoluciones(contentTiposDevoluciones, idTipoDevolucion: number, tipoDevolucion: string, descripcion:string){
    this.modal= this.modalService.open(contentTiposDevoluciones,{ariaLabelledBy:'modal-basic-title'});
    this.titulo = "Editar Tipo De Devolución";

    this.frmTiposDevoluciones.controls['idTipoDevolucion'].setValue(idTipoDevolucion);
    this.frmTiposDevoluciones.controls['tipoDevolucion'].setValue(tipoDevolucion);
    this.frmTiposDevoluciones.controls['descripcion'].setValue(descripcion);
  }

  public ejecutarPeticionTiposDevoluciones(){
    let tipoDevolucionForm = this.frmTiposDevoluciones.get('tipoDevolucion').value;
    let descripcionForm = this.frmTiposDevoluciones.get('descripcion').value;
    if (this.titulo == "Agregar Tipo De Devolución") {

      this.API.agregarTipoDevolucion(tipoDevolucionForm, descripcionForm).subscribe(
        (success: any)=>{
          console.log("exito: "+ JSON.stringify(success));
          this.listarTiposDevoluciones();
        },
        (error)=>{
          console.log("Lo siento: "+error);
        }
      );
      this.modal.close();
    }
    if (this.titulo == "Editar Tipo De Devolución") {
      //OBTENEMOS LOS VALORES DEL FORMULARIO
      let idTipoDevolucion = this.frmTiposDevoluciones.get('idTipoDevolucion').value;
      let tipoDevolucionForm = this.frmTiposDevoluciones.get('tipoDevolucion').value;
      let descripcionForm = this.frmTiposDevoluciones.get('descripcion').value;

      //EJECUTANDO PETICION PUT
      this.API.editarTipoDevolucion(idTipoDevolucion,tipoDevolucionForm,descripcionForm).subscribe(
        (success: any)=>{
          console.log("Registro editado: "+success);
          this.listarTiposDevoluciones();
        },
        (error)=>{
          console.log("Lo siento: "+error);
        }
      );
      this.modal.close();
    }
  }

  public eliminarTipoDevolucion(idTipoDevolucion:number){
    let resultado:boolean=false;
    resultado = this.eliminarCorrectamente.confirmarEliminacion();
    if (resultado==true) {
      this.API.eliminarTipoDevolucion(idTipoDevolucion).subscribe(
        (success:any)=>{
          console.log("Exito"+success);
          this.listarTiposDevoluciones();
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

  //listar tipos de devoluciones
  public  listarTiposDevoluciones(){
    this.API.listarTiposDevoluciones().subscribe(
      (success:any)=>{
        console.log("Exito"+JSON.stringify(success));
        this.arregloTiposDevoluciones=success.respuesta;
        this.dsTiposDevoluciones = new MatTableDataSource(this.arregloTiposDevoluciones);

        this.dsTiposDevoluciones.paginator = this.paginatorTiposDevoluciones;
      },
      (error)=>{
        console.log("Lo sentimos"+error);
      }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dsTiposDevoluciones.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    if (this.dsTiposDevoluciones.paginator) {
      this.dsTiposDevoluciones.paginator.firstPage();

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
    this.listarDevoluciones();
    this.listarClientes();
    this.listarTiposDevolucionesSelect();
    this.listarProductos();
    this.listarTiposDevoluciones();
  }
}
