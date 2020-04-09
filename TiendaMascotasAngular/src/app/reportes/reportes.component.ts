import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator,MatPaginatorIntl} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {ApiService} from '../api.service';
import { IProductosMasVendidos } from '../api.service';
import { IVendedoresMasVentas } from '../api.service';
import { IProductoStockMinimo } from '../api.service';
import { IUtilidad } from '../api.service';
import { LoginjwtService } from '../loginjwt.service';



export class MyCustomPaginatorIntl extends MatPaginatorIntl {
  itemsPerPageLabel = 'Elementos por Página';
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
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useValue: new MyCustomPaginatorIntl() }]

})
export class ReportesComponent implements OnInit {
  myCustomPaginatorIntl: MyCustomPaginatorIntl;
  public arregloProductosMasVendidos:IProductosMasVendidos[];
  public arregloVendedoresMasVentas:IVendedoresMasVentas[];
  public arregloProductoStockMinimo:IProductoStockMinimo[];
  public usuarioEnSesion:string;
  public rolUsuario:string;


  displayedColumns: string[] = ['idProducto', 'Producto','TotalVentas'];
  dataSource:MatTableDataSource<IProductosMasVendidos>;

  dcVendedoresMasVentas = ['idUsuario','Vendedor','ImporteVenta'];
  dsVendedoresMasVentas:MatTableDataSource<IVendedoresMasVentas>;

  dcProductoStockMinimo = ['idProducto','nombreProducto','precioUnitario', 'descripcionProducto', 'stock'];
  dsProductoStockMinimo:MatTableDataSource<IProductoStockMinimo>;

  dcUtilidad = ['MontoTotalVentas','MontoTotalCompras','Utilidad'];
  dsUtilidad:MatTableDataSource<IUtilidad>;

  @ViewChild('MatPaginatorProductosStockMinimo', {static: true}) paginatorProductosStockMinimo: MatPaginator;
  @ViewChild('MatPaginatorUtilidad', {static: true}) paginatorUtilidad: MatPaginator;


  constructor(public API:ApiService,public router:Router, matPaginatorIntl: MatPaginatorIntl,public jwt:LoginjwtService) {
    this.usuarioEnSesion = window.localStorage.getItem('nombreUsuario');
    this.rolUsuario = window.localStorage.getItem('tipoUsuario');
    this.myCustomPaginatorIntl = <MyCustomPaginatorIntl>matPaginatorIntl;
    this.arregloProductosMasVendidos=[];
    this.arregloVendedoresMasVentas=[];
    this.arregloProductoStockMinimo=[];
  }

  //listar productosMasVendidos
  public  productosMasVendidos(){
    this.API.productosMasVendidos().subscribe(
      (success:any)=>{
        console.log("Exito"+JSON.stringify(success));
        this.arregloProductosMasVendidos=success.respuesta;
        this.dataSource = new MatTableDataSource(this.arregloProductosMasVendidos);
      },
      (error)=>{
        console.log("Lo sentimos"+error);
      }
    );
  }

  //listar vendedoresMasVentas
  public  vendedoresMasVentas(){
    this.API.vendedoresMasVentas().subscribe(
      (success:any)=>{
        console.log("Exito"+JSON.stringify(success));
        this.arregloVendedoresMasVentas=success.respuesta;
        this.dsVendedoresMasVentas = new MatTableDataSource(this.arregloVendedoresMasVentas);

      },
      (error)=>{
        console.log("Lo sentimos"+error);
      }
    );
  }

  //listar productoStockMinimo
  public  productoStockMinimo(){
    this.API.productoStockMinimo().subscribe(
      (success:any)=>{
        console.log("Exito"+JSON.stringify(success));
        this.arregloProductoStockMinimo=success.respuesta;
        this.dsProductoStockMinimo = new MatTableDataSource(this.arregloProductoStockMinimo);

        this.dsProductoStockMinimo.paginator = this.paginatorProductosStockMinimo;
        this.dsProductoStockMinimo.paginator._intl.itemsPerPageLabel = "Elementos por página";


      },
      (error)=>{
        console.log("Lo sentimos"+error);
      }
    );
  }


  //listar utilidad
  public utilidad(){
    this.API.utilidad().subscribe(
      (success:any)=>{
        //alert("Exito"+success);
        let ventas = success.respuesta[0][0].MontoTotalVentas;
        let compras = success.respuesta[1][0].MontoTotalCompras;
        let utilidad = success.respuesta[2][0].Utilidad;

        let arregloUtilidad:IUtilidad[]= [{MontoTotalVentas:ventas, MontoTotalCompras:compras, Utilidad:utilidad}];
        this.dsUtilidad = new MatTableDataSource(arregloUtilidad);
        this.dsUtilidad.paginator = this.paginatorUtilidad;
        this.dsUtilidad.paginator._intl.itemsPerPageLabel = "Elementos por página";



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
    //this.verificarRolUsuario.verificarAcceso();
    this.productosMasVendidos();
    this.vendedoresMasVentas();
    this.productoStockMinimo();
    this.utilidad();
  }
}
