import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {
  private baseUrl: string = environment.baseUrl;
  private username = '11188393';
  private password = '60-dayfreetrial';

  constructor(private http: HttpClient) { }

  Authors(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${this.username}:${this.password}`),
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${this.baseUrl}Authors`, { headers });
  }

  AddAuthor(authorData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${this.username}:${this.password}`)
    });

    return this.http.post<any>(`${this.baseUrl}Authors`, authorData, { headers });
  }

  deleteAuthorById(authorId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${this.username}:${this.password}`)
    });

    return this.http.delete<any>(`${this.baseUrl}Authors/${authorId}`, { headers });
  }
}
