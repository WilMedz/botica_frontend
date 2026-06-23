import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { RolService } from '../../services/rol.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private rolService = inject(RolService);

  usuario = this.authService.usuarioActual;
  mensajeExito = signal<string>('');
  nombreRol = signal<string>('');
  modoEdicion = signal<boolean>(false);

  perfilForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
    apellido: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.minLength(4), Validators.maxLength(200)]],
  });

  constructor() {
    const u = this.usuario();
    if (u) {
      this.perfilForm.patchValue({
        nombre: u.nombre,
        apellido: u.apellido,
        email: u.email,
      });
    }

    this.rolService.findAll().subscribe(roles => {
      const rol = roles.find(r => r.idRol === u?.idRol);
      this.nombreRol.set(rol ? rol.nombre : '');
    })
  }

  guardarPerfil(): void {
    if (this.perfilForm.invalid) return;
    const u = this.usuario();
    if (!u) return;

    const { nombre, apellido, email, password } = this.perfilForm.value;
    const datosActualizados: any = { ...u, nombre, apellido, email };

    if (password) {
      datosActualizados.password = password;
    }

    this.usuarioService.update(u.idUsuario, datosActualizados).subscribe({
      next: (data) => {
        this.authService.setUsuarioActual(data);
        this.mensajeExito.set('Datos actualizados correctamente');
        this.modoEdicion.set(false);
        this.perfilForm.patchValue({ password: '' });
      },
      error: (err) => console.error('Error al actualizar perfil:', err)
    });
  }

  cerrar(): void {
    this.router.navigate(['/pages/dashboard']);
  }
}