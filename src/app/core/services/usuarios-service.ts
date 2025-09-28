import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioDTORespuesta } from '../models/Usuario/DTOResponse/UsuarioDTORespuesta';
import { UsuarioLivianoDTORespuesta } from '../models/Usuario/DTOResponse/UsuarioLivianoDTORespuesta';
import { UsuarioDTOPeticion } from '../models/Usuario/DTORequest/UsuarioDTOPeticion';
import { UsuarioActualizarDTOPeticion } from '../models/Usuario/DTORequest/UsuarioActualizarDTOPeticion';
import { CambioContraseñaDTOPeticion } from '../models/Usuario/DTORequest/CambioContraseñaDTOPeticion';
import { TipoUsuarioDTORespuesta } from '../models/Usuario/DTOResponse/TipoUsuarioDTORespuesta';
import { environment } from '../../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private url = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  getTiposUsuario(): Observable<TipoUsuarioDTORespuesta[]> {
    return this.http.get<TipoUsuarioDTORespuesta[]>(`${this.url}/tipos`);
  }

  getUsuariosPaginado(pagina: number, tamanio: number): Observable<UsuarioLivianoDTORespuesta[]> {
    return this.http.get<UsuarioLivianoDTORespuesta[]>(`${this.url}/paginado?pagina=${pagina}&tamanio=${tamanio}`);
  }

  getUsuarios(): Observable<UsuarioLivianoDTORespuesta[]> {
    return this.http.get<UsuarioLivianoDTORespuesta[]>(`${this.url}`);
  }

  getUsuario(uuidUsuario: string): Observable<UsuarioDTORespuesta> {
    return this.http.get<UsuarioDTORespuesta>(`${this.url}/${uuidUsuario}`);
  }

  crearUsuario(peticion: UsuarioDTOPeticion, tipoUsuario: string): Observable<UsuarioDTORespuesta> {
    return this.http.post<UsuarioDTORespuesta>(`${this.url}?tipoUsuario=${tipoUsuario}`, peticion);
  }

  crearUsuariosDesdeArchivo(file: File): Observable<UsuarioDTORespuesta[]> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UsuarioDTORespuesta[]>(`${this.url}/cargar/archivo`, formData);
  }

  actualizarUsuario(uuidUsuario: string, peticion: UsuarioActualizarDTOPeticion): Observable<UsuarioDTORespuesta> {
    return this.http.put<UsuarioDTORespuesta>(`${this.url}/${uuidUsuario}`, peticion);
  }

  cambiarContraseña(uuidUsuario: string, peticion: CambioContraseñaDTOPeticion): Observable<void> {
    return this.http.patch<void>(`${this.url}/${uuidUsuario}`, peticion);
  }
}
