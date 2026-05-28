import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductoService }  from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { ProveedorService } from '../../services/proveedor.service';
import { Producto }  from '../../model/producto';
import { Categoria } from '../../model/categoria';
import { Proveedor } from '../../model/proveedor';

@Component({
    selector: 'app-producto',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './producto.component.html',
    styleUrl: './producto.component.css'
})
export class ProductoComponent implements OnInit {
    productos:   Producto[]  = [];   
    categorias:  Categoria[] = [];   
    proveedores: Proveedor[] = [];   

    productoForm: FormGroup;
    isEditing  = false;
    editingId: number | null = null;

    private fb               = inject(FormBuilder);
    private service          = inject(ProductoService);
    private categoriaService = inject(CategoriaService);
    private proveedorService = inject(ProveedorService);

    constructor() {
        this.productoForm = this.fb.group({
            nombre:           ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
            descripcion:      ['', [Validators.required, Validators.maxLength(500)]],
            codigoBarra:      ['', [Validators.maxLength(50)]],
            precioCompra:     [0,  [Validators.required, Validators.min(0.01)]],
            precioVenta:      [0,  [Validators.required, Validators.min(0.01)]],
            stock:            [0,  [Validators.required, Validators.min(0)]],
            stockMinimo:      [20, [Validators.required, Validators.min(0)]],
            fechaVencimiento: [''],
            idCategoria:      [0,  [Validators.required, Validators.min(1)]],
            idProveedor:      [0,  [Validators.required, Validators.min(1)]],
            estado:           [true]
        });
    }

    ngOnInit(): void {
        this.cargarProductos();
        this.cargarCategorias();
        this.cargarProveedores();
    }

    cargarProductos(): void {
        this.service.findAll().subscribe(data => this.productos = data);   
    }

    cargarCategorias(): void {
        this.categoriaService.findAll().subscribe(data => this.categorias = data);  
    }

    cargarProveedores(): void {
        this.proveedorService.findAll().subscribe(data => this.proveedores = data); 
    }

    guardar(): void {
        if (this.productoForm.invalid) {
            alert('Corrige los errores del formulario');
            return;
        }
        const producto: Producto = this.productoForm.value;
        if (this.isEditing && this.editingId) {
            this.service.update(this.editingId, producto).subscribe(() => {
                this.cargarProductos();
                this.resetForm();
            });
        } else {
            this.service.save(producto).subscribe(() => {
                this.cargarProductos();
                this.resetForm();
            });
        }
    }

    editar(prod: Producto): void {
        this.isEditing = true;
        this.editingId = prod.idProducto;
        this.productoForm.patchValue({
            nombre:           prod.nombre,
            descripcion:      prod.descripcion,
            codigoBarra:      prod.codigoBarra,
            precioCompra:     prod.precioCompra,
            precioVenta:      prod.precioVenta,
            stock:            prod.stock,
            stockMinimo:      prod.stockMinimo,
            fechaVencimiento: prod.fechaVencimiento,
            idCategoria:      prod.idCategoria,
            idProveedor:      prod.idProveedor,
            estado:           prod.estado
        });
    }

    eliminar(id: number): void {
        if (confirm('¿Eliminar producto? Esta acción no se puede deshacer.')) {
            this.service.delete(id).subscribe(() => this.cargarProductos());
        }
    }

    resetForm(): void {
        this.productoForm.reset({
            estado:       true,
            precioCompra: 0,
            precioVenta:  0,
            stock:        0,
            stockMinimo:  20,
            idCategoria:  0,
            idProveedor:  0
        });
        this.isEditing = false;
        this.editingId = null;
    }
}