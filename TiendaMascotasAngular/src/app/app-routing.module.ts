import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {ProductosComponent} from './productos/productos.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { ClientesComponent } from './clientes/clientes.component';
import { DevolucionesComponent } from './devoluciones/devoluciones.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AccesosComponent } from './accesos/accesos.component';
import {AgregarVentaCarritoComponent } from './agregar-venta-carrito/agregar-venta-carrito.component';
import { MetodoPagoComponent } from './metodo-pago/metodo-pago.component';
import { ReportesComponent } from './reportes/reportes.component';
import { TransaccionesComponent } from './transacciones/transacciones.component';
import { ComprasProveedorComponent } from './compras-proveedor/compras-proveedor.component';
import { EnviosComponent } from './envios/envios.component';
import { EnviarCorreoComponent } from './enviar-correo/enviar-correo.component';
import { CambiarContraseniaComponent } from './cambiar-contrasenia/cambiar-contrasenia.component';
import{AuthGuard}from './auth.guard';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path:'enviarCorreo',component:EnviarCorreoComponent},
  {path:'cambiarPassword',component:CambiarContraseniaComponent},
  {path: 'productos', component:ProductosComponent, canActivate:[AuthGuard]},
  {path: 'proveedores', component:ProveedoresComponent, canActivate:[AuthGuard]},
  {path: 'clientes', component:ClientesComponent, canActivate:[AuthGuard]},
  {path: 'devoluciones', component: DevolucionesComponent, canActivate:[AuthGuard]},
  {path: 'usuarios', component: UsuariosComponent, canActivate:[AuthGuard]},
  {path: 'accesos', component: AccesosComponent, canActivate:[AuthGuard]},
  {path: 'carrito', component: AgregarVentaCarritoComponent, canActivate:[AuthGuard]},
  {path: 'metodoPago', component: MetodoPagoComponent, canActivate:[AuthGuard]},
  {path: 'reportes', component:ReportesComponent, canActivate:[AuthGuard]},
  {path: 'transacciones', component:TransaccionesComponent, canActivate:[AuthGuard]},
  {path: 'compras', component:ComprasProveedorComponent, canActivate:[AuthGuard]},
  {path:'envios', component:EnviosComponent, canActivate:[AuthGuard]},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: '**', redirectTo: 'login', pathMatch: 'full'}, //EN CASO DE QUE EL USUARIO SE INVENTE UNA RUTA

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
