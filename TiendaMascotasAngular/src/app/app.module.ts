import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {AppRoutingModule } from './app-routing.module';
import {AppComponent } from './app.component';
import {LoginComponent } from './login/login.component';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatListModule} from '@angular/material/list';
import {MatChipsModule} from '@angular/material/chips';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ProductosComponent } from './productos/productos.component';
import {ProveedoresComponent } from './proveedores/proveedores.component';
import {ClientesComponent } from './clientes/clientes.component';
import {DevolucionesComponent } from './devoluciones/devoluciones.component';
import {UsuariosComponent } from './usuarios/usuarios.component';
import {AccesosComponent } from './accesos/accesos.component';
import {AgregarVentaCarritoComponent } from './agregar-venta-carrito/agregar-venta-carrito.component';
import {MetodoPagoComponent } from './metodo-pago/metodo-pago.component';
import {ReportesComponent } from './reportes/reportes.component';
import {TransaccionesComponent } from './transacciones/transacciones.component';
import {EnviosComponent } from './envios/envios.component';
import {ComprasProveedorComponent } from './compras-proveedor/compras-proveedor.component';
import {TemplateProgressSpinnerComponent } from './template-progress-spinner/template-progress-spinner.component';
import { EnviarCorreoComponent } from './enviar-correo/enviar-correo.component';
import { CambiarContraseniaComponent } from './cambiar-contrasenia/cambiar-contrasenia.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProductosComponent,
    ProveedoresComponent,
    ClientesComponent,
    DevolucionesComponent,
    UsuariosComponent,
    AccesosComponent,
    AgregarVentaCarritoComponent,
    MetodoPagoComponent,
    ReportesComponent,
    TransaccionesComponent,
    EnviosComponent,
    ComprasProveedorComponent,
    TemplateProgressSpinnerComponent,
    EnviarCorreoComponent,
    CambiarContraseniaComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatListModule,
    MatChipsModule,
    MatTooltipModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    OverlayModule,
    PortalModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
