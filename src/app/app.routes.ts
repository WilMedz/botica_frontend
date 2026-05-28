import { Routes } from '@angular/router';
import { CategoriaComponent }            from './pages/categoria/categoria.component';
import { ProveedorComponent }            from './pages/proveedor/proveedor.component';
import { DashboardComponent }            from './pages/dashboard/dashboard.component';
import { ProductoComponent }             from './pages/producto/producto.component';
import { ClienteComponent }              from './pages/cliente/cliente.component';
import { VentaComponent }                from './pages/venta/venta.component';
import { MovimientoInventarioComponent } from './pages/movimiento-inventario/movimiento-inventario.component';
import { UsuarioComponent }              from './pages/usuario/usuario.component';
import { RolComponent }                  from './pages/rol/rol.component';

export const routes: Routes = [
  { path: 'dashboard',    component: DashboardComponent },
  { path: 'categorias',   component: CategoriaComponent },
  { path: 'proveedores',  component: ProveedorComponent },
  { path: 'productos',    component: ProductoComponent },
  { path: 'clientes',     component: ClienteComponent },
  { path: 'ventas',       component: VentaComponent },
  { path: 'movimientos',  component: MovimientoInventarioComponent },
  { path: 'usuarios',     component: UsuarioComponent },
  { path: 'roles',        component: RolComponent },
  { path: '',             redirectTo: 'dashboard', pathMatch: 'full' }
];