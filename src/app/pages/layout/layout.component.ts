import { Component, inject, signal, computed, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../model/usuario';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {

  private menuService = inject(MenuService);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private router = inject(Router);

  public menus = this.menuService.menusSignal;
  public usuarioActual = signal<Usuario | null>(null);
  public urlActual = signal<string>(this.router.url);
  public showUserMenu = signal<boolean>(false);

  public tituloPaginaActual = computed(() => {
    const menusList = this.menus();
    const url = this.urlActual();
    const menuEncontrado = menusList.find(m => url.startsWith(m.url));
    return menuEncontrado ? menuEncontrado.nombre : 'Dashboard';
  });

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-chip')) {
      this.showUserMenu.set(false);
    }
  }

  constructor() {
    this.menuService.getMenusByUser().subscribe({
      error: (err) => console.error('Error cargando menús dinámicos', err)
    });

    this.usuarioService.getMe().subscribe({
      next: (data) => this.usuarioActual.set(data),
      error: (err) => console.error('Error cargando datos del usuario', err)
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.urlActual.set(event.urlAfterRedirects);
      }
    });
  }

  toggleUserMenu() {
    this.showUserMenu.set(!this.showUserMenu());
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}