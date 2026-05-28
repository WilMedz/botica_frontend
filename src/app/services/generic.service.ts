import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export abstract class GenericService<T, ID> {
  protected http = inject(HttpClient);
  abstract url: string;

  // Resuelve el error NG0900 desenvolviendo el array de HATEOAS
     findAll(): Observable<T[]> {
    return this.http.get<any>(this.url).pipe(
      map((response) => {
        if (response && response._embedded) {
          const keys = Object.keys(response._embedded);
          if (keys.length > 0) {
            const firstKey = keys[0]; // <-- Asegúrate de que tenga el [0] para evitar el error ts(2538)
            return response._embedded[firstKey]; 
          }
        }
        return Array.isArray(response) ? response : [];
      })
    );
  }



  findById(id: ID): Observable<T> {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  save(resource: T): Observable<T> {
    return this.http.post<T>(this.url, resource);
  }

  update(id: ID, resource: T): Observable<T> {
    return this.http.put<T>(`${this.url}/${id}`, resource);
  }

  delete(id: ID): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
