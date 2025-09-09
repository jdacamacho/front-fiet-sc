import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';

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
}
