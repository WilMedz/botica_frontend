import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Categoria } from '../../model/categoria';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-categoria',
  imports: [CommonModule],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent {
  private categoriaService = inject(CategoriaService);

  categorias = signal<Categoria[]>([]);

  constructor() {
    this.categoriaService.findAll().subscribe(data => {
      this.categorias.set(data);
    });
  }
}