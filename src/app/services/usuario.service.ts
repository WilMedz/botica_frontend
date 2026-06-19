import {Injectable} from '@angular/core';
import {Usuario} from '../model/usuario';
import {GenericSignalService} from './generic-signal.service';
import {environment} from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService extends GenericSignalService<Usuario> {
  protected override url: string = `${environment.HOST}/usuarios`;

  getMe() {
    return this.http.get<Usuario>(`${this.url}/me`);
  }
}

