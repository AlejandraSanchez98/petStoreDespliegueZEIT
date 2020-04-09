import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface ICategoria {
  idCategoria: number;
  nombreCategoria: string;
  subCategoria: string;
  descripcion: string;
}

export interface IClientes {
  idCliente: number;
  nombreCliente: string;
  direccionCliente: string;
  ciudadCliente: string;
  telefonoCliente: string;
  emailCliente: string;
  passwordCliente:string;
}

export interface IMetodosPago {
  idMetodoPago: number;
  tipoPago: string;
}

export interface IProductos{
  idProducto: number;
  nombreProducto: string;
  precioUnitario: number;
  descripcionProducto: string;
  stock: number;
  idCategoria:number;
}

export interface IProveedores {
  idProveedor: string;
  nombreProveedor: string;
  direccionProveedor: string;
  telefonoProveedor: string;
  ciudadProveedor: string;
  emailProveedor: string;
  RFCProveedor: string;
  razonSocial: string;
}


export interface IProductosMasVendidos {
  idProducto: number;
  Producto: string;
  TotalVentas:number;
}

export interface IVendedoresMasVentas {
  idUsuario: number;
  Vendedor: string;
  ImporteVenta:number;
}

export interface IProductoStockMinimo {
  idProducto: number;
  nombreProducto: string;
  precioUnitario:number;
  descripcionProducto:string;
  stock:number;
}

export interface IUtilidad {
  MontoTotalVentas: number;
  MontoTotalCompras: number;
  Utilidad:number;
}

export interface ITiposDevoluciones{
  idTipoDevolucion: number;
  tipoDevolucion: string;
  descripcion: string;
}

export interface IUsuarios {
  idUsuario: number;
  nombreUsuario: string;
  telefonoUsuario:string;
  direccionUsuario:string;
  correo:string;
  passwordUsuario:string;
  tipoUsuario:string;
}

export interface IViaEnvios {
  idViaEnvio: number;
  medioEnvio: string;
  descripcion: string;
}

export interface IDevoluciones{
  idDevolucion: number;
  montoDevolucion:number;
  motivoDevolucion:string;
  idCliente: number;
  idTipoDevolucion:number;
  idProducto:number;
}

export interface IVentas{
  idVenta:number;
  montoSinIVA:number;
  IVA:number;
  montoConIVA:number;
  cantidadTotalProductos:number;
  pago:number;
  cambio:number;
  fechaRegistro:string;
  nombreProducto:string;
  nombreUsuario:string;
  nombreCliente:string;
  tipoPago:string;
}

export interface ICompras{
  idCompra: number;
  cantidadProducto:number;
}

export interface IEnvios{
  idEnvio:number;
  direccion:string;
  ciudad:string;
  observaciones:string;
  idVenta:number;
  medioEnvio:string;
}

export interface IProductosCompras{
  idProducto: number;
  cantidadProducto: number;
  nombreProducto:string;
  precioUnitario:string;
}

export interface IComprasProveedor{
  idCompra:number;
  fechaRegistro:string;
  cantidadProducto:number;
}


export interface IVentasCarrito{
  idVenta:number;
  fechaRegistro:string;
  cantidadTotalProductos:number;
}

export interface IProductosCarrito{
  idProducto:number;
  cantidadProductos:number;
  nombreProducto:string;
  precioUnitario:number;
}


export interface IMetodosPagoCarrito{
  idMetodoPago:number;
}

