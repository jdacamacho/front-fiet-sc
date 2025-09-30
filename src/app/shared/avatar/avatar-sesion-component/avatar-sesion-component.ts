import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AuthService } from '../../../core/services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-avatar-sesion-component',
  imports: [AvatarModule, AvatarGroupModule, CommonModule],
  templateUrl: './avatar-sesion-component.html',
  styleUrl: './avatar-sesion-component.css'
})
export class AvatarSesionComponent {
  @Input() avatarLabel: string = '';
  @Input() nombre: string = '';
  @Input() roles: string[] = [];
  @Input() currentRole: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  cerrarSesion(): void {
    this.authService.logout(); 
    this.router.navigate(['/login'])
  }
}
