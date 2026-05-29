import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export abstract class GenericService<T> {
  protected http = inject(HttpClient);
  protected abstract url: string;

  findAll(): Observable<T[]> {
    return this.http.get<any>(this.url).pipe(
      map((response) => {
        if (response && response._embedded) {
          const keys = Object.keys(response._embedded);
          if (keys.length > 0) {
            return response._embedded[keys[0]];
          }
        }
        return Array.isArray(response) ? response : [];
      })
    );
  }

  findById(id: number): Observable<T> {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  save(t: T): Observable<T> {
    return this.http.post<T>(this.url, t);
  }

  update(id: number, t: T): Observable<T> {
    return this.http.put<T>(`${this.url}/${id}`, t);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}