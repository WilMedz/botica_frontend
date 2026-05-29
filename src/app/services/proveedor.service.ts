import { Injectable } from '@angular/core';
import { GenericSignalService } from './generic-signal.service';
import { Proveedor } from '../model/proveedor';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class ProveedorService extends GenericSignalService<Proveedor> {
  protected override url = `${environment.apiUrl}/proveedores`;
}