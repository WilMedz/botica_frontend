import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Categoria } from '../../model/categoria';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-categoria',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent implements OnInit {
  private categoriaService = inject(CategoriaService);
  private fb = inject(FormBuilder);

  categorias: Categoria[] = [];   
  categoriaForm: FormGroup;
  isEditing = false;
  editingId: number = 0;

  constructor() {
    this.categoriaForm = this.fb.group({
      nombre:      ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required]],
      estado:      [true]
    });
  }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.findAll().subscribe(data => this.categorias = data); 
  }

  guardar(): void {
    if (this.categoriaForm.invalid) {
      alert('Corrige los errores del formulario');
      return;
    }
    const categoria: Categoria = this.categoriaForm.value;
    if (this.isEditing) {
      this.categoriaService.update(categoria, this.editingId).subscribe(() => {
        this.cargarCategorias();
        this.resetForm();
      });
    } else {
      this.categoriaService.save(categoria).subscribe(() => {
        this.cargarCategorias();
        this.resetForm();
      });
    }
  }

  editar(cat: Categoria): void {
    this.isEditing = true;
    this.editingId = cat.idCategoria;
    this.categoriaForm.patchValue({
      nombre:      cat.nombre,
      descripcion: cat.descripcion,
      estado:      cat.estado
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Eliminar categoría?')) {
      this.categoriaService.delete(id).subscribe(() => this.cargarCategorias());
    }
  }

  resetForm(): void {
    this.categoriaForm.reset({ estado: true });
    this.isEditing = false;
    this.editingId = 0;
  }
}