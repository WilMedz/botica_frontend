import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Producto } from '../model/producto';

@Injectable({ providedIn: 'root' })
export class ProductoService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl + '/productos';

    findAll(): Observable<Producto[]> {
        return this.http.get<Producto[]>(this.apiUrl);
    }

    findById(id: number): Observable<Producto> {
        return this.http.get<Producto>(`${this.apiUrl}/${id}`);
    }

    save(producto: Producto): Observable<Producto> {
        return this.http.post<Producto>(this.apiUrl, producto);
    }

    update(id: number, producto: Producto): Observable<Producto> {
        return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}