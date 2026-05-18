import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProveedorService } from '../../services/proveedor.service';
import { Proveedor } from '../../model/proveedor';

@Component({
    selector: 'app-proveedor',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './proveedor.component.html',
    styleUrl: './proveedor.component.css'
})
export class ProveedorComponent implements OnInit {
    proveedores: Proveedor[] = [];
    proveedorForm: FormGroup;
    isEditing = false;
    editingId: number | null = null;

    private fb = inject(FormBuilder);
    private service = inject(ProveedorService);

    constructor() {
        this.proveedorForm = this.fb.group({
            razonSocial: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
            ruc: ['', [Validators.pattern('\\d{11}')]],
            direccion: ['', [Validators.maxLength(150)]],
            telefono: ['', [Validators.pattern('\\d{9}')]],
            email: ['', [Validators.email, Validators.maxLength(100)]],
            estado: [true]
        });
    }

    ngOnInit(): void {
        this.cargarProveedores();
    }

    cargarProveedores(): void {
        this.service.findAll().subscribe(data => this.proveedores = data);
    }

    guardar(): void {
        if (this.proveedorForm.invalid) {
            alert('Corrige los errores del formulario');
            return;
        }
        const proveedor: Proveedor = this.proveedorForm.value;
        if (this.isEditing && this.editingId) {
            this.service.update(this.editingId, proveedor).subscribe(() => {
                this.cargarProveedores();
                this.resetForm();
            });
        } else {
            this.service.save(proveedor).subscribe(() => {
                this.cargarProveedores();
                this.resetForm();
            });
        }
    }

    editar(prov: Proveedor): void {
        this.isEditing = true;
        this.editingId = prov.idProveedor!;
        this.proveedorForm.patchValue({
            razonSocial: prov.razonSocial,
            ruc: prov.ruc,
            direccion: prov.direccion,
            telefono: prov.telefono,
            email: prov.email,
            estado: prov.estado
        });
    }

    eliminar(id: number): void {
        if (confirm('¿Eliminar proveedor?')) {
            this.service.delete(id).subscribe(() => this.cargarProveedores());
        }
    }

    resetForm(): void {
        this.proveedorForm.reset({ estado: true });
        this.isEditing = false;
        this.editingId = null;
    }
}