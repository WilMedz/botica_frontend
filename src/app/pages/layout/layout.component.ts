import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../model/usuario';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {

  private menuService = inject(MenuService);
  private usuarioService = inject(UsuarioService);

  public menus = this.menuService.menusSignal;
  public usuarioActual = signal<Usuario | null>(null);

  ngOnInit(): void {
    this.menuService.getMenusByUser().subscribe({
      error: (err) => console.error('Error cargando menús dinámicos', err)
    });

    this.usuarioService.getMe().subscribe({
      next: (data) => this.usuarioActual.set(data),
      error: (err) => console.error('Error cargando datos del usuario', err)
    });
  }
}