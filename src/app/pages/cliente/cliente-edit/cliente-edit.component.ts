import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Cliente } from '../../../model/cliente';
import { switchMap, tap } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cliente-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './cliente-edit.component.html',
  styleUrl: './cliente-edit.component.css'
})
export class ClienteEditComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly clienteService = inject(ClienteService);

  protected $form = signal(new FormGroup({
    idCliente: new FormControl<number | null>(null),
    nombre:    new FormControl<string>('', [Validators.required, Validators.maxLength(100)]),
    apellido:  new FormControl<string>('', [Validators.required, Validators.maxLength(100)]),
    documento: new FormControl<string>('', [Validators.maxLength(15)]),
    telefono:  new FormControl<string>('', [Validators.maxLength(20)]),
    email:     new FormControl<string>('', [Validators.email, Validators.maxLength(100)]),
    estado:    new FormControl<boolean>(true),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());

  constructor() {
    effect(() => {
      const id = this.$id();
      if (id) {
        this.clienteService.findById(id).subscribe(data => this.$form().patchValue(data));
      }
    });
  }

  operate() {
    const form = this.$form();
    if (form.invalid) return;

    const isEdit = this.$isEdit();
    const id = this.$id();

    const cliente: Cliente = form.value as Cliente;

    const operation$ = isEdit
      ? this.clienteService.update(id, cliente)
      : this.clienteService.save(cliente);

    operation$.pipe(
      switchMap(() => this.clienteService.findAll()),
      tap(data => this.clienteService.setListChange(data)),
      tap(() => this.clienteService.setMessageChange(isEdit ? 'ACTUALIZADO' : 'CREADO'))
    )
    .subscribe(() => {
      this.router.navigate(['/pages/clientes']);
    });
  }
}
