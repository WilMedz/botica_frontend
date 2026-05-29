import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../model/producto';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-producto',
  imports: [
    RouterOutlet,
    RouterLink,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent {
  private readonly productoService = inject(ProductoService);
  private readonly snackBar = inject(MatSnackBar);

  protected $dataSource = signal(new MatTableDataSource<Producto>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);
  protected $productos = this.productoService.$listChange;

  protected displayedColumns: string[] = ['idProducto', 'nombre', 'descripcion', 'precioVenta', 'stock', 'estado', 'acciones'];

  constructor() {
    this.productoService.findAll().subscribe(data => this.productoService.setListChange(data));

    effect(() => {
      const data = this.$productos();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();

      ds.data = data;
      ds.paginator = p;
      ds.sort = s;
    });

    effect(() => {
      const message = this.productoService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.productoService.setMessageChange(''));
      }
    });
  }

  applyFilter(e: any) {
    this.$dataSource().filter = e.target.value.trim().toLowerCase();
  }

  delete(id: number) {
    const ok = window.confirm('¿Eliminar producto?');
    if (ok) {
      this.productoService.delete(id)
        .pipe(
          switchMap(() => this.productoService.findAll()),
          tap(data => this.productoService.setListChange(data)),
          tap(() => this.productoService.setMessageChange('ELIMINADO'))
        )
        .subscribe();
    }
  }
}