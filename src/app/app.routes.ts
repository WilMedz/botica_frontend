import { Routes } from '@angular/router';
import { ProveedorComponent } from './pages/proveedor/proveedor';

export const routes: Routes = [
    { path: 'proveedores', component: ProveedorComponent },
    { path: '', redirectTo: 'proveedores', pathMatch: 'full' }
];