import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { RolService } from '../../services/rol.service';
import { Rol } from '../../model/rol';
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
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UsuarioEditComponent } from './usuario-edit/usuario-edit.component';

@Component({
  selector: 'app-usuario',
  imports: [
    CommonModule,
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
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {
  private readonly usuarioService = inject(UsuarioService);
  private readonly rolService = inject(RolService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  protected readonly authService = inject(AuthService);

  protected $dataSource = signal(new MatTableDataSource<any>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);
  protected $usuarios = this.usuarioService.$listChange;
  protected roles = signal<Rol[]>([]);

  protected displayedColumns: string[] = [
    'idUsuario', 'fullName', 'username', 'email', 'nombreRol', 'estado', 'acciones'
  ];

  constructor() {
    this.rolService.findAll().subscribe(data => this.roles.set(data));
    this.usuarioService.findAll().subscribe(data => this.usuarioService.setListChange(data));

    effect(() => {
      const data = this.$usuarios();
      const rolesList = this.roles();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();

      const mapped = data.map(u => {
        const rol = rolesList.find(r => r.idRol === u.idRol);
        return {
          ...u,
          fullName: `${u.nombre} ${u.apellido}`,
          nombreRol: rol ? rol.nombre : `ID: ${u.idRol}`
        };
      });

      ds.data = mapped;
      ds.paginator = p;
      ds.sort = s;
    });

    effect(() => {
      const message = this.usuarioService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.usuarioService.setMessageChange(''));
      }
    });
  }

  openModal(id?: number) {
    this.dialog.open(UsuarioEditComponent, {
      width: '600px',
      data: { id }
    });
  }

  applyFilter(e: any) {
    this.$dataSource().filter = e.target.value.trim().toLowerCase();
  }

  delete(id: number) {
    const ok = window.confirm('¿Eliminar usuario?');
    if (ok) {
      this.usuarioService.delete(id).pipe(
        switchMap(() => this.usuarioService.findAll()),
        tap(data => this.usuarioService.setListChange(data)),
        tap(() => this.usuarioService.setMessageChange('USUARIO ELIMINADO'))
      ).subscribe();
    }
  }
}