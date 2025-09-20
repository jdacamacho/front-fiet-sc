import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RolDTORespuesta } from '../models/Rol/DTOResponse/RolDTORespuesta';
import { RolDTOPeticion } from '../models/Rol/DTORequest/RolDTOPeticion';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private url = 'http://localhost:8080/api/unicauca/fiet/consejo/roles';

  constructor(private http: HttpClient) { }

  getRoles(): Observable<RolDTORespuesta[]> {
    return this.http.get<RolDTORespuesta[]>(this.url);
  }

  getRolesPaginados(pagina: number, tamanio: number): Observable<RolDTORespuesta[]> {
    return this.http.get<RolDTORespuesta[]>(
      `${this.url}/paginado?pagina=${pagina}&tamanio=${tamanio}`
    );
  }

  getRol(uuidRol: string): Observable<RolDTORespuesta> {
    return this.http.get<RolDTORespuesta>(`${this.url}/${uuidRol}`);
  }

  actualizarRol(uuidRol: string, rol: RolDTOPeticion): Observable<RolDTORespuesta> {
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqcGVyZXoiLCJpYXQiOjE3NTgzOTQ2NTQsImV4cCI6MTc1ODQwNTQ1NH0.u1V7ST1_8Eo54frqB9D5C_WIe5rEH8_w5DrOBG_k1UU'; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<RolDTORespuesta>(`${this.url}/${uuidRol}`, rol, { headers });
  }
}
