import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoriaService } from '../../../services/categoria.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Categoria } from '../../../model/categoria';
import { switchMap, tap } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-categoria-edit',
  imports: [
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './categoria-edit.component.html',
  styleUrl: './categoria-edit.component.css'
})
export class CategoriaEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly categoriaService = inject(CategoriaService);

  protected $form = signal(new FormGroup({
    idCategoria:  new FormControl<number | null>(null),
    nombre:       new FormControl<string>('', [Validators.required, Validators.maxLength(20)]),
    descripcion:  new FormControl<string>('', [Validators.required]),
    estado:       new FormControl<boolean>(true),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());

  constructor() {
    effect(() => {
      const id = this.$id();
      if (id) {
        this.categoriaService.findById(id).subscribe(data => this.$form().patchValue(data));
      }
    });
  }

  operate() {
    const form = this.$form();
    const isEdit = this.$isEdit();
    const id = this.$id();

    const categoria: Categoria = form.value as Categoria;

    const operation$ = isEdit
      ? this.categoriaService.update(id, categoria)
      : this.categoriaService.save(categoria);

    operation$.pipe(
      switchMap(() => this.categoriaService.findAll()),
      tap(data => this.categoriaService.setListChange(data)),
      tap(() => this.categoriaService.setMessageChange(isEdit ? 'ACTUALIZADO' : 'CREADO'))
    )
    .subscribe(() => {
      this.router.navigate(['/categorias']);
    });
  }
}