import { Routes } from '@angular/router';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';

export const routes: Routes = [
  { path: 'categorias', component: CategoriaComponent },
  { path: 'proveedores', component: ProveedorComponent },
  { path: '', redirectTo: 'categorias', pathMatch: 'full' }
];
