import {Injectable} from '@angular/core';
import {MovimientoInventario} from '../model/movimiento-inventario';
import {GenericSignalService} from './generic-signal.service';
import {environment} from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MovimientoInventarioService extends GenericSignalService<MovimientoInventario> {
  protected override url: string = `${environment.apiUrl}/movimientos-inventario`;
}
