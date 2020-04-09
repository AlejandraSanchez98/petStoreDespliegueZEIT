import { Component, OnInit,ViewChild } from '@angular/core';
import {MatPaginator,MatPaginatorIntl} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {ApiService} from '../api.service';
import { IVentas } from '../api.service';
import { ICompras } from '../api.service';
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
  selector: 'app-transacciones',
  templateUrl: './transacciones.component.html',
  styleUrls: ['./transacciones.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useValue: new MyCustomPaginatorIntl() }]

})
export class TransaccionesComponent implements OnInit {
  myCustomPaginatorIntl: MyCustomPaginatorIntl;
  public arregloTransaccionesVentas:IVentas[];
  public arregloTransaccionesCompras:ICompras[];
  //public arregloVentasDetalles:any[] = [];
  //public arregloComprasDetalles:any[] = [];
  public arregloComprasDetalles:any[];
  public arregloVentasDetalles:any[];

  public modal: NgbModalRef;
  public titulo:string;
  public usuarioEnSesion:string;
  public rolUsuario:string;



  displayedColumns: string[] = ['idVenta','montoConIVA','cantidadTotalProductos','fechaRegistro','nombreUsuario','nombreCliente','acciones'];
  dataSource:MatTableDataSource<IVentas>;

  displayedColumnsVentasDetalles: string[] = ['idVenta', 'montoSinIVA','IVA','montoConIVA','cantidadTotalProductos','pago','cambio','fechaRegistro','nombreProducto','nombreUsuario','nombreCliente','tipoPago'];
  dsVentasDetalles:MatTableDataSource<IVentas>;

  displayedColumnsCompras: string[] = ['idCompra', 'montoTotal','fechaRegistro','nombreProveedor','nombreUsuario','acciones'];
  dsCompras:MatTableDataSource<ICompras>;

  displayedColumnsComprasDetalles: string[] = ['idCompra','montoTotal','fechaRegistro','nombreProveedor','nombreUsuario','nombreProducto','cantidadProducto'];
  dsComprasDetalles:MatTableDataSource<ICompras>;

  @ViewChild('MatPaginatorVentas', {static: true}) paginatorVentas: MatPaginator;
  @ViewChild('MatPaginatorCompras', {static: true}) paginatorCompras: MatPaginator;

  constructor(public API:ApiService,matPaginatorIntl: MatPaginatorIntl,private modalService: NgbModal,public router:Router,public jwt:LoginjwtService) {
    this.usuarioEnSesion = window.localStorage.getItem('nombreUsuario');
    this.rolUsuario = window.localStorage.getItem('tipoUsuario');
    this.myCustomPaginatorIntl = <MyCustomPaginatorIntl>matPaginatorIntl;

    this.arregloTransaccionesVentas=[];
    this.arregloTransaccionesCompras=[];
    this.arregloComprasDetalles=[];
    this.arregloVentasDetalles=[];
  }



  //Abrir Modal Mostrar Más Información Ventas
  //Abrir modal
  public openVentas(contentVenta:any,idVenta:number) {
    this.modal= this.modalService.open(contentVenta,  {ariaLabelledBy: 'modal-basic-title',scrollable: true });
    this.listarVentasDetalles(idVenta);

  }

  //listar ventas
  public listarVentasSinDetalles (){
    this.API.listarVentasSinDetalles().subscribe(
      (success:any)=>{
        console.log("Exito"+JSON.stringify(success));
        this.arregloTransaccionesVentas=success.respuesta;
        this.dataSource = new MatTableDataSource(this.arregloTransaccionesVentas);

        this.dataSource.paginator = this.paginatorVentas;
        this.dataSource.paginator._intl.itemsPerPageLabel = "Elementos por página";

      },
      (error)=>{
        console.log("Lo sentimos"+error);
      }
    );
  }

  //listar detalles compra
  public listarVentasDetalles(idVenta:number){
    this.API.listarVentasDetalles(idVenta).subscribe(
      (success:any)=>{
        this.arregloVentasDetalles=success.respuesta;
        let arregloProductos:any[] = [];
        let productos: string[] = [];

        for (let i = 0; i < success.respuesta.length; i++) {
          //atrapamos cada uno de los productos en un array
          arregloProductos.push(success.respuesta[i].nombreProducto);
        }
        productos = arregloProductos
        //arreglo de objetos listo para iterar
        this.arregloVentasDetalles = [{
          idVenta:success.respuesta[0].idVenta,
          montoSinIVA:success.respuesta[0].montoSinIVA,
          IVA:success.respuesta[0].IVA,
          montoConIVA:success.respuesta[0].montoConIVA,
          cantidadTotalProductos:success.respuesta[0].cantidadTotalProductos,
          pago:success.respuesta[0].pago,
          cambio:success.respuesta[0].cambio,
          fechaRegistro:success.respuesta[0].fechaRegistro,
          productos:productos,
          nombreUsuario:success.respuesta[0].nombreUsuario,
          nombreCliente:success.respuesta[0].nombreCliente,
          tipoPago:success.respuesta[0].tipoPago
        }];


        console.log("contenido arregloDetalleCompra: ",this.arregloVentasDetalles)
      },
      (error)=>{
        console.log(error);
      }
    );
  }



  //Abrir Modal Mostrar Más Información Compras
  public openCompras(content:any,idCompra:number) {
    console.log("idTransaccion",idCompra);
    this.modal= this.modalService.open(content,  {ariaLabelledBy: 'modal-basic-title',scrollable: true });
    this.listarComprasDetalles(idCompra);

  }

  //listar compras sin detalles
  public listarComprasSinDetalles (){
    this.API.listarComprasSinDetalles().subscribe(
      (success:any)=>{
        console.log("Exito"+JSON.stringify(success));
        this.arregloTransaccionesCompras=success.respuesta;
        this.dsCompras = new MatTableDataSource(this.arregloTransaccionesCompras);

        this.dsCompras.paginator = this.paginatorCompras;
        this.dsCompras.paginator._intl.itemsPerPageLabel = "Elementos por página";

      },
      (error)=>{
        console.log("Lo sentimos"+error);
      }
    );
  }


  //listar detalles compra
  public listarComprasDetalles(idCompra:number){
    this.API.listarComprasDetalles(idCompra).subscribe(
      (success:any)=>{
        this.arregloComprasDetalles=success.respuesta;
        let arregloProductos:any[] = [];
        let productos: string[] = [];

        for (let i = 0; i < success.respuesta.length; i++) {
          //atrapamos cada uno de los productos en un array
          arregloProductos.push(success.respuesta[i].nombreProducto);
        }
        productos = arregloProductos
        //arreglo de objetos listo para iterar
        this.arregloComprasDetalles = [{
          idCompra:success.respuesta[0].idCompra,
          montoTotal:success.respuesta[0].montoTotal,
          fechaRegistro:success.respuesta[0].fechaRegistro,
          nombreProveedor:success.respuesta[0].nombreProveedor,
          nombreUsuario:success.respuesta[0].nombreUsuario,
          productos:productos,
          cantidadProducto:success.respuesta[0].cantidadProducto,
        }];


        console.log("contenido arregloDetalleCompra: ",this.arregloComprasDetalles)
      },
      (error)=>{
        console.log(error);
      }
    );
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dsCompras.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    if ( this.dsCompras.paginator){
      this.dsCompras.paginator.firstPage();
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
    this.listarVentasSinDetalles();
    this.listarComprasSinDetalles();
  }

}
