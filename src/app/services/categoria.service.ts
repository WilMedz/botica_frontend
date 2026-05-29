import {Injectable} from '@angular/core';
import {Categoria} from '../model/categoria';
import {GenericSignalService} from './generic-signal.service';
import {environment} from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService extends GenericSignalService<Categoria> {
  protected override url: string = `${environment.apiUrl}/categorias`;
}
