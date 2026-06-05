import { Routes } from '@angular/router';
import { CategoriaComponent }            from './pages/categoria/categoria.component';
import { CategoriaEditComponent }        from './pages/categoria/categoria-edit/categoria-edit.component';
import { ProveedorComponent }            from './pages/proveedor/proveedor.component';
import { DashboardComponent }            from './pages/dashboard/dashboard.component';
import { ProductoComponent }             from './pages/producto/producto.component';
import { ClienteComponent }              from './pages/cliente/cliente.component';
import { ClienteEditComponent }          from './pages/cliente/cliente-edit/cliente-edit.component';
import { VentaComponent }                from './pages/venta/venta.component';
import { VentaEditComponent }            from './pages/venta/venta-edit/venta-edit.component';
import { MovimientoInventarioComponent } from './pages/movimiento-inventario/movimiento-inventario.component';
import { ProductoEditComponent }         from './pages/producto/producto-edit/producto-edit.component';
import { RolComponent }                  from './pages/rol/rol.component';
import { UsuarioComponent }              from './pages/usuario/usuario.component';
import { UsuarioEditComponent }          from './pages/usuario/usuario-edit/usuario-edit.component';

export const routes: Routes = [
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