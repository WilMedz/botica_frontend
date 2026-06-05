import { Component, effect, inject, signal, untracked } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RolService } from '../../services/rol.service';
import { Rol } from '../../model/rol';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rol',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './rol.component.html',
  styleUrl: './rol.component.css'
})
export class RolComponent {
  private readonly rolService = inject(RolService);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  protected $dataSource = signal(new MatTableDataSource<Rol>());
  protected $roles = this.rolService.$listChange;
  protected displayedColumns: string[] = ['idRol', 'nombre', 'acciones'];

  protected rolForm: FormGroup;
  protected isEditing = false;
  protected editingId: number | null = null;

  constructor() {
    this.rolForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(30)]]
    });

    this.rolService.findAll().subscribe(data => this.rolService.setListChange(data));

    effect(() => {
      const data = this.$roles();
      const ds = this.$dataSource();
      ds.data = data;
    });

    effect(() => {
      const message = this.rolService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.rolService.setMessageChange(''));
      }
    });
  }

  guardar() {
    if (this.rolForm.invalid) return;

    const rol: Rol = this.rolForm.value;

    if (this.isEditing && this.editingId) {
      this.rolService.update(this.editingId, rol).subscribe({
        next: () => {
          this.rolService.findAll().subscribe(data => this.rolService.setListChange(data));
          this.rolService.setMessageChange('ROL ACTUALIZADO');
          this.resetForm();
        }
      });
    } else {
      this.rolService.save(rol).subscribe({
        next: () => {
          this.rolService.findAll().subscribe(data => this.rolService.setListChange(data));
          this.rolService.setMessageChange('ROL CREADO');
          this.resetForm();
        }
      });
    }
  }

  editar(row: Rol) {
    this.isEditing = true;
    this.editingId = row.idRol;
    this.rolForm.patchValue({
      nombre: row.nombre
    });
  }

  eliminar(id: number) {
    const ok = window.confirm('¿Seguro de eliminar este Rol?');
    if (ok) {
      this.rolService.delete(id).subscribe({
        next: () => {
          this.rolService.findAll().subscribe(data => this.rolService.setListChange(data));
          this.rolService.setMessageChange('ROL ELIMINADO');
        }
      });
    }
  }

  resetForm() {
    this.rolForm.reset();
    this.isEditing = false;
    this.editingId = null;
  }
}
