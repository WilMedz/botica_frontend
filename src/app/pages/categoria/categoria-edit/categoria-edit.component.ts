import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../model/categoria';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-categoria-edit',
  imports: [
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './categoria-edit.component.html',
  styleUrl: './categoria-edit.component.css'
})
export class CategoriaEditComponent {
  private readonly categoriaService = inject(CategoriaService);
  private readonly dialogRef = inject(MatDialogRef<CategoriaEditComponent>);
  protected readonly data = inject(MAT_DIALOG_DATA) as { id?: number };

  protected $isEdit = signal(!!this.data?.id);

  protected $form = signal(new FormGroup({
    idCategoria: new FormControl<number | null>(null),
    nombre:      new FormControl<string>('', [Validators.required, Validators.maxLength(20)]),
    descripcion: new FormControl<string>('', [Validators.required]),
    estado:      new FormControl<boolean>(true),
  }));

  constructor() {
    if (this.data?.id) {
      this.categoriaService.findById(this.data.id).subscribe(data => {
        this.$form().patchValue(data);
      });
    }
  }

  operate() {
    const form = this.$form();
    const isEdit = this.$isEdit();
    const id = this.data?.id;
    const categoria: Categoria = form.value as Categoria;

    const operation$ = isEdit
      ? this.categoriaService.update(id, categoria)
      : this.categoriaService.save(categoria);

    operation$.pipe(
      switchMap(() => this.categoriaService.findAll()),
      tap(data => this.categoriaService.setListChange(data)),
      tap(() => this.categoriaService.setMessageChange(isEdit ? 'ACTUALIZADO' : 'CREADO'))
    ).subscribe(() => {
      this.dialogRef.close();
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}