import { Component, OnInit} from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {Router} from '@angular/router';
import { ApiService, IClientes,IUsuarios } from '../api.service';
import { IProductosCarrito } from '../api.service';
import { IVentasCarrito } from '../api.service';
import { IMetodosPagoCarrito } from '../api.service';
import {IVentas} from '../api.service';
import {PdfService} from '../pdf.service';
import { LoginjwtService } from '../loginjwt.service';



@Component({
  selector: 'app-agregar-venta-carrito',
  templateUrl: './agregar-venta-carrito.component.html',
  styleUrls: ['./agregar-venta-carrito.component.scss']
})
export class AgregarVentaCarritoComponent implements OnInit {
  displayedColumns: string[] = ['idVenta', 'fechaRegistro', 'cantidadTotalProductos'];
  displayedColumnsProductos: string[] = ['nombreProducto','precioUnitario','cantidadProducto','acciones'];
  public dsVentas:MatTableDataSource<IVentasCarrito>;
  public dsProductos:MatTableDataSource<IProductosCarrito>;
  public frmVentas: FormGroup;
  public arregloProductosSelect: IProductosCarrito[] = [];
  public arregloProductosTabla: IProductosCarrito[] = [];
  public arregloClientesSelect: IClientes[] = [];
  public arregloUsuariosSelect: IUsuarios[] = [];
  public arregloMetodosPagoSelect: IMetodosPagoCarrito[] = [];
  public arregloMetodosPagoLista: IMetodosPagoCarrito[] = [];
  public arregloVentas:any[] = [];
  public arregloVentasDetalles:IVentas[] = [];
  public ultimaVenta:any;
  public montoAcumulado : number;
  public cambio:number;
  public usuarioEnSesion:string;
  public rolUsuario:string;
  public usuarioPresente:number;
  public tipoPagoSeleccionado:number = 0;



  constructor(public formBuilder: FormBuilder, public API: ApiService,public router:Router,public PDF: PdfService,public jwt:LoginjwtService) {
    this.usuarioPresente = 0;
    this.usuarioEnSesion = window.localStorage.getItem('nombreUsuario');
    this.rolUsuario = window.localStorage.getItem('tipoUsuario');

    this.montoAcumulado = 0;
    this.frmVentas = this.formBuilder.group({
        idUsuario:localStorage.getItem("nombreUsuario"),
        idCliente:["",Validators.required],
        pago:[""],
        idProducto:["",Validators.required],
        cantidadProductos:["",Validators.required],
        idMetodoPago:["",Validators.required]
      });
      this.frmVentas.get('pago').disable();
 }


