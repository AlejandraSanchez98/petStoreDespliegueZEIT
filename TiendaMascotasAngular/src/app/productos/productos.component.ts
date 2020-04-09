import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator,MatPaginatorIntl} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import {ApiService} from '../api.service';
import { IProductos } from '../api.service';
import { ICategoria } from '../api.service';
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
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useValue: new MyCustomPaginatorIntl() }]

})
export class ProductosComponent implements OnInit {
  myCustomPaginatorIntl: MyCustomPaginatorIntl;
  public arregloProductos:IProductos[];
  public arregloProductosSelect:IProductos[];
  public arregloCategorias:ICategoria[];


  public modal: NgbModalRef;
  public frmProductos:FormGroup;
  public frmCategorias:FormGroup;
  public formValid:Boolean=false;
  public titulo:string;
  public usuarioEnSesion:string;
  public rolUsuario:string;



  displayedColumns: string[] = ['idProducto', 'nombreProducto', 'precioUnitario', 'descripcionProducto', 'stock', 'nombreCategoria','acciones'];
  dataSource: MatTableDataSource<IProductos>;

  displayedColumnsCategorias: string[] = ['idCategoria', 'nombreCategoria', 'subCategoria', 'descripcion','acciones'];
  dsCategorias:MatTableDataSource<ICategoria>;


  @ViewChild('MatPaginatorProductos', {static: true}) paginatorProductos: MatPaginator;
  @ViewChild('MatPaginatorCategoria', {static: true}) paginatorCategoria: MatPaginator;


  constructor(private modalService: NgbModal,public router:Router,public formBuilder: FormBuilder, public API:ApiService,matPaginatorIntl: MatPaginatorIntl,public eliminarCorrectamente: EliminarService,public jwt:LoginjwtService) {
    this.usuarioEnSesion = window.localStorage.getItem('nombreUsuario');
    this.rolUsuario = window.localStorage.getItem('tipoUsuario');
    this.myCustomPaginatorIntl = <MyCustomPaginatorIntl>matPaginatorIntl;
    //Inizializacion
    this.titulo="";
    this.arregloProductos=[];
    this.arregloProductosSelect=[];
    this.arregloCategorias=[];


    //INICIALIZACION (CONSTRUCCION) DEL FORMGROUP, SOLO SE AGREGARAN ESTOS DATOS YA QUE SON LOS ESPECIFICADOS EN EL MODAL
    this.frmProductos= this.formBuilder.group({
      idProducto:[""],
      nombreProducto:["",Validators.required],
      precioUnitario:["",Validators.required],
      descripcionProducto:["",Validators.required],
      stock:["",Validators.required],
      idCategoria:["",Validators.required]
    });

    this.frmCategorias= this.formBuilder.group({
      idCategoria:[""],
      nombreCategoria:["",Validators.required],
      subCategoria:["",Validators.required],
      descripcion:["",Validators.required]
    });
  }

  //Abrir modal Productos
  public openAgregar(content) {
    this.modal= this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo="Agregar Producto"
    this.listarCategoriasSelect();

  }
  //Abrir modal  Editar Producto
  public openEditar(content, idProducto: number, nombreProducto: string, precioUnitario:number, descripcionProducto:string, stock:number, idCategoria:number){
    this.modal= this.modalService.open(content,{ariaLabelledBy:'modal-basic-title'});
    this.titulo = "Editar Producto";
    this.frmProductos.controls['idProducto'].setValue(idProducto);
    this.frmProductos.controls['nombreProducto'].setValue(nombreProducto);
    this.frmProductos.controls['precioUnitario'].setValue(precioUnitario);
    this.frmProductos.controls['descripcionProducto'].setValue(descripcionProducto);
    this.frmProductos.controls['stock'].setValue(stock);
    //this.frmProductos.controls['idCategoria'].setValue(idCategoria);
    //alert("idCategoria:  " + idCategoria);
  }

  //DAR DE ALTA SEGUN LOS DATOS DEL MODAL //anteriormente se llamaba darAlta
  public ejecutarPeticion(){
    //DATOS PROVENIENTES DEL FORMGROUP
    let nombreProductoForm = this.frmProductos.get('nombreProducto').value;
    let precioUnitarioForm = this.frmProductos.get('precioUnitario').value;
    let descripcionProductoForm = this.frmProductos.get('descripcionProducto').value;
    let stockForm = this.frmProductos.get('stock').value;
    let idCategoriaForm = this.frmProductos.get('idCategoria').value;
    //EVITAMOS CREAR 2 MODALES, SIMPLEMENTE USAMOS 1 MODAL Y TIENE SU FUNCION SEGUN SU NOMBRE
    if (this.titulo == "Agregar Producto") {
      //SE AGREGAN REGISTROS MEDIANTE POST
      this.API.agregarProducto(nombreProductoForm, precioUnitarioForm, descripcionProductoForm, stockForm, idCategoriaForm ).subscribe(
        (success: any)=>{
          this.arregloProductos = success;
          console.log("exito: "+ JSON.stringify(this.arregloProductos));
          this.listarProductos();
          this.frmProductos.reset();

        },
        (error)=>{
          console.log("Lo siento: "+error);
        }
      );
      this.modal.close();
    }
    if (this.titulo == "Editar Producto") {
      //OBTENEMOS LOS VALORES DEL FORMULARIO
      let idProducto = this.frmProductos.get('idProducto').value; //recuerda que el id esta oculto asi que el user no podra editarlo
      let nombreProductoForm = this.frmProductos.get('nombreProducto').value;
      let precioUnitarioForm = this.frmProductos.get('precioUnitario').value;
      let descripcionProductoForm = this.frmProductos.get('descripcionProducto').value;
      let stockForm = this.frmProductos.get('stock').value;
      let idCategoria = this.frmProductos.get('idCategoria').value;
      //EJECUTANDO PETICION PUT
      this.API.editarProducto(idProducto,nombreProductoForm,precioUnitarioForm,descripcionProductoForm,stockForm,idCategoria).subscribe(
        (success: any)=>{
          console.log("Registro editado: "+ JSON.stringify(success));
          this.listarProductos();
        },
        (error)=>{
          console.log("Lo siento: "+error);
        }
      );
      this.modal.close();
    }
  }//----------------------fin operaciones-------------------------------------------------------------------

