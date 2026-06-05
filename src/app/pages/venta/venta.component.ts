import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Venta } from '../../model/venta';
import { VentaService } from '../../services/venta.service';
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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-venta',
  imports: [
    CommonModule,
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
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.css'
})
export class VentaComponent {
  private readonly ventaService = inject(VentaService);
  private readonly snackBar = inject(MatSnackBar);

  protected $dataSource = signal(new MatTableDataSource<Venta>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);
  protected $ventas = this.ventaService.$listChange;

  protected displayedColumns: string[] = [
    'idVenta',
    'nombreCliente',
    'fecha',
    'total',
    'estado',
    'observacion',
    'acciones'
  ];

  constructor() {
    this.ventaService.findAll().subscribe(data => this.ventaService.setListChange(data));

    effect(() => {
      const data = this.$ventas();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();

      ds.data = data;
      ds.paginator = p;
      ds.sort = s;
    });

    effect(() => {
      const message = this.ventaService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.ventaService.setMessageChange(''));
      }
    });
  }

  applyFilter(e: any) {
    this.$dataSource().filter = e.target.value.trim().toLowerCase();
  }

  delete(id: number) {
    const ok = window.confirm('¿Eliminar/Anular esta venta?');
    if (ok) {
      this.ventaService.delete(id)
        .pipe(
          switchMap(() => this.ventaService.findAll()),
          tap(data => this.ventaService.setListChange(data)),
          tap(() => this.ventaService.setMessageChange('VENTA ELIMINADA/ANULADA'))
        )
        .subscribe();
    }
  }
}
