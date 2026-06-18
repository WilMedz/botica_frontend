import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  
  // Inyección moderna de dependencias de Angular
  private menuService = inject(MenuService);

  // Exponemos el Signal reactivo directamente hacia el archivo HTML
  public menus = this.menuService.menusSignal;

  ngOnInit(): void {
    // Al cargar la página, solicitamos los menús al backend protegido
    this.menuService.getMenusByUser().subscribe({
      error: (err) => console.error('Error cargando menús dinámicos', err)
    });
  }
}