  //eliminar Producto
  public eliminarProducto (idProducto:number){
    let resultado: boolean = false;
    resultado = this.eliminarCorrectamente.confirmarEliminacion();
    if (resultado == true) {
      this.API.eliminarProducto(idProducto).subscribe(
        (success:any)=>{
          console.log("Exito"+success);
          this.listarProductos();
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

  //listar el select de categorias
  public listarCategoriasSelect(){
    this.API.listarCategorias().subscribe(
      (success:any)=>{
        return this.arregloProductosSelect = success.respuesta;
      },
      (error)=>{
        console.log("Error", error)
      }
    );
  }

  //listar productos
  public  listarProductos(){
    this.API.listarProductos().subscribe(
      (success:any)=>{
        console.log("Exito"+JSON.stringify(success));
        this.dataSource = new MatTableDataSource(this.arregloProductos=success.respuesta);

        this.dataSource.paginator = this.paginatorProductos;
        this.dataSource.paginator._intl.itemsPerPageLabel = "Elementos por página";

      },
      (error)=>{
        console.log("Lo sentimos"+error);
      }
    );
  }

  //Abrir modal categorias
  public openAgregarCategoria(contentCategoria) {
    this.modal= this.modalService.open(contentCategoria, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo="Agregar Categoria"
  }

  public openEditarCategoria(contentCategoria, idCategoria: number, nombreCategoria: string, subCategoria:string, descripcion:string){
    this.modal= this.modalService.open(contentCategoria,{ariaLabelledBy:'modal-basic-title'});
    this.titulo = "Editar Categoria";

    this.frmCategorias.controls['idCategoria'].setValue(idCategoria);
    this.frmCategorias.controls['nombreCategoria'].setValue(nombreCategoria);
    this.frmCategorias.controls['subCategoria'].setValue(subCategoria);
    this.frmCategorias.controls['descripcion'].setValue(descripcion);
  }

  //DAR DE ALTA SEGUN LOS DATOS DEL MODAL //anteriormente se llamaba darAlta
  public ejecutarPeticionCategoria(){
    //DATOS PROVENIENTES DEL FORMGROUP
    let nombreCategoriaForm = this.frmCategorias.get('nombreCategoria').value;
    let subCategoriaForm = this.frmCategorias.get('subCategoria').value;
    let descripcionForm = this.frmCategorias.get('descripcion').value;
    //EVITAMOS CREAR 2 MODALES, SIMPLEMENTE USAMOS 1 MODAL Y TIENE SU FUNCION SEGUN SU NOMBRE
    if (this.titulo == "Agregar Categoria") {

      //SE AGREGAN REGISTROS MEDIANTE POST
      this.API.agregarCategoria(nombreCategoriaForm, subCategoriaForm, descripcionForm).subscribe(
        (success: any)=>{
          console.log("exito: "+ JSON.stringify(success));
          this.listarCategorias();
          this.frmCategorias.reset();
        },
        (error)=>{
          console.log("Lo siento: "+error);
        }
      );
      this.modal.close();
    }
    if (this.titulo == "Editar Categoria") {
      //OBTENEMOS LOS VALORES DEL FORMULARIO
      let idCategoria = this.frmCategorias.get('idCategoria').value; //recuerda que el id esta oculto asi que el user no podra editarlo
      let nombreCategoriaForm = this.frmCategorias.get('nombreCategoria').value;
      let subCategoriaForm = this.frmCategorias.get('subCategoria').value;
      let descripcionForm = this.frmCategorias.get('descripcion').value;

      //EJECUTANDO PETICION PUT
      this.API.editarCategoria(idCategoria,nombreCategoriaForm,subCategoriaForm,descripcionForm).subscribe(
        (success: any)=>{
          console.log("Registro editado: "+success);
          this.listarCategorias();
        },
        (error)=>{
          console.log("Lo siento: "+error);
        }
      );
      this.modal.close();
    }
  }//----------------------fin operaciones-------------------------------------------------------------------

  //eliminar categoria
  public eliminarCategoria(idCategoria:number){
    let resultado: boolean = false;
    resultado = this.eliminarCorrectamente.confirmarEliminacion();
    if (resultado == true) {
      this.API.eliminarCategoria(idCategoria).subscribe(
        (success:any)=>{
          console.log("Exito"+success);
          this.listarCategorias();
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

  //listar categorias
  public  listarCategorias(){
    this.API.listarCategorias().subscribe(
      (success:any)=>{
        console.log("Exito"+JSON.stringify(success));
        this.dsCategorias = new MatTableDataSource(this.arregloCategorias=success.respuesta);

        this.dsCategorias.paginator = this.paginatorCategoria;
        this.dsCategorias.paginator._intl.itemsPerPageLabel = "Elementos por página";

      },
      (error)=>{
        console.log("Lo sentimos"+error);
      }
    );
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
   // this.verificarRolUsuario.verificarAcceso();
    this.listarProductos();
    this.listarCategoriasSelect();
    this.listarCategorias();

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dsCategorias.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    if ( this.dsCategorias.paginator){
      this.dsCategorias.paginator.firstPage();
    }
  }
}
