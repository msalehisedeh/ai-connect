import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RagService {

  private destination = 'http://localhost:3000/api/query';

  constructor(private http: HttpClient) {}

  queryRag(question: string): Observable<any> {
    return this.http.post<any>(this.destination, { question });
  }
}
