import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SolicitudDTORespuesta } from '../models/Solicitudes/DTOResponse/SolicitudDTORespuesta';
import { PaginacionRespuestaDTO } from '../models/PaginacionRespuestaDTO';
import { OrdenDelDiaDTORespuesta } from '../models/Solicitudes/DTOResponse/OrdenDelDiaDTORespuesta';
import { OrdenDelDiaDTOPeticion } from '../models/Solicitudes/DTORequest/OrdenDelDiaDTOPeticion';
import { SolicitudDTOPeticion } from '../models/Solicitudes/DTORequest/SolicitudDTOPeticion';
import { SolicitudActualizarDTOPeticion } from '../models/Solicitudes/DTORequest/SolicitudActualizarDTOPeticion';
import { SolicitudPublicaDTOPeticion } from '../models/Solicitudes/DTORequest/SolicitudPublicaDTOPeticion';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  private url = `${environment.apiUrl}/solicitudes`;

  constructor(private http: HttpClient) { }

  getOrdenesDelDia(): Observable<OrdenDelDiaDTORespuesta[]> {
    return this.http.get<OrdenDelDiaDTORespuesta[]>(`${this.url}/orden-del-dia`);
  }

  getOrdenesDelDiaPaginado(pagina: number, tamanio: number): Observable<PaginacionRespuestaDTO<OrdenDelDiaDTORespuesta>> {
    return this.http.get<PaginacionRespuestaDTO<OrdenDelDiaDTORespuesta>>(
      `${this.url}/orden-del-dia/paginado?pagina=${pagina}&tamanio=${tamanio}`
    );
  }

  getOrdenDelDia(uuidOrdenDelDia: string): Observable<OrdenDelDiaDTORespuesta> {
    return this.http.get<OrdenDelDiaDTORespuesta>(`${this.url}/orden-del-dia/${uuidOrdenDelDia}`);
  }

  crearOrdenDelDia(peticion: OrdenDelDiaDTOPeticion): Observable<OrdenDelDiaDTORespuesta> {
    return this.http.post<OrdenDelDiaDTORespuesta>(`${this.url}/orden-del-dia`, peticion);
  }

  actualizarOrdenDelDia(uuidOrdenDelDia: string, peticion: OrdenDelDiaDTOPeticion): Observable<OrdenDelDiaDTORespuesta> {
    return this.http.put<OrdenDelDiaDTORespuesta>(`${this.url}/orden-del-dia/${uuidOrdenDelDia}`, peticion);
  }

  buscarOrdenesDelDia(filtro: string, pagina: number, tamanio: number):
    Observable<PaginacionRespuestaDTO<OrdenDelDiaDTORespuesta>> {

    return this.http.get<PaginacionRespuestaDTO<OrdenDelDiaDTORespuesta>>(
      `${this.url}/orden-del-dia/buscar?filtro=${filtro}&pagina=${pagina}&tamanio=${tamanio}`
    );
  }

  getSolicitudesPorOrdenDelDia(uuidOrdenDelDia: string): Observable<SolicitudDTORespuesta[]> {
    return this.http.get<SolicitudDTORespuesta[]>(`${this.url}/orden-del-dia/${uuidOrdenDelDia}/solicitudes`);
  }

  getSolicitudes(): Observable<SolicitudDTORespuesta[]> {
    return this.http.get<SolicitudDTORespuesta[]>(`${this.url}`);
  }

  getSolicitudesPaginado(pagina: number, tamanio: number):
    Observable<PaginacionRespuestaDTO<SolicitudDTORespuesta>> {

    return this.http.get<PaginacionRespuestaDTO<SolicitudDTORespuesta>>(
      `${this.url}/paginado?pagina=${pagina}&tamanio=${tamanio}`
    );
  }

  getSolicitud(uuidSolicitud: string): Observable<SolicitudDTORespuesta> {
    return this.http.get<SolicitudDTORespuesta>(`${this.url}/${uuidSolicitud}`);
  }

  enviarSolicitud(peticion: SolicitudDTOPeticion, archivos: File[]): Observable<SolicitudDTORespuesta> {
    const formData = new FormData();
    formData.append("solicitud", new Blob([JSON.stringify(peticion)], { type: 'application/json' }));

    archivos.forEach(file => formData.append('archivos', file));

    return this.http.post<SolicitudDTORespuesta>(`${this.url}`, formData);
  }

  enviarSolicitudPublica(peticion: SolicitudPublicaDTOPeticion, archivos: File[]): Observable<SolicitudDTORespuesta> {
    const formData = new FormData();
    formData.append("solicitud", new Blob([JSON.stringify(peticion)], { type: 'application/json' }));

    archivos.forEach(file => formData.append('archivos', file));

    return this.http.post<SolicitudDTORespuesta>(`${this.url}/public`, formData);
  }

  actualizarSolicitud(uuidSolicitud: string, peticion: SolicitudActualizarDTOPeticion):
    Observable<SolicitudDTORespuesta> {

    return this.http.put<SolicitudDTORespuesta>(`${this.url}/${uuidSolicitud}`, peticion);
  }

  getSolicitudesPorFuncionario(uuidFuncionario: string, pagina: number, tamanio: number):
    Observable<PaginacionRespuestaDTO<SolicitudDTORespuesta>> {

    return this.http.get<PaginacionRespuestaDTO<SolicitudDTORespuesta>>(
      `${this.url}/funcionario/${uuidFuncionario}?pagina=${pagina}&tamanio=${tamanio}`
    );
  }

  getSolicitudesPorEstado(estado: string): Observable<SolicitudDTORespuesta[]> {
    return this.http.get<SolicitudDTORespuesta[]>(`${this.url}/estado?estado=${estado}`);
  }

  buscarSolicitudesPorNombre(filtro: string, pagina: number, tamanio: number):
    Observable<PaginacionRespuestaDTO<SolicitudDTORespuesta>> {

    return this.http.get<PaginacionRespuestaDTO<SolicitudDTORespuesta>>(
      `${this.url}/buscar?filtro=${filtro}&pagina=${pagina}&tamanio=${tamanio}`
    );
  }

  buscarSolicitudesPorNombreYFuncionario(uuidFuncionario: string, filtro: string, pagina: number,tamanio: number): Observable<PaginacionRespuestaDTO<SolicitudDTORespuesta>> {
    return this.http.get<PaginacionRespuestaDTO<SolicitudDTORespuesta>>(
      `${this.url}/fun/buscar/?uuidFuncionario=${uuidFuncionario}&filtro=${filtro}&pagina=${pagina}&tamanio=${tamanio}`
    );
  }

  getOrdenesDelDiaPorEstado(estado: boolean): Observable<OrdenDelDiaDTORespuesta[]> {
    return this.http.get<OrdenDelDiaDTORespuesta[]>(
      `${this.url}/orden-del-dia/estado?estado=${estado}`
    );
  }

  descargarAnexosOrdenDelDia(uuidOrden: string, nombreOrden: string): Observable<Blob> {
    const params = { uuidOrden, nombreOrden };
    return this.http.get(`${this.url}/anexos/download`, {
      params,
      responseType: 'blob'
    });
  }

}