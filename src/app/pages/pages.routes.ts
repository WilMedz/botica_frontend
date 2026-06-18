import { Routes } from '@angular/router';
import { CategoriaComponent }            from './categoria/categoria.component';
import { CategoriaEditComponent }        from './categoria/categoria-edit/categoria-edit.component';
import { ProveedorComponent }            from './proveedor/proveedor.component';
import { DashboardComponent }            from './dashboard/dashboard.component';
import { ProductoComponent }             from './producto/producto.component';
import { ProductoEditComponent }         from './producto/producto-edit/producto-edit.component';
import { ClienteComponent }              from './cliente/cliente.component';
import { ClienteEditComponent }          from './cliente/cliente-edit/cliente-edit.component';
import { VentaComponent }                from './venta/venta.component';
import { VentaEditComponent }            from './venta/venta-edit/venta-edit.component';
import { MovimientoInventarioComponent } from './movimiento-inventario/movimiento-inventario.component';
import { RolComponent }                  from './rol/rol.component';
import { UsuarioComponent }              from './usuario/usuario.component';
import { UsuarioEditComponent }          from './usuario/usuario-edit/usuario-edit.component';

export const pagesRoutes: Routes = [
  { path: 'dashboard',   component: DashboardComponent },
  { path: 'categorias',  component: CategoriaComponent, children: [
    { path: 'new',       component: CategoriaEditComponent },
    { path: 'edit/:id',  component: CategoriaEditComponent }
  ]},
  { path: 'proveedores', component: ProveedorComponent },
  { path: 'productos',   component: ProductoComponent, children: [
    { path: 'new',       component: ProductoEditComponent },
    { path: 'edit/:id',  component: ProductoEditComponent }
  ]},
  { path: 'clientes',    component: ClienteComponent, children: [
    { path: 'new',       component: ClienteEditComponent },
    { path: 'edit/:id',  component: ClienteEditComponent }
  ]},
  { path: 'ventas',      component: VentaComponent, children: [
    { path: 'new',       component: VentaEditComponent },
    { path: 'edit/:id',  component: VentaEditComponent }
  ]},
  { path: 'movimientos', component: MovimientoInventarioComponent },
  { path: 'roles',       component: RolComponent },
  { path: 'usuarios',    component: UsuarioComponent, children: [
    { path: 'new',       component: UsuarioEditComponent },
    { path: 'edit/:id',  component: UsuarioEditComponent }
  ]},
  { path: '',            redirectTo: 'dashboard', pathMatch: 'full' }
];