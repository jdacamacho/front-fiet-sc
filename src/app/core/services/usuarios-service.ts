import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioDTORespuesta } from '../models/Usuario/DTOResponse/UsuarioDTORespuesta';
import { UsuarioLivianoDTORespuesta } from '../models/Usuario/DTOResponse/UsuarioLivianoDTORespuesta';
import { UsuarioDTOPeticion } from '../models/Usuario/DTORequest/UsuarioDTOPeticion';
import { UsuarioActualizarDTOPeticion } from '../models/Usuario/DTORequest/UsuarioActualizarDTOPeticion';
import { CambioContraseñaDTOPeticion } from '../models/Usuario/DTORequest/CambioContraseñaDTOPeticion';
import { TipoUsuarioDTORespuesta } from '../models/Usuario/DTOResponse/TipoUsuarioDTORespuesta';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private url = 'http://localhost:8080/api/unicauca/fiet/consejo/usuarios';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqcGVyZXoiLCJpYXQiOjE3NTg2Njc4ODUsImV4cCI6MTc1ODY3ODY4NX0.OcVneF8_HJNPVXNaYMfhHwL1iVqGqngFuS1-VRbuBsE'; 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getTiposUsuario(): Observable<TipoUsuarioDTORespuesta[]> {
    return this.http.get<TipoUsuarioDTORespuesta[]>(`${this.url}/tipos`, {
      headers: this.getHeaders()
    });
  }

  getUsuariosPaginado(pagina: number, tamanio: number): Observable<UsuarioLivianoDTORespuesta[]> {
    return this.http.get<UsuarioLivianoDTORespuesta[]>(`${this.url}/paginado?pagina=${pagina}&tamanio=${tamanio}`, {
      headers: this.getHeaders()
    });
  }

  getUsuarios(): Observable<UsuarioLivianoDTORespuesta[]> {
    return this.http.get<UsuarioLivianoDTORespuesta[]>(`${this.url}`, {
      headers: this.getHeaders()
    });
  }

  getUsuario(uuidUsuario: string): Observable<UsuarioDTORespuesta> {
    return this.http.get<UsuarioDTORespuesta>(`${this.url}/${uuidUsuario}`, {
      headers: this.getHeaders()
    });
  }

  crearUsuario(peticion: UsuarioDTOPeticion, tipoUsuario: string): Observable<UsuarioDTORespuesta> {
    return this.http.post<UsuarioDTORespuesta>(`${this.url}?tipoUsuario=${tipoUsuario}`, peticion, {
      headers: this.getHeaders()
    });
  }

  crearUsuariosDesdeArchivo(file: File): Observable<UsuarioDTORespuesta[]> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<UsuarioDTORespuesta[]>(`${this.url}/cargar/archivo`, formData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getHeaders().get('Authorization')}`
      })
    });
  }

  actualizarUsuario(uuidUsuario: string, peticion: UsuarioActualizarDTOPeticion): Observable<UsuarioDTORespuesta> {
    return this.http.put<UsuarioDTORespuesta>(`${this.url}/${uuidUsuario}`, peticion, {
      headers: this.getHeaders()
    });
  }

  cambiarContraseña(uuidUsuario: string, peticion: CambioContraseñaDTOPeticion): Observable<void> {
    return this.http.patch<void>(`${this.url}/${uuidUsuario}`, peticion, {
      headers: this.getHeaders()
    });
  }
}
