import { Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator,MatPaginatorIntl} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import {ApiService} from '../api.service';
import { IMetodosPago } from '../api.service';
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
  selector: 'app-metodo-pago',
  templateUrl: './metodo-pago.component.html',
  styleUrls: ['./metodo-pago.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useValue: new MyCustomPaginatorIntl() }]
})
export class MetodoPagoComponent implements OnInit {
  myCustomPaginatorIntl: MyCustomPaginatorIntl;
  public arregloMetodosPago:IMetodosPago[];
  public modal: NgbModalRef;

  public frmMetodosPago:FormGroup;
  public formValid:Boolean=false;
  public titulo:string;
  public usuarioEnSesion:string;
  public rolUsuario:string;


  displayedColumns: string[] = ['idMetodoPago', 'tipoPago','acciones'];
  dataSource:MatTableDataSource<IMetodosPago>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  constructor(private modalService: NgbModal,public router:Router,public formBuilder: FormBuilder, public API:ApiService,matPaginatorIntl: MatPaginatorIntl,public eliminarCorrectamente: EliminarService,public verificarRolUsuario:LoginjwtService,public jwt:LoginjwtService) {
    this.usuarioEnSesion = window.localStorage.getItem('nombreUsuario');
    this.rolUsuario = window.localStorage.getItem('tipoUsuario');
    this.myCustomPaginatorIntl = <MyCustomPaginatorIntl>matPaginatorIntl;
    //Inizializacion
    this.titulo="";
    this.arregloMetodosPago=[];
    //INICIALIZACION (CONSTRUCCION) DEL FORMGROUP, SOLO SE AGREGARAN ESTOS DATOS YA QUE SON LOS ESPECIFICADOS EN EL MODAL
    this.frmMetodosPago= this.formBuilder.group({
      idMetodoPago:[""],
      tipoPago:["",Validators.required]
    });
  }


  //Abrir modal
  public openAgregar(content) {
    this.modal= this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo="Agregar Método De Pago"
  }

  public openEditar(content, idMetodoPago: number, tipoPago: string){
    this.modal= this.modalService.open(content,{ariaLabelledBy:'modal-basic-title'});
    this.titulo = "Editar Método De Pago";

    this.frmMetodosPago.controls['idMetodoPago'].setValue(idMetodoPago);
    this.frmMetodosPago.controls['tipoPago'].setValue(tipoPago);
  }

  //DAR DE ALTA SEGUN LOS DATOS DEL MODAL
  public ejecutarPeticion(){
    //DATOS PROVENIENTES DEL FORMGROUP
    let tipoPagoForm = this.frmMetodosPago.get('tipoPago').value;
    //EVITAMOS CREAR 2 MODALES, SIMPLEMENTE USAMOS 1 MODAL Y TIENE SU FUNCION SEGUN SU NOMBRE
    if (this.titulo == "Agregar Método De Pago") {

      //SE AGREGAN REGISTROS MEDIANTE POST
      this.API.agregarMetodoPago(tipoPagoForm).subscribe(
        (success: any)=>{
          console.log("exito: "+ JSON.stringify(success));
          this.listarMetodosPago();
          this.frmMetodosPago.reset();
        },
        (error)=>{
          console.log("Lo siento: "+error);
        }
      );
      this.modal.close();
    }
    if (this.titulo == "Editar Método De Pago") {
      //OBTENEMOS LOS VALORES DEL FORMULARIO
      let idMetodoPago = this.frmMetodosPago.get('idMetodoPago').value; //recuerda que el id esta oculto asi que el user no podra editarlo
      let tipoPagoForm = this.frmMetodosPago.get('tipoPago').value;

      //EJECUTANDO PETICION PUT
      this.API.editarMetodoPago(idMetodoPago,tipoPagoForm).subscribe(
        (success: any)=>{
          console.log("Registro editado: "+success);
          this.listarMetodosPago();
        },
        (error)=>{
          console.log("Lo siento: "+error);
        }
      );
      this.modal.close();
    }
  }

  //eliminar metodo de pago
  public eliminarMetodoPago(idMetodoPago:number){
    let resultado: boolean = false;
    resultado = this.eliminarCorrectamente.confirmarEliminacion();
    if (resultado == true) {
      this.API.eliminarMetodoPago(idMetodoPago).subscribe(
        (success:any)=>{
          console.log("Exito"+success);
          this.listarMetodosPago();
        },
        (error)=>{
          console.log("Error"+ error);
        }
      );
    }
    else{
      console.log("Eliminación cancelada");
    }
  }

  //listar metodos de pago
  public  listarMetodosPago(){
    this.API.listarMetodosPago().subscribe(
      (success:any)=>{
        console.log("Exito"+JSON.stringify(success));
        this.arregloMetodosPago=success.respuesta;
        this.dataSource = new MatTableDataSource(this.arregloMetodosPago);

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
    this.verificarRolUsuario.verificarAcceso();
    this.listarMetodosPago();
  }

}
