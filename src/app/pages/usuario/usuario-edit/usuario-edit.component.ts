import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { RolService } from '../../../services/rol.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Usuario } from '../../../model/usuario';
import { Rol } from '../../../model/rol';
import { switchMap, tap } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    RouterLink
  ],
  templateUrl: './usuario-edit.component.html',
  styleUrl: './usuario-edit.component.css'
})
export class UsuarioEditComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usuarioService = inject(UsuarioService);
  private readonly rolService = inject(RolService);

  protected roles = signal<Rol[]>([]);

  protected $form = signal(new FormGroup({
    idUsuario: new FormControl<number | null>(null),
    nombre:    new FormControl<string>('', [Validators.required, Validators.maxLength(100)]),
    apellido:  new FormControl<string>('', [Validators.required, Validators.maxLength(100)]),
    username:  new FormControl<string>('', [Validators.required, Validators.maxLength(80)]),
    password:  new FormControl<string>('', [Validators.required, Validators.maxLength(200)]),
    email:     new FormControl<string>('', [Validators.email, Validators.maxLength(120)]),
    estado:    new FormControl<boolean>(true),
    idRol:     new FormControl<number | null>(null, [Validators.required]),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());

  constructor() {
    this.rolService.findAll().subscribe(data => this.roles.set(data));

    effect(() => {
      const id = this.$id();
      if (id) {
        this.usuarioService.findById(id).subscribe(data => {
          this.$form().patchValue(data);
          // Al editar, la contraseña no es estrictamente requerida de ingresar de nuevo (puede mantenerse la actual)
          this.$form().get('password')?.setValidators([Validators.maxLength(200)]);
          this.$form().get('password')?.updateValueAndValidity();
        });
      }
    });
  }

  operate() {
    const form = this.$form();
    if (form.invalid) return;

    const isEdit = this.$isEdit();
    const id = this.$id();

    const usuario: Usuario = form.value as Usuario;

    const operation$ = isEdit
      ? this.usuarioService.update(id, usuario)
      : this.usuarioService.save(usuario);

    operation$.pipe(
      switchMap(() => this.usuarioService.findAll()),
      tap(data => this.usuarioService.setListChange(data)),
      tap(() => this.usuarioService.setMessageChange(isEdit ? 'USUARIO ACTUALIZADO' : 'USUARIO CREADO'))
    )
    .subscribe(() => {
      this.router.navigate(['/usuarios']);
    });
  }
}
