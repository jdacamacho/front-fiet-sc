import { Component } from '@angular/core';
import { AvatarSesionComponent } from '../../avatar/avatar-sesion-component/avatar-sesion-component';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-header-main-component',
  imports: [AvatarSesionComponent],
  templateUrl: './header-main-component.html',
  styleUrl: './header-main-component.css'
})
export class HeaderMainComponent {
  nombre: string = 'Carlos Alberto';
  avatarLabel: string = 'CA';
  roles: string[] = [];
  currentRole: string = 'Secretario General';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.usuario$.subscribe(user => {
      if (user) {
        this.nombre = `${user.nombres}`;
        this.avatarLabel = this.getAvatarLabel(user.nombres, user.apellidos);
        this.currentRole = user.roles[0].nombre;
      }
    });
  }

  private getAvatarLabel(nombre: string, apellido: string): string {
    return (
      (nombre?.charAt(0) ?? '').toUpperCase() +
      (apellido?.charAt(0) ?? '').toUpperCase()
    );
  }
}
