import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Cliente } from '../../model/cliente';
import { ClienteService } from '../../services/cliente.service';
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
import { AuthService } from '../../services/auth.service';
import { ClienteEditComponent } from './cliente-edit/cliente-edit.component';

@Component({
  selector: 'app-cliente',
  imports: [
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
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent {
  private readonly clienteService = inject(ClienteService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  protected readonly authService = inject(AuthService);

  protected $dataSource = signal(new MatTableDataSource<Cliente>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);
  protected $clientes = this.clienteService.$listChange;

  protected displayedColumns: string[] = [
    'idCliente', 'nombre', 'apellido', 'documento', 'telefono', 'email', 'estado', 'acciones'
  ];

  constructor() {
    this.clienteService.findAll().subscribe(data => this.clienteService.setListChange(data));

    effect(() => {
      const data = this.$clientes();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();
      ds.data = data;
      ds.paginator = p;
      ds.sort = s;
    });

    effect(() => {
      const message = this.clienteService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.clienteService.setMessageChange(''));
      }
    });
  }

  openModal(id?: number) {
    this.dialog.open(ClienteEditComponent, {
      width: '600px',
      data: { id }
    });
  }

  applyFilter(e: any) {
    this.$dataSource().filter = e.target.value.trim().toLowerCase();
  }

  delete(id: number) {
    const ok = window.confirm('¿Eliminar cliente?');
    if (ok) {
      this.clienteService.delete(id).pipe(
        switchMap(() => this.clienteService.findAll()),
        tap(data => this.clienteService.setListChange(data)),
        tap(() => this.clienteService.setMessageChange('ELIMINADO'))
      ).subscribe();
    }
  }
}