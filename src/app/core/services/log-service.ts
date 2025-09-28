import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LogDTORespuesta } from '../models/Log/DTOResponse/LogDTORespuesta';
import { environment } from '../../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private url = `${environment.apiUrl}/logs`;

  constructor(private http: HttpClient) { }

  getLogs(): Observable<LogDTORespuesta[]> {
    return this.http.get<LogDTORespuesta[]>(this.url);
  }
}
