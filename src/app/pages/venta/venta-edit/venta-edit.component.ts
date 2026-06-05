import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VentaService } from '../../../services/venta.service';
import { ClienteService } from '../../../services/cliente.service';
import { ProductoService } from '../../../services/producto.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Venta, DetalleVenta } from '../../../model/venta';
import { Cliente } from '../../../model/cliente';
import { Producto } from '../../../model/producto';
import { switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-venta-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    RouterLink
  ],
  templateUrl: './venta-edit.component.html',
  styleUrl: './venta-edit.component.css'
})
export class VentaEditComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly ventaService = inject(VentaService);
  private readonly clienteService = inject(ClienteService);
  private readonly productoService = inject(ProductoService);

  protected clientes = signal<Cliente[]>([]);
  protected productos = signal<Producto[]>([]);
  protected detalles = signal<DetalleVenta[]>([]);

  // Formulario principal
  protected $form = signal(new FormGroup({
    idVenta:     new FormControl<number | null>(null),
    idCliente:   new FormControl<number | null>(null, [Validators.required]),
    fecha:       new FormControl<string>(''),
    total:       new FormControl<number>({ value: 0, disabled: true }),
    estado:      new FormControl<string>('PAGADO', [Validators.required]),
    observacion: new FormControl<string>(''),
  }));

  // Formulario auxiliar para agregar productos al detalle
  protected detailForm = new FormGroup({
    idProducto:     new FormControl<number | null>(null, [Validators.required]),
    cantidad:       new FormControl<number>(1, [Validators.required, Validators.min(1)]),
    precioUnitario: new FormControl<number>(0, [Validators.required, Validators.min(0.01)])
  });

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());

  constructor() {
    this.clienteService.findAll().subscribe(data => this.clientes.set(data));
    this.productoService.findAll().subscribe(data => this.productos.set(data));

    // Si el usuario selecciona un producto en el formulario de detalle, pre-cargar su precio
    this.detailForm.get('idProducto')?.valueChanges.subscribe(prodId => {
      if (prodId) {
        const prod = this.productos().find(p => p.idProducto === prodId);
        if (prod) {
          this.detailForm.patchValue({
            precioUnitario: prod.precioVenta
          });
        }
      }
    });

    effect(() => {
      const id = this.$id();
      if (id) {
        this.ventaService.findById(id).subscribe(data => {
          this.$form().patchValue({
            idVenta: data.idVenta,
            idCliente: data.idCliente,
            fecha: data.fecha,
            total: data.total,
            estado: data.estado,
            observacion: data.observacion
          });

          // Cargar detalles y mapear nombres de productos para la UI
          if (data.detalles) {
            const mappedDetalles = data.detalles.map(d => {
              const prod = this.productos().find(p => p.idProducto === d.idProducto);
              return {
                ...d,
                nombreProducto: prod ? prod.nombre : `Producto ID: ${d.idProducto}`
              };
            });
            this.detalles.set(mappedDetalles);
          }
        });
      }
    });
  }

  agregarDetalle() {
    if (this.detailForm.invalid) return;

    const val = this.detailForm.value;
    const prod = this.productos().find(p => p.idProducto === val.idProducto);
    if (!prod) return;

    // Verificar stock disponible en creación
    if (!this.$isEdit() && prod.stock < val.cantidad!) {
      alert(`Stock insuficiente. Stock actual de ${prod.nombre}: ${prod.stock}`);
      return;
    }

    const subtotal = Number((val.cantidad! * val.precioUnitario!).toFixed(2));

    const nuevoDetalle: DetalleVenta = {
      idProducto: val.idProducto!,
      nombreProducto: prod.nombre,
      cantidad: val.cantidad!,
      precioUnitario: val.precioUnitario!,
      subtotal: subtotal
    };

    // Si ya existe el producto en el detalle, sumarle la cantidad
    const index = this.detalles().findIndex(d => d.idProducto === nuevoDetalle.idProducto);
    if (index > -1) {
      const current = this.detalles();
      current[index].cantidad += nuevoDetalle.cantidad;
      current[index].subtotal = Number((current[index].cantidad * current[index].precioUnitario).toFixed(2));
      this.detalles.set([...current]);
    } else {
      this.detalles.set([...this.detalles(), nuevoDetalle]);
    }

    this.recalcularTotal();
    this.detailForm.reset({ cantidad: 1, precioUnitario: 0 });
  }

  eliminarDetalle(index: number) {
    const current = this.detalles();
    current.splice(index, 1);
    this.detalles.set([...current]);
    this.recalcularTotal();
  }

  recalcularTotal() {
    const total = this.detalles().reduce((acc, item) => acc + item.subtotal, 0);
    this.$form().patchValue({ total: Number(total.toFixed(2)) });
  }

  operate() {
    const form = this.$form();
    if (form.invalid) return;

    if (this.detalles().length === 0) {
      alert('Debe agregar al menos un producto a la venta.');
      return;
    }

    const isEdit = this.$isEdit();
    const id = this.$id();

    const ventaFormValue = form.getRawValue();

    const venta: Venta = {
      idVenta: ventaFormValue.idVenta || undefined,
      idCliente: ventaFormValue.idCliente!,
      fecha: ventaFormValue.fecha || new Date().toISOString(),
      total: ventaFormValue.total!,
      estado: ventaFormValue.estado!,
      observacion: ventaFormValue.observacion || '',
      detalles: this.detalles()
    };

    const operation$ = isEdit
      ? this.ventaService.update(id, venta)
      : this.ventaService.save(venta);

    operation$.pipe(
      switchMap(() => this.ventaService.findAll()),
      tap(data => this.ventaService.setListChange(data)),
      tap(() => this.ventaService.setMessageChange(isEdit ? 'VENTA ACTUALIZADA' : 'VENTA REGISTRADA CON ÉXITO'))
    )
    .subscribe(() => {
      this.router.navigate(['/ventas']);
    });
  }
}
