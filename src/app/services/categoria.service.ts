import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Categoria } from '../model/categoria';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/categorias';

  findAll() {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  findById(id: number) {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  save(categoria: Categoria) {
    return this.http.post<Categoria>(this.apiUrl, categoria);
  }

  update(categoria: Categoria, id: number) {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}