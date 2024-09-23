import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  private data: any = null;

  constructor(private http: HttpClient) {}

  fetchData(): Observable<any> {
    if (this.data) {
      return of(this.data);
    }

    return this.http.get('http://localhost:3000/budget').pipe(
      tap((res) => (this.data = res))
    );
  }

  getData(): any {
    return this.data;
  }
}
