import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CategoriaService } from '../../../services/categoria.service';
import { ProveedorService } from '../../../services/proveedor.service';
import { ProductoService } from '../../../services/producto.service';
import { Producto } from '../../../model/producto';
import { Categoria } from '../../../model/categoria';
import { Proveedor } from '../../../model/proveedor';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-producto-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDialogModule
  ],
  templateUrl: './producto-edit.component.html',
  styleUrl: './producto-edit.component.css'
})
export class ProductoEditComponent {
  private readonly productoService = inject(ProductoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly proveedorService = inject(ProveedorService);
  private readonly dialogRef = inject(MatDialogRef<ProductoEditComponent>);
  protected readonly data = inject(MAT_DIALOG_DATA) as { id?: number };

  protected $isEdit = signal(!!this.data?.id);
  protected categorias = signal<Categoria[]>([]);
  protected proveedores = signal<Proveedor[]>([]);

  protected $form = signal(new FormGroup({
    idProducto:       new FormControl<number | null>(null),
    nombre:           new FormControl<string>('', [Validators.required, Validators.minLength(2)]),
    descripcion:      new FormControl<string>(''),
    codigoBarra:      new FormControl<string>(''),
    precioCompra:     new FormControl<number>(0, [Validators.required, Validators.min(0.01)]),
    precioVenta:      new FormControl<number>(0, [Validators.required, Validators.min(0.01)]),
    stock:            new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    stockMinimo:      new FormControl<number>(20, [Validators.required, Validators.min(0)]),
    fechaVencimiento: new FormControl<string>(''),
    idCategoria:      new FormControl<number | null>(null, [Validators.required]),
    idProveedor:      new FormControl<number | null>(null),
    estado:           new FormControl<boolean>(true),
  }));

  constructor() {
    this.categoriaService.findAll().subscribe(data => this.categorias.set(data));
    this.proveedorService.findAll().subscribe(data => this.proveedores.set(data));

    if (this.data?.id) {
      this.productoService.findById(this.data.id).subscribe(data => {
        this.$form().patchValue(data);
      });
    }
  }

  operate() {
    const form = this.$form();
    if (form.invalid) return;

    const isEdit = this.$isEdit();
    const id = this.data?.id;
    const producto: Producto = form.value as Producto;

    const operation$ = isEdit
      ? this.productoService.update(id, producto)
      : this.productoService.save(producto);

    operation$.pipe(
      switchMap(() => this.productoService.findAll()),
      tap(data => this.productoService.setListChange(data)),
      tap(() => this.productoService.setMessageChange(isEdit ? 'ACTUALIZADO' : 'CREADO'))
    ).subscribe(() => {
      this.dialogRef.close();
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}