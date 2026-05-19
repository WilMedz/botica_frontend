import { Routes } from '@angular/router';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductoComponent }  from './pages/producto/producto.component';


export const routes: Routes = [
  { path: 'categorias', component: CategoriaComponent },
  { path: 'proveedores', component: ProveedorComponent },
  { path: 'dashboard', component: DashboardComponent },
  {path: 'productos',  component: ProductoComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
