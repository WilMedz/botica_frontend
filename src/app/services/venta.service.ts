import {Injectable} from '@angular/core';
import {Venta} from '../model/venta';
import {GenericSignalService} from './generic-signal.service';
import {environment} from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class VentaService extends GenericSignalService<Venta> {
  protected override url: string = `${environment.apiUrl}/ventas`;
}
