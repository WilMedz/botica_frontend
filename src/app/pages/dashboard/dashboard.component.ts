import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../services/categoria.service';
import { ProveedorService } from '../../services/proveedor.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private categoriaService = inject(CategoriaService);
  private proveedorService = inject(ProveedorService);

  totalCategorias = signal<number>(0);
  totalProveedores = signal<number>(0);

  ngOnInit(): void {
    this.categoriaService.findAll().subscribe(data => this.totalCategorias.set(data.length));
    this.proveedorService.findAll().subscribe(data => this.totalProveedores.set(data.length));
  }
}