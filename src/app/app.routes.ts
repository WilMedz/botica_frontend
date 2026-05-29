import { Routes } from '@angular/router';
import { CategoriaComponent }            from './pages/categoria/categoria.component';
import { CategoriaEditComponent }        from './pages/categoria/categoria-edit/categoria-edit.component';
import { ProveedorComponent }            from './pages/proveedor/proveedor.component';
import { DashboardComponent }            from './pages/dashboard/dashboard.component';
import { ProductoComponent }             from './pages/producto/producto.component';
import { ClienteComponent }              from './pages/cliente/cliente.component';
import { VentaComponent }                from './pages/venta/venta.component';
import { MovimientoInventarioComponent } from './pages/movimiento-inventario/movimiento-inventario.component';

export const routes: Routes = [
  { path: 'dashboard',   component: DashboardComponent },
  { path: 'categorias',  component: CategoriaComponent, children: [
    { path: 'new',       component: CategoriaEditComponent },
    { path: 'edit/:id',  component: CategoriaEditComponent }
  ]},
  { path: 'proveedores', component: ProveedorComponent },
  { path: 'productos',   component: ProductoComponent },
  { path: 'clientes',    component: ClienteComponent },
  { path: 'ventas',      component: VentaComponent },
  { path: 'movimientos', component: MovimientoInventarioComponent },
  { path: '',            redirectTo: 'dashboard', pathMatch: 'full' }
];