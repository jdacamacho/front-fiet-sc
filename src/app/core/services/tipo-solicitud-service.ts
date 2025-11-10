import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment';
import { TipoSolicitudDTORespuesta } from '../models/TipoSolicitud/DTOResponse/TipoSolicitudDTORespuesta';
import { TipoSolicitudDTOPeticion } from '../models/TipoSolicitud/DTORequest/TipoSolicitudDTOPeticion';
import { PaginacionRespuestaDTO } from '../models/PaginacionRespuestaDTO';

@Injectable({
  providedIn: 'root'
})
export class TipoSolicitudService {
  private url = `${environment.apiUrl}/tipos/solicitudes`;

  constructor(private http: HttpClient) {}

  getTiposSolicitud(): Observable<TipoSolicitudDTORespuesta[]> {
    return this.http.get<TipoSolicitudDTORespuesta[]>(`${this.url}`);
  }

  getTipoSolicitud(uuidTipoSolicitud: string): Observable<TipoSolicitudDTORespuesta> {
    return this.http.get<TipoSolicitudDTORespuesta>(`${this.url}/${uuidTipoSolicitud}`);
  }

  getTiposSolicitudPaginado(pagina: number, tamanio: number): Observable<PaginacionRespuestaDTO<TipoSolicitudDTORespuesta>> {
    return this.http.get<PaginacionRespuestaDTO<TipoSolicitudDTORespuesta>>(
      `${this.url}/paginado?pagina=${pagina}&tamanio=${tamanio}`
    );
  }

  getTiposSolicitudFiltrado(nombreSolicitud: string, funcionario: string, pagina: number, tamanio: number):
    Observable<PaginacionRespuestaDTO<TipoSolicitudDTORespuesta>> {
    const params = new URLSearchParams();

    if (nombreSolicitud && nombreSolicitud.trim() !== '') {
      params.append('nombreSolicitud', nombreSolicitud.trim());
    }

    if (funcionario && funcionario.trim() !== '') {
      params.append('funcionario', funcionario.trim());
    }

    params.append('pagina', pagina.toString());
    params.append('tamanio', tamanio.toString());

    return this.http.get<PaginacionRespuestaDTO<TipoSolicitudDTORespuesta>>(
      `${this.url}/filtro?${params.toString()}`
    );
  }

  crearTipoSolicitud(peticion: TipoSolicitudDTOPeticion): Observable<TipoSolicitudDTORespuesta> {
    return this.http.post<TipoSolicitudDTORespuesta>(`${this.url}`, peticion);
  }

  crearTiposSolicitudDesdeArchivo(file: File): Observable<TipoSolicitudDTORespuesta[]> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<TipoSolicitudDTORespuesta[]>(`${this.url}/cargar/archivo`, formData);
  }

  actualizarTipoSolicitud(uuidTipoSolicitud: string, peticion: TipoSolicitudDTOPeticion): Observable<TipoSolicitudDTORespuesta> {
    return this.http.put<TipoSolicitudDTORespuesta>(`${this.url}/${uuidTipoSolicitud}`, peticion);
  }
}
