import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { SesionDTOPeticion } from '../models/Sesión/DTORequest/SesionDTOPeticion';
import { UsuarioTokenizadoDTORespuesta } from '../models/Sesión/DTPResponse/UsuarioTokenizadoDTORespuesta';
import { UsuarioDTORespuesta } from '../models/Usuario/DTOResponse/UsuarioDTORespuesta';
import { environment } from '../../../enviroments/environment';
import { UsuariosService } from './usuarios-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = `${environment.apiUrl}/sesiones`;

  private usuarioSubject = new BehaviorSubject<UsuarioDTORespuesta | null>(null);
  public usuario$ = this.usuarioSubject.asObservable();

  private usuarioCargadoSubject = new BehaviorSubject<boolean>(false);
  public usuarioCargado$ = this.usuarioCargadoSubject.asObservable();

  constructor(
    private http: HttpClient,
    private usuariosService: UsuariosService
  ) {}

  inicializarUsuario(): Observable<UsuarioDTORespuesta | null> {

    if (typeof window === 'undefined') {
      this.usuarioCargadoSubject.next(true);
      return of(null);
    }

    const uuid = localStorage.getItem('currentUser');

    if (!uuid) {
      this.usuarioSubject.next(null);
      this.usuarioCargadoSubject.next(true);
      return of(null);
    }

    return this.usuariosService.getUsuario(uuid).pipe(
      tap(usuario => {
        this.usuarioSubject.next(usuario);
        this.usuarioCargadoSubject.next(true);
      }),
      catchError(() => {
        this.logout();
        this.usuarioCargadoSubject.next(true);
        return of(null);
      })
    );
  }


  login(credentials: SesionDTOPeticion): Observable<UsuarioDTORespuesta> {
    return this.http.post<UsuarioTokenizadoDTORespuesta>(this.url, credentials).pipe(
      tap(tokenizado => {
        localStorage.setItem('currentUser', tokenizado.uuidUsuario);
        localStorage.setItem('authToken', tokenizado.token);
      }),
      switchMap(tokenizado =>
        this.usuariosService.getUsuario(tokenizado.uuidUsuario)
      ),
      tap(usuario => this.usuarioSubject.next(usuario))
    );
  }


  logout(): void {
    this.usuarioSubject.next(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  }

  getUsuarioActual(): UsuarioDTORespuesta | null {
    return this.usuarioSubject.getValue();
  }
}
