import { Injectable, signal } from '@angular/core';
import { GenericSignalService } from './generic-signal.service'; // Heredamos del servicio de señales de tu equipo
import { Menu } from '../model/menu';
import { environment } from '../../environments/environment.development';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends GenericSignalService<Menu> {

  override url: string = `${environment.HOST}/menus`;

  public menusSignal = signal<Menu[]>([]);

  getMenusByUser() {
    return this.http.get<Menu[]>(`${this.url}/user`).pipe(
      tap(data => this.menusSignal.set(data))
    );
  }
}
