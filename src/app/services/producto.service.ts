import { Injectable } from '@angular/core';
import { GenericSignalService } from './generic-signal.service';
import { Producto } from '../model/producto';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class ProductoService extends GenericSignalService<Producto> {
  protected override url = `${environment.apiUrl}/productos`;
}