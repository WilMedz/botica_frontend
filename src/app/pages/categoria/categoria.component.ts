import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Categoria } from '../../model/categoria';
import { CategoriaService } from '../../services/categoria.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { switchMap, tap } from 'rxjs';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CategoriaEditComponent } from './categoria-edit/categoria-edit.component';

@Component({
  selector: 'app-categoria',
  imports: [
    RouterOutlet,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent {
  private readonly categoriaService = inject(CategoriaService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  protected readonly authService = inject(AuthService);

  protected $dataSource = signal(new MatTableDataSource<Categoria>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);
  protected $categoria = this.categoriaService.$listChange;
  protected displayedColumns: string[] = ['idCategoria', 'nombre', 'descripcion', 'estado', 'acciones'];

  constructor() {
    this.categoriaService.findAll().subscribe(data => this.categoriaService.setListChange(data));

    effect(() => {
      const data = this.$categoria();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();
      ds.data = data;
      ds.paginator = p;
      ds.sort = s;
    });

    effect(() => {
      const message = this.categoriaService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.categoriaService.setMessageChange(''));
      }
    });
  }

  openModal(id?: number) {
    this.dialog.open(CategoriaEditComponent, {
      width: '480px',
      data: { id }
    });
  }

  applyFilter(e: any) {
    this.$dataSource().filter = e.target.value.trim().toLowerCase();
  }

  delete(id: number) {
    const ok = window.confirm('¿Eliminar categoría?');
    if (ok) {
      this.categoriaService.delete(id).pipe(
        switchMap(() => this.categoriaService.findAll()),
        tap(data => this.categoriaService.setListChange(data)),
        tap(() => this.categoriaService.setMessageChange('ELIMINADO'))
      ).subscribe();
    }
  }
}