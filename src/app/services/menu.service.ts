import { Injectable, signal } from '@angular/core';
import { GenericSignalService } from './generic-signal.service'; // Heredamos del servicio de señales de tu equipo
import { Menu } from '../model/menu';
import { environment } from '../../environments/environment.development';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends GenericSignalService<Menu> {

  // Implementamos la propiedad abstracta obligatoria requerida por el padre
  override url: string = `${environment.apiUrl}/menus`;

  // Signal reactivo para almacenar los menús en memoria
  public menusSignal = signal<Menu[]>([]);

  // NOTA: No declaramos constructor() porque el padre usa 'inject()' de forma nativa.

  // Método específico para consultar la API
  getMenusByUser() {
    return this.http.get<Menu[]>(`${this.url}/user`).pipe(
      tap(data => this.menusSignal.set(data))
    );
  }
}
