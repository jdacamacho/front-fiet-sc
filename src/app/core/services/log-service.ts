import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LogDTORespuesta } from '../models/Log/DTOResponse/LogDTORespuesta';
import { environment } from '../../../enviroments/environment';
import { PaginacionRespuestaDTO } from '../models/PaginacionRespuestaDTO';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private url = `${environment.apiUrl}/logs`;

  constructor(private http: HttpClient) { }

  getLogs(): Observable<LogDTORespuesta[]> {
    return this.http.get<LogDTORespuesta[]>(this.url);
  }

  getLogsPaginado(pagina: number, tamanio: number): Observable<PaginacionRespuestaDTO<LogDTORespuesta>> {
    return this.http.get<PaginacionRespuestaDTO<LogDTORespuesta>>(
      `${this.url}/paginado?pagina=${pagina}&tamanio=${tamanio}`
    );
  }

  getLogsFiltrados(responsable: string, fecha: string, pagina: number, tamanio: number): Observable<PaginacionRespuestaDTO<LogDTORespuesta>> {
    const params = new URLSearchParams();

    if (responsable && responsable.trim() !== '') 
      params.append('responsable', responsable.trim());

    if (fecha && fecha.trim() !== '') 
      params.append('fecha', fecha.trim());

    params.append('pagina', pagina.toString());
    params.append('tamanio', tamanio.toString());

    return this.http.get<PaginacionRespuestaDTO<LogDTORespuesta>>(
      `${this.url}/filtro?${params.toString()}`
    );
  }
}
