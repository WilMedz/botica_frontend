import {Injectable} from '@angular/core';
import {Rol} from '../model/rol';
import {GenericSignalService} from './generic-signal.service';
import {environment} from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RolService extends GenericSignalService<Rol> {
  protected override url: string = `${environment.apiUrl}/roles`;
}