 //llena el select de tipos de pagos
public listarMetodosPago(){
  this.API.listarMetodosPago().subscribe(
    (success:any)=>{
      return this.arregloMetodosPagoSelect = success.respuesta;
    },
    (error)=>{
      console.log("algo ocurrio: ",error)
    }
  );
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

//llena el select de clientes
public listarClientes(){
  this.API.listarClientes().subscribe(
    (success:any)=>{
      return this.arregloClientesSelect = success.respuesta;
    },
    (error)=>{
      console.log("algo ocurrio: ",error)
    }
  );
}

//llena el select de vendedores
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


//LLENA EL INPUT DEL NOMBRE DE USUARIO, ESTE ES EL DEL USUARIO EN SESIÓN
  public mostrarUsuarioEnSesion(){
    this.API.listarUsuariosPornombre(localStorage.getItem("nombreUsuario")).subscribe(
      (success:any)=>{
          this.usuarioPresente = success.respuesta[0].idUsuario;

      },
      (error)=>{
        console.log(error)
      }
    );
  }


  public agregarProductos(){
    let productos: number = 0;//idProducto
    let cantidad: number = 0;

    this.API.listarProductos().subscribe(
      (success:any)=>{
        productos = this.frmVentas.get('idProducto').value;
        cantidad = this.frmVentas.get('cantidadProductos').value;

        this.montoAcumulado = this.montoAcumulado + (success.respuesta[productos-1].precioUnitario * cantidad);

        if (this.arregloProductosTabla.length >= 1) {
          alert("posicion en arreglo: "+this.arregloProductosTabla[0].cantidadProductos);
          for (let i = 0; i < this.arregloProductosTabla.length; i++) {
            if (productos == this.arregloProductosTabla[i].idProducto) {
              this.arregloProductosTabla[i].cantidadProductos = this.arregloProductosTabla[i].cantidadProductos + cantidad;
              this.dsProductos = new MatTableDataSource(this.arregloProductosTabla);
              if(i == this.arregloProductosTabla.length -1){
                this.arregloProductosTabla.push({idProducto:productos,cantidadProductos:cantidad,nombreProducto:success.respuesta[productos-1].nombreProducto,precioUnitario:success.respuesta[productos-1].precioUnitario});
                this.dsProductos = new MatTableDataSource(this.arregloProductosTabla);
                break;
              }

            }
          }

        }else{
          this.arregloProductosTabla.push({idProducto:productos,cantidadProductos:cantidad,nombreProducto:success.respuesta[productos-1].nombreProducto,precioUnitario:success.respuesta[productos-1].precioUnitario});
          this.dsProductos = new MatTableDataSource(this.arregloProductosTabla);
          document.getElementById('tablaVentaConcluidaVacia').style.display = "none";
        }
      },
      (error)=>{
        console.log("algo ocurrio",error)
      }
    );
  }

//eliminar productos de tabla (carrito)
public eliminarProductosCarrito(objetoProducto:any,indice:number){
  console.log("producto a eliminar: ",indice-1,);
  console.log(this.arregloProductosTabla)
  this.arregloProductosTabla.splice(indice,1);
  this.dsProductos = new MatTableDataSource(this.arregloProductosTabla);


  this.API.listarProductos().subscribe(
    (success:any)=>{
          this.montoAcumulado = this.montoAcumulado - (objetoProducto.precioUnitario  *  objetoProducto.cantidadProducto);
    },
    (error)=>{
      console.log("algo ocurrio",error)
    }
  );
}



public agregarMetodosPago(idMetodoPago:number){
  this.API.listarMetodosPago().subscribe(
    (success:any)=>{
        let tipoPago = this.frmVentas.get('idMetodoPago').value;
        this.frmVentas.controls['pago'].setValue(null);
        //si el checkbox esta marcado
        if (tipoPago == true) {
          this.tipoPagoSeleccionado++;
          this.frmVentas.get('pago').enable();
          this.arregloMetodosPagoLista.push({idMetodoPago:idMetodoPago})
        }else if(tipoPago == false){
          this.tipoPagoSeleccionado--;
          this.arregloMetodosPagoLista.splice(idMetodoPago-1,1)
        }


        if(this.tipoPagoSeleccionado == 0){
          console.log("seleccionar el  tipo de pago");
          this.frmVentas.get('pago').disable();
        }

      },
      (error)=>{
        console.log("algo ocurrio: ",error)
    }
  );
}
public agregarVenta(){
  let idClienteForm:number = 0,idUsuarioForm:number = 0,pagoForm: number = 0;
  let arregloProductosForm:any[] = [],arregloMetodosPagoForm:any[] = [];
  idClienteForm = this.frmVentas.get('idCliente').value;
  idUsuarioForm = this.usuarioPresente;
  pagoForm = this.frmVentas.get('pago').value;
  arregloProductosForm = this.arregloProductosTabla;
  arregloMetodosPagoForm = this.arregloMetodosPagoLista;

  if (arregloProductosForm.length == 0) {
    alert(" presionar boton de agregar productos \n");
    return;
  }

  console.log("tipo de pago en transaccion: ", arregloMetodosPagoForm);
  this.API.listarMetodosPagoPorID(arregloMetodosPagoForm[0].idMetodoPago).subscribe(
    (success:any)=>{
      if (success.respuesta[0].tipoPago != "efectivo") {
        pagoForm = this.montoAcumulado;

        console.log("no pagaste en efectivo")
      }
      this.API.agregarVenta(idClienteForm,idUsuarioForm,pagoForm,arregloProductosForm,arregloMetodosPagoForm).subscribe(
        (success:any)=>{
          if(success.estatus > 0){
            setTimeout(()=>{
              alert(success.respuesta);
              document.getElementById('agregarVenta').style.pointerEvents = "none";
              this.listarVentas();

            },500)
          }else if(success.estatus < 0) {
            alert("No cuentas con el dinero suficiente | verifica tu pago");
            console.log("verdadero error: ",success.respuesta)
          }else{
            alert(JSON.stringify(success.respuesta));
          }

        },
        (error)=>{
          alert("algo anda mal | "+ JSON.stringify(error));
        }
      );
    },
    (error:any)=>{

    }
  );
}

public listarVentas(){
  this.API.listarVentas().subscribe(
    (success:any)=>{

      this.arregloVentas = success.respuesta;
      this.ultimaVenta = this.arregloVentas[this.arregloVentas.length - 1];

      this.dsVentas = new MatTableDataSource([this.ultimaVenta]);
      this.arregloVentas = [this.ultimaVenta];

      setTimeout(()=>{
        this.generarPDF('pdf');
        this.cambio = this.arregloVentas[0].cambio;
        document.getElementById('cambio').style.display = "contents";
      },0);

    },
    (error)=>{
      console.log("algo ocurrio: ",error)
    }
  );
}




public limpiarFormulario(){
  this.frmVentas.reset();
  this.frmVentas.controls['idUsuario'].setValue(localStorage.getItem("nombreUsuario"));
  this.montoAcumulado = 0;
  this.frmVentas.get('pago').disable();

  this.dsProductos.data=[];
  this.arregloProductosTabla = []
  this.arregloMetodosPagoLista = [];
  document.getElementById('tablaVentaConcluidaVacia').style.display = "block";
  document.getElementById('cambio').style.display = "none";
  document.getElementById('agregarVenta').style.pointerEvents = "unset";
  document.getElementById('LimpiarInformacionVenta').style.display = "none";
}


  public generarPDF(pdf:string){
    console.log("este es el parametro de tu pdf: ",pdf);
    this.PDF.generarPDF(pdf);
    setTimeout(()=>{
      document.getElementById('pdf').style.display = "none";
    },100000);

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
    this.jwt.verificarAcceso();
    this.mostrarUsuarioEnSesion();
    this.listarMetodosPago();
    this.listarProductos();
    this.listarUsuarios();
    this.listarClientes();
  }

}
