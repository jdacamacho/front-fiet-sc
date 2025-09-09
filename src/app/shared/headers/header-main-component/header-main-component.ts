import { Component } from '@angular/core';
import { AvatarSesionComponent } from '../../avatar/avatar-sesion-component/avatar-sesion-component';

@Component({
  selector: 'app-header-main-component',
  imports: [AvatarSesionComponent],
  templateUrl: './header-main-component.html',
  styleUrl: './header-main-component.css'
})
export class HeaderMainComponent {
  nombre: string = 'Carlos Alberto';
  avatarLabel: string = 'CA';
  roles: string[] = ['Funcionario', 'Decano', 'Secretaria FIET'];
  currentRole: string = 'Secretario General';
}
