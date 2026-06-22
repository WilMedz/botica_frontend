import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { MovimientoInventarioService } from '../../services/movimiento-inventario.service';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../model/producto';
import { switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movimiento-inventario',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule
  ],
  templateUrl: './movimiento-inventario.component.html',
  styleUrl: './movimiento-inventario.component.css'
})
export class MovimientoInventarioComponent {
  private readonly movimientoService = inject(MovimientoInventarioService);
  private readonly productoService = inject(ProductoService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly authService = inject(AuthService);
  protected productos = signal<Producto[]>([]);
  protected $dataSource = signal(new MatTableDataSource<any>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);
  protected $movimientos = this.movimientoService.$listChange;

  protected displayedColumns: string[] = [
    'idMovimiento',
    'nombreProducto',
    'tipo',
    'cantidad',
    'stockAnterior',
    'stockNuevo',
    'motivo',
    'fecha'
  ];

  protected movementForm = new FormGroup({
    idProducto: new FormControl<number | null>(null, [Validators.required]),
    tipo:       new FormControl<string>('ENTRADA', [Validators.required]),
    cantidad:   new FormControl<number>(1, [Validators.required, Validators.min(1)]),
    motivo:     new FormControl<string>('', [Validators.required, Validators.maxLength(250)])
  });

  constructor() {
    this.productoService.findAll().subscribe(data => this.productos.set(data));
    this.cargarMovimientos();

    effect(() => {
      const data = this.$movimientos();
      const prods = this.productos();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();

      // Mapear el nombre del producto
      const mapped = data.map(m => {
        const prod = prods.find(x => x.idProducto === m.idProducto);
        return {
          ...m,
          nombreProducto: prod ? prod.nombre : `Producto ID: ${m.idProducto}`
        };
      });

      ds.data = mapped;
      ds.paginator = p;
      ds.sort = s;
    });

    effect(() => {
      const message = this.movimientoService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.movimientoService.setMessageChange(''));
      }
    });
  }

  cargarMovimientos() {
    this.movimientoService.findAll().subscribe(data => this.movimientoService.setListChange(data));
  }

  registrarMovimiento() {
    if (this.movementForm.invalid) return;

    const val = this.movementForm.value;

    // Verificar si es SALIDA y validar stock
    if (val.tipo === 'SALIDA') {
      const prod = this.productos().find(p => p.idProducto === val.idProducto);
      if (prod && prod.stock < val.cantidad!) {
        alert(`Stock insuficiente para realizar la salida. Stock actual de ${prod.nombre}: ${prod.stock}`);
        return;
      }
    }

    const mov: any = {
      idProducto: val.idProducto!,
      tipo: val.tipo!,
      cantidad: val.cantidad!,
      motivo: val.motivo!,
      fecha: new Date().toISOString()
    };

    this.movimientoService.save(mov).pipe(
      switchMap(() => this.movimientoService.findAll()),
      tap(data => this.movimientoService.setListChange(data)),
      // Actualizar también la lista de productos para ver el stock actualizado
      switchMap(() => this.productoService.findAll()),
      tap(data => this.productoService.setListChange(data)),
      tap(() => {
        this.movimientoService.setMessageChange('MOVIMIENTO REGISTRADO Y STOCK ACTUALIZADO');
        this.movementForm.reset({ tipo: 'ENTRADA', cantidad: 1, motivo: '' });
      })
    ).subscribe();
  }

  applyFilter(e: any) {
    this.$dataSource().filter = e.target.value.trim().toLowerCase();
  }
}
