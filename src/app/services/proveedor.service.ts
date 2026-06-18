import { Injectable } from '@angular/core';
import { GenericSignalService } from './generic-signal.service';
import { Proveedor } from '../model/proveedor';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class ProveedorService extends GenericSignalService<Proveedor> {
    // Definimos la URL obligatoria que pide la clase abstracta
    override url = `${environment.HOST}/proveedores`;

    constructor() {
        super();
        this.cargarDatosIniciales();
    }

    // Dispara el flujo y llena la señal reactiva centralizada
    cargarDatosIniciales(): void {
        this.findAll().subscribe({
            next: (data) => this.setListChange(data),
            error: (err) => console.error('Error al inicializar proveedores en la señal:', err)
        });
    }
}
