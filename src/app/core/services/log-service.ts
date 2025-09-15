import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LogDTORespuesta } from '../models/Log/DTOResponse/LogDTORespuesta';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private url = 'http://localhost:8080/api/unicauca/fiet/consejo/logs';

  constructor(private http: HttpClient) { }

  getLogs(): Observable<LogDTORespuesta[]> {
    return this.http.get<LogDTORespuesta[]>(this.url);
  }
}
