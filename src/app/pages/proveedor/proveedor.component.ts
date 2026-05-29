import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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
    private cdr = inject(ChangeDetectorRef); 

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
        this.service.findAll().subscribe({
            next: (data) => {
                this.proveedores = data;
                this.cdr.detectChanges(); 
            },
            error: (err) => console.error('Error al recuperar datos HATEOAS:', err)
        });
    }

    guardar(): void {
        if (this.proveedorForm.invalid) {
            alert('Corrige los errores del formulario antes de continuar');
            return;
        }

        const proveedor: Proveedor = this.proveedorForm.value;

        if (this.isEditing && this.editingId) {
            this.service.update(this.editingId, proveedor).subscribe({
                next: () => {
                    this.cargarProveedores(); 
                    this.resetForm();
                },
                error: (err) => console.error('Error al actualizar proveedor:', err)
            });
        } else {
            this.service.save(proveedor).subscribe({
                next: () => {
                    this.cargarProveedores(); 
                    this.resetForm();
                },
                error: (err) => console.error('Error al guardar proveedor:', err)
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
        this.cdr.detectChanges(); 
    }

    eliminar(id: number): void {
        if (confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
            this.service.delete(id).subscribe({
                next: () => {
                    this.cargarProveedores(); 
                },
                error: (err) => console.error('Error al eliminar proveedor:', err)
            });
        }
    }

    resetForm(): void {
        this.proveedorForm.reset({ estado: true });
        this.isEditing = false;
        this.editingId = null;
        this.cdr.detectChanges(); 
    }
}
