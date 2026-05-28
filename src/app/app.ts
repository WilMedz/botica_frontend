import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);

  getPagina(): string {
    const url = this.router.url;
    if (url.includes('dashboard'))   return 'Dashboard';
    if (url.includes('categorias'))  return 'Categorías';
    if (url.includes('proveedores')) return 'Proveedores';
    if (url.includes('clientes'))    return 'Clientes';
    if (url.includes('productos'))   return 'Productos';
    if (url.includes('ventas'))      return 'Ventas';
    if (url.includes('usuarios'))    return 'Usuarios';
    if (url.includes('roles'))       return 'Roles';
    return 'Dashboard';
  }
}