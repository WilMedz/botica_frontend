import { Routes } from '@angular/router';
import { CategoriaComponent } from './pages/categoria/categoria.component';

export const routes: Routes = [
  { path: 'categorias', component: CategoriaComponent },
  { path: '', redirectTo: 'categorias', pathMatch: 'full' }
];