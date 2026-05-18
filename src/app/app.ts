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
    const ruta = this.router.url;
    if (ruta.includes('dashboard')) return 'Dashboard';
    if (ruta.includes('categorias')) return 'Categorías';
    if (ruta.includes('proveedores')) return 'Proveedores';
    return 'Dashboard';
  }
}