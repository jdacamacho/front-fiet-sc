import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UsuariosService } from '../../services/usuarios-service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router, private usuariosService: UsuariosService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    if (typeof window !== 'undefined' && window.localStorage) {
      const uuidUsuario = localStorage.getItem('currentUser');
      const expectedRoles = route.data['roles'] as string[];

      if (uuidUsuario) {
        return this.usuariosService.getUsuario(uuidUsuario).pipe(
          map(user => {
            const userRoles: string[] = user.roles.map((r: any) => r.nombre);
            const hasRole = expectedRoles.some(role => userRoles.includes(role));
            if (hasRole) {
              return true;
            }
            this.router.navigate(['/login']);
            return false;
          }),
          catchError(() => {
            this.router.navigate(['/login']);
            return of(false);
          })
        );
      }
    }

    this.router.navigate(['/login']);
    return of(false);
  }
}
