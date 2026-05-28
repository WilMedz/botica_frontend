import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Proveedor } from '../model/proveedor';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class ProveedorService extends GenericService<Proveedor, number> {
   
    override url = `${environment.apiUrl}/proveedores`;
}
