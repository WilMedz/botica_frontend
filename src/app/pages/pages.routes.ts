import { Routes } from '@angular/router';
import { CategoriaComponent }            from './categoria/categoria.component';
import { ProveedorComponent }            from './proveedor/proveedor.component';
import { DashboardComponent }            from './dashboard/dashboard.component';
import { ProductoComponent }             from './producto/producto.component';
import { ClienteComponent }              from './cliente/cliente.component';
import { VentaComponent }                from './venta/venta.component';
import { VentaEditComponent }            from './venta/venta-edit/venta-edit.component';
import { MovimientoInventarioComponent } from './movimiento-inventario/movimiento-inventario.component';
import { RolComponent }                  from './rol/rol.component';
import { UsuarioComponent }              from './usuario/usuario.component';
import { adminGuard }                    from '../guards/admin-guard';
import { PerfilComponent }               from './perfil/perfil.component';

export const pagesRoutes: Routes = [
  { path: 'dashboard',   component: DashboardComponent },
  { path: 'categorias',  component: CategoriaComponent },
  { path: 'proveedores', component: ProveedorComponent },
  { path: 'productos',   component: ProductoComponent },
  { path: 'clientes',    component: ClienteComponent },
  { path: 'ventas',      component: VentaComponent, children: [
    { path: 'new',       component: VentaEditComponent },
    { path: 'edit/:id',  component: VentaEditComponent }
  ]},
  { path: 'movimientos', component: MovimientoInventarioComponent },
  { path: 'roles',       component: RolComponent, canActivate: [adminGuard] },
  { path: 'usuarios',    component: UsuarioComponent, canActivate: [adminGuard] },
  { path: '',            redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'perfil',      component: PerfilComponent }
];