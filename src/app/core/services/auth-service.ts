import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
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

  constructor(private http: HttpClient, private usuariosService: UsuariosService) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedUuid = localStorage.getItem('currentUser');
      if (savedUuid) {
        this.usuariosService.getUsuario(savedUuid).subscribe({
          next: user => {
            this.usuarioSubject.next(user);
            this.usuarioCargadoSubject.next(true);
          },
          error: () => {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('authToken');
            this.usuarioSubject.next(null);
            this.usuarioCargadoSubject.next(true);
          }
        });
      } else {
        this.usuarioCargadoSubject.next(true);
      }
    } else {
      this.usuarioCargadoSubject.next(true);
    }
  }

  login(credentials: SesionDTOPeticion): Observable<UsuarioDTORespuesta> {
    return this.http.post<UsuarioTokenizadoDTORespuesta>(this.url, credentials).pipe(
      tap(tokenizado => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentUser', tokenizado.uuidUsuario);
          localStorage.setItem('authToken', tokenizado.token);
        }
      }),
      switchMap(tokenizado => 
        this.usuariosService.getUsuario(tokenizado.uuidUsuario) 
      ),
      tap(user => this.usuarioSubject.next(user))
    );
  }


  logout(): void {
    this.usuarioSubject.next(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('currentUser'); 
      localStorage.removeItem('authToken');   
    }
  }

  getUsuarioActual(): UsuarioDTORespuesta | null {
    return this.usuarioSubject.getValue();
  }
}
