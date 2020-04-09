import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import {Router} from '@angular/router';
import {ApiService, IUsuarios, IProveedores} from '../api.service';
import { IProductosCompras } from '../api.service';
import { IComprasProveedor } from '../api.service';
import { LoginjwtService } from '../loginjwt.service';



@Component({
  selector: 'app-compras-proveedor',
  templateUrl: './compras-proveedor.component.html',
  styleUrls: ['./compras-proveedor.component.scss']
})
export class ComprasProveedorComponent implements OnInit {
  displayedColumns: string[] = ['idCompra', 'fechaRegistro', 'cantidadProducto'];
  displayedColumnsProductos: string[] = ['nombreProducto','precioUnitario','cantidadProducto','acciones'];
  public dsCompras:MatTableDataSource<IComprasProveedor>;
  public dsProductos:MatTableDataSource<IProductosCompras>;
  public frmCompras: FormGroup;
  public arregloProductosSelect: IProductosCompras[] = [];
  public arregloProductos: IProductosCompras[] = [];
  public arregloUsuariosSelect: IUsuarios[] = [];
  public arregloProveedoresSelect: IProveedores[] = [];
  public arregloCompras:IComprasProveedor[] = [];
  public ultimaCompra:any;
  public montoAcumulado : number;


  constructor(public formBuilder: FormBuilder,public router:Router, public API: ApiService, public jwt:LoginjwtService) {
    this.montoAcumulado = 0;
    this.frmCompras = this.formBuilder.group({
        idUsuario:["",Validators.required],
        idProveedor:["",Validators.required],
        idProducto:["",Validators.required],
        cantidadProducto:["",Validators.required],
      });
 }

 //llena el select de productos
public listarProductos(){
  this.API.listarProductos().subscribe(
    (success:any)=>{
      return this.arregloProductosSelect = success.respuesta;
    },
    (error)=>{
      console.log("algo ocurrio: ",error)
    }
  );
}

//llena el select de proveedores
public listarProveedores(){
  this.API.listarProveedores().subscribe(
    (success:any)=>{
      return this.arregloProveedoresSelect = success.respuesta;
    },
    (error)=>{
      console.log("algo ocurrio: ",error)
    }
  );
}

//llena el select de usuarios
public listarUsuarios(){
  this.API.listarUsuarios().subscribe(
    (success:any)=>{
      return this.arregloUsuariosSelect = success.respuesta;
    },
    (error)=>{
      console.log("algo ocurrio: ",error)
    }
  );
}

public agregarProductos(){
  let agregarValorID: number = 0;
  let agregarValorCantidad: number = 0;

  this.API.listarProductos().subscribe(
    (success:any)=>{
      agregarValorID = this.frmCompras.get('idProducto').value;
      console.log("aqui estan los productos: ",agregarValorID)
      agregarValorCantidad = this.frmCompras.get('cantidadProducto').value;

      this.montoAcumulado = this.montoAcumulado + (success.respuesta[agregarValorID-1].precioUnitario * agregarValorCantidad);

      if (this.arregloProductos.length>=1) {
        for (let i = 0; i < this.arregloProductos.length; i++) {
          if (agregarValorID == this.arregloProductos[i].idProducto) {
            this.arregloProductos[i].cantidadProducto = this.arregloProductos[i].cantidadProducto + agregarValorCantidad;
            this.dsProductos = new MatTableDataSource(this.arregloProductos);//paso la info del arreglo al dataSource de la tabla para mostrarlos cada que se agregue un nuevo registro
          }else{
            if(i == this.arregloProductos.length -1){
              console.log("hola")
              console.log("producto a agregar: ",agregarValorID-1);
              this.arregloProductos.push({idProducto:agregarValorID,cantidadProducto:agregarValorCantidad,nombreProducto:success.respuesta[agregarValorID-1].nombreProducto,precioUnitario:success.respuesta[agregarValorID-1].precioUnitario});
              this.dsProductos = new MatTableDataSource(this.arregloProductos);//paso la info del arreglo al dataSource de la tabla para mostrarlos cada que se agregue un nuevo registro
              break;
            }
          }
        }
      }
      else{
        this.arregloProductos.push({idProducto:agregarValorID,cantidadProducto:agregarValorCantidad,nombreProducto:success.respuesta[agregarValorID-1].nombreProducto,precioUnitario:success.respuesta[agregarValorID-1].precioUnitario});
        this.dsProductos = new MatTableDataSource(this.arregloProductos);//paso la info del arreglo al dataSource de la tabla para mostrarlos cada que se agregue un nuevo registro
        document.getElementById('tablaCompraConcluidaVacia').style.display = "none";
      }
    },
    (error)=>{
      console.log("algo ocurrio",error)
    }
  );
}

public eliminarProductosCarrito(objetoProducto:any,indice:number){
  console.log("producto a eliminar: ",indice-1,);
  console.log(this.arregloProductos)
  this.arregloProductos.splice(indice,1);
  this.dsProductos = new MatTableDataSource(this.arregloProductos);

  this.API.listarProductos().subscribe(
    (success:any)=>{
          this.montoAcumulado = this.montoAcumulado - (success.respuesta[0].precioUnitario  *  objetoProducto.cantidadProducto);
    },
    (error)=>{
      console.log("algo ocurrio",error)
    }
  );
}


public agregarCompra(){
 let idUsuarioForm:number = 0,idProveedorForm:number = 0,montoTotalForm: number = 0;
  let arregloProductosForm:any[] = []
  montoTotalForm = this.montoAcumulado;
  idProveedorForm = this.frmCompras.get('idProveedor').value;
  idUsuarioForm = this.frmCompras.get('idUsuario').value;
  arregloProductosForm = this.arregloProductos;
  if (arregloProductosForm.length == 0) {

      alert("presionar boton de agregar productos \n");
  }

  this.API.agregarCompra(montoTotalForm,idProveedorForm,idUsuarioForm,arregloProductosForm).subscribe(
    (success:any)=>{
      console.log("arreglo productos", arregloProductosForm.length)
      //console.log("entro con exito!")
      console.log("contenido de success: ",success)
      if(success.estatus > 0){
        console.log("resultado"+success.respuesta);
        setTimeout(()=>{
          this.listarCompras();
          this.limpiarFormulario();
        },500)
      }else if(success.estatus < 0) {
          alert("No cuentas con el dinero suficiente | verifica tu pago");
      }else{
        alert(JSON.stringify(success.respuesta));
      }

    },
    (error)=>{
      alert("algo anda mal | "+ JSON.stringify(error));
    }
  );
}

public listarCompras(){
    this.API.listarCompras().subscribe(
    (success:any)=>{
      this.arregloCompras = success.respuesta;
      this.ultimaCompra = this.arregloCompras[this.arregloCompras.length - 1];
      this.dsCompras = new MatTableDataSource([this.ultimaCompra]);
      this.arregloCompras = [this.ultimaCompra];
    },
    (error)=>{
      console.log("algo ocurrio: ",error)
    }
  );
}


public limpiarFormulario(){
  this.frmCompras.reset();
  this.montoAcumulado = 0;

  this.dsProductos.data=[];
  this.arregloProductos = [];
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
    this.listarProductos();
    this.listarProveedores();
    this.listarUsuarios();
  }

}
