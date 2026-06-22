import { Injectable, signal, computed, inject } from '@angular/core';
import { Usuario } from '../model/usuario';
import { UsuarioService } from './usuario.service';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuarioService = inject(UsuarioService);

  public usuarioActual = signal<Usuario | null>(null);

  public esAdministrador = computed(() => {
    const usuario = this.usuarioActual();
    return usuario?.idRol === 1;
  });

  cargarUsuarioActual() {
    return this.usuarioService.getMe();
  }
  setUsuarioActual(usuario: Usuario) {
    this.usuarioActual.set(usuario);
  }

  logout() {
    sessionStorage.removeItem(environment.TOKEN_NAME);
    this.usuarioActual.set(null);
  }
}