export interface  IAccesos{
  idAcceso:number;
  accion:string;
  idUsuario:number;
}



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  //CABECERAS
  public headers:any;

  constructor(public http:HttpClient) {
    console.log(localStorage.getItem('token'));
    this.headers= new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token'), //token almacenado en LS
      'Content-Type': 'application/json',//tipo de contenido JSON
      'Accept': 'application/json' //acepta el cuerpo de la peticion JSON
    });
  }

  // METODOS QUE CONTIENEN LOS DIFERENTES TIPOS DE PETICIONES DEL MODULO DE CATEGORIA
  public listarCategorias(){
    return this.http.get('http://localhost:3000/categoria/listarCategorias',{headers:this.headers});
  }

  public agregarCategoria(nombreCategoria: string, subCategoria:string, descripcion: string){
    return this.http.post('http://localhost:3000/categoria/agregarCategoria',{nombreCategoria,subCategoria,descripcion},{headers:this.headers});
  }

  public editarCategoria(idCategoria:number,nombreCategoria: string, subCategoria:string, descripcion: string){
    return this.http.put('http://localhost:3000/categoria/modificarCategoria/'+idCategoria,{nombreCategoria,subCategoria,descripcion},{headers:this.headers});
  }

  public eliminarCategoria(idCategoria:number){
    return this.http.delete('http://localhost:3000/categoria/eliminarCategoria/'+idCategoria,{headers:this.headers});
  }



  // METODOS QUE CONTIENEN LOS DIFERENTES TIPOS DE PETICIONES DEL MODULO DE CLIENTES
  public listarClientes(){
    return this.http.get('http://localhost:3000/clientes/listarClientes',{headers:this.headers});
  }

  public agregarCliente(nombreCliente: string, direccionCliente:string, ciudadCliente:string, telefonoCliente: string, emailCliente:string, passwordCliente:string ){
    return this.http.post('http://localhost:3000/clientes/agregarCliente',{ nombreCliente,direccionCliente,ciudadCliente,telefonoCliente,emailCliente,passwordCliente},{headers:this.headers});
  }

  public editarCliente(idCliente:number, nombreCliente: string, direccionCliente:string, ciudadCliente:string, telefonoCliente: string, emailCliente:string, passwordCliente:string){
    return this.http.put('http://localhost:3000/clientes/modificarCliente/'+idCliente,{nombreCliente,direccionCliente,ciudadCliente,telefonoCliente,emailCliente,passwordCliente},{headers:this.headers});
  }

  public eliminarCliente(idCliente:number){
    return this.http.delete('http://localhost:3000/clientes/eliminarCliente/'+idCliente,{headers:this.headers});
  }



  // METODOS QUE CONTIENEN LOS DIFERENTES TIPOS DE PETICIONES DEL MODULO DE PROVEEDORES
  public listarProveedores(){
    return this.http.get('http://localhost:3000/proveedores/listarProveedores',{headers:this.headers});
  }

  public agregarProveedor(nombreProveedor:string, direccionProveedor:string, telefonoProveedor:string, ciudadProveedor:string, emailProveedor:string, RFCProveedor:string, razonSocial:string){
    return this.http.post('http://localhost:3000/proveedores/agregarProveedor',{nombreProveedor,direccionProveedor,telefonoProveedor,ciudadProveedor,emailProveedor,RFCProveedor,razonSocial},{headers:this.headers});
  }

  public editarProveedor(idProveedor:number, nombreProveedor:string, direccionProveedor:string, telefonoProveedor:string, ciudadProveedor:string, emailProveedor:string, RFCProveedor:string, razonSocial:string){
    return this.http.put('http://localhost:3000/proveedores/modificarProveedor/'+ idProveedor,{nombreProveedor,direccionProveedor,telefonoProveedor,ciudadProveedor,emailProveedor,RFCProveedor,razonSocial}, {headers:this.headers});
  }

  public eliminarProveedor(idProveedor:number){
    return this.http.delete('http://localhost:3000/proveedores/eliminarProveedor/'+idProveedor,{headers:this.headers});
  }



  // METODOS QUE CONTIENEN LOS DIFERENTES TIPOS DE PETICIONES DEL MODULO DE PRODUCTOS
  public listarProductos(){
    return this.http.get('http://localhost:3000/productos/listarProductos',{headers:this.headers});
  }

  public agregarProducto(nombreProducto:string, precioUnitario:number, descripcionProducto:string, stock:number, idCategoria:number){
    return this.http.post('http://localhost:3000/productos/agregarProducto',{nombreProducto,precioUnitario,descripcionProducto,stock,idCategoria},{headers:this.headers});
  }

  public editarProducto(idProducto:number, nombreProducto:string, precioUnitario:number, descripcionProducto:string, stock:number, idCategoria:number){
    return this.http.put('http://localhost:3000/productos/modificarProducto/'+ idProducto,{nombreProducto,precioUnitario,descripcionProducto,stock,idCategoria}, {headers:this.headers});
  }

  public eliminarProducto(idProducto:number){
    return this.http.delete('http://localhost:3000/productos/eliminarProducto/'+idProducto,{headers:this.headers});
  }



  // METODOS QUE CONTIENEN LOS DIFERENTES TIPOS DE PETICIONES DEL MODULO DE VIAENVIO
  public listarMediosEnvios(){
    return this.http.get('http://localhost:3000/viaEnvios/listarMediosEnvios',{headers:this.headers});
  }

  public agregarMedioEnvio(medioEnvio:string, descripcion:string){
    return this.http.post('http://localhost:3000/viaEnvios/agregarMedioEnvio',{medioEnvio,descripcion},{headers:this.headers});
  }

  public editarMedioEnvio(idViaEnvio:number, medioEnvio:string, descripcion:string){
    return this.http.put('http://localhost:3000/viaEnvios/modificarMedioEnvio/'+ idViaEnvio,{medioEnvio,descripcion}, {headers:this.headers});
  }

  public eliminarMedioEnvio(idViaEnvio:number){
    return this.http.delete('http://localhost:3000/viaEnvios/eliminarMedioEnvio/'+idViaEnvio,{headers:this.headers});
  }


  // METODOS QUE CONTIENEN LOS DIFERENTES TIPOS DE PETICIONES DEL MODULO DE VIAENVIO
  public listarMetodosPago(){
    return this.http.get('http://localhost:3000/metodoPago/listarMetodosPago',{headers:this.headers});
  }

  public listarMetodosPagoPorID(idMetodoPago:number) {
  return this.http.get('http://localhost:3000/metodoPago/listarMetodosPagoPorID/'+idMetodoPago, { headers: this.headers });
}


  public agregarMetodoPago(tipoPago:string){
    return this.http.post('http://localhost:3000/metodoPago/agregarMetodoPago',{tipoPago},{headers:this.headers});
  }

  public editarMetodoPago(idMetodoPago:number, tipoPago:string ){
    return this.http.put('http://localhost:3000/metodoPago/modificarMetodoPago/'+ idMetodoPago,{tipoPago}, {headers:this.headers});
  }

  public eliminarMetodoPago(idMetodoPago:number){
    return this.http.delete('http://localhost:3000/metodoPago/eliminarMetodoPago/'+idMetodoPago,{headers:this.headers});
  }


  // METODOS QUE CONTIENEN LOS DIFERENTES TIPOS DE PETICIONES DEL MODULO DE USUARIOS
  public listarUsuarios(){
    return this.http.get('http://localhost:3000/usuarios/listarUsuarios',{headers:this.headers});
  }

  public listarUsuariosPornombre(nombreUsuario:string){
    return this.http.post('http://localhost:3000/usuarios/listarUsuariosPornombre/',{nombreUsuario},{headers:this.headers});
  }

  public agregarUsuario(nombreUsuario:string, telefonoUsuario:string, direccionUsuario:string, correo:string, passwordUsuario:string, tipoUsuario:string){
    return this.http.post('http://localhost:3000/usuarios/agregarUsuario',{nombreUsuario, telefonoUsuario, direccionUsuario, correo, passwordUsuario, tipoUsuario},{headers:this.headers});
  }

  public editarUsuario(idUsuario:number, nombreUsuario:string, telefonoUsuario:string, direccionUsuario:string, correo:string, passwordUsuario:string, tipoUsuario:string){
    return this.http.put('http://localhost:3000/usuarios/modificarUsuario/'+ idUsuario,{nombreUsuario, telefonoUsuario, direccionUsuario, correo, passwordUsuario,tipoUsuario}, {headers:this.headers});
  }

  public eliminarUsuario(idUsuario:number){
    return this.http.delete('http://localhost:3000/usuarios/eliminarUsuario/'+idUsuario,{headers:this.headers});
  }


  // METODOS QUE CONTIENEN LOS DIFERENTES TIPOS DE PETICIONES DEL MODULO DE TIPOS DE DEVOLUCION
  public listarTiposDevoluciones(){
    return this.http.get('http://localhost:3000/tipoDevolucion/listarTiposDevoluciones',{headers:this.headers});
  }

  public agregarTipoDevolucion(tipoDevolucion:string, descripcion:string){
    return this.http.post('http://localhost:3000/tipoDevolucion/agregarTipoDevolucion',{tipoDevolucion, descripcion},{headers:this.headers});
  }

  public editarTipoDevolucion(idTipoDevolucion:number, tipoDevolucion:string, descripcion:string){
    return this.http.put('http://localhost:3000/tipoDevolucion/modificarTipoDevolucion/'+ idTipoDevolucion,{tipoDevolucion,descripcion}, {headers:this.headers});
  }

  public eliminarTipoDevolucion(idTipoDevolucion:number){
    return this.http.delete('http://localhost:3000/tipoDevolucion/eliminarTipoDevolucion/'+idTipoDevolucion,{headers:this.headers});
  }


  //PETICIÓN PARA OBTENER LOS PRODUCTOS MÁS VENDIDOS
  public productosMasVendidos(){
    return this.http.get('http://localhost:3000/productosMasVendidos/productosMasVendidos',{headers:this.headers});
  }


  //PETICIÓN PARA OBTENER LOS VENDEDORES CON MÁS VENTAS
  public vendedoresMasVentas(){
    return this.http.get('http://localhost:3000/vendedoresMasVentas/vendedoresMasVentas',{headers:this.headers});
  }


  //PETICIÓN PARA OBTENER LOS VENDEDORES CON MÁS VENTAS
  public productoStockMinimo(){
    return this.http.get('http://localhost:3000/productoStockMinimo/productoStockMinimo',{headers:this.headers});
  }


  //PETICIÓN PARA OBTENER LA UTILIDAD
  public utilidad(){
    return this.http.get('http://localhost:3000/utilidad/calcularUtilidad',{headers:this.headers});
  }


  // METODOS QUE CONTIENEN LOS DIFERENTES TIPOS DE PETICIONES DEL MODULO DE DEVOLUCIONES
  public listarDevoluciones(){
    return this.http.get('http://localhost:3000/devoluciones/listarDevoluciones',{headers:this.headers});
  }

  public agregarDevolucion(montoDevolucion:number, motivoDevolucion:string, idCliente:number, idTipoDevolucion:number,idProducto:number){
    return this.http.post('http://localhost:3000/devoluciones/agregarDevolucion',{montoDevolucion, motivoDevolucion,idCliente,idTipoDevolucion,idProducto},{headers:this.headers});
  }


  // METODOS QUE CONTIENEN LA PETICIÓN PARA LISTAR LAS VENTAS
  public listarVentas(){
    return this.http.get('http://localhost:3000/ventas/listarVentas',{headers:this.headers});
  }

  public listarVentasDetalles(idCompra:number){
    return this.http.get('http://localhost:3000/ventas/listarVentasDetalles/'+ idCompra,{headers:this.headers});
  }
  public listarVentasSinDetalles(){
    return this.http.get('http://localhost:3000/ventas/listarVentasSinDetalles',{headers:this.headers});
  }

  public agregarVenta(idCliente:number,idUsuario:number, pago:number, productos:IProductosCarrito[], metodoPago:IMetodosPagoCarrito[]){
    console.log("en el servicio: ", idCliente,"\n", idUsuario,"\n", pago,"\n", productos,"\n", metodoPago)
    return this.http.post('http://localhost:3000/ventas/agregarVenta',{idCliente, idUsuario, pago, productos, metodoPago},{headers:this.headers});
  }



  // METODOS QUE CONTIENEN LA PETICIÓN PARA LISTAR LAS COMPRAS
  public listarCompras(){
    return this.http.get('http://localhost:3000/compras/listarCompras',{headers:this.headers});
  }
  public listarComprasDetalles(idCompra:number){
    return this.http.get('http://localhost:3000/compras/listarComprasDetalles/'+ idCompra,{headers:this.headers});
  }
  public listarComprasSinDetalles(){
    return this.http.get('http://localhost:3000/compras/listarComprasSinDetalles',{headers:this.headers});
  }
  public agregarCompra(montoTotal:number, idProveedor:number, idUsuario:number, productos:IProductosCompras[]){
    return this.http.post('http://localhost:3000/compras/agregarCompra',{montoTotal, idProveedor, idUsuario, productos},{headers:this.headers});
  }


  // METODOS QUE CONTIENEN LOS DIFERENTES TIPOS DE PETICIONES DEL MODULO DE ENVIOS
  public listarEnvios(){
    return this.http.get('http://localhost:3000/envios/listarEnvios',{headers:this.headers});
  }

  public agregarEnvio(direccion:string, ciudad:string, observaciones:string, idVenta:number,idViaEnvio:number){
    return this.http.post('http://localhost:3000/envios/agregarEnvio',{direccion, ciudad,observaciones,idVenta,idViaEnvio},{headers:this.headers});
  }


  // METODOS QUE CONTIENEN LOS DIFERENTES TIPOS DE PETICIONES DEL MODULO DE Bitacora de accesos
  public listarAccesos(){
    return this.http.get('http://localhost:3000/accesos/listarAccesos',{headers:this.headers});
  }










}
