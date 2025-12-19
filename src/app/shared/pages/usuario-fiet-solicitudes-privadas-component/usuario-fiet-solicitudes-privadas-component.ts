import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContentComponent } from '../content/content-component/content-component';
import { UsuarioFietSolicitudesPrivadasContentComponent } from '../content/usuario-fiet-solicitudes-privadas-content-component/usuario-fiet-solicitudes-privadas-content-component';

@Component({
  selector: 'app-usuario-fiet-solicitudes-privadas-component',
  imports: [CommonModule, ContentComponent],
  templateUrl: './usuario-fiet-solicitudes-privadas-component.html',
  styleUrl: './usuario-fiet-solicitudes-privadas-component.css'
})
export class UsuarioFietSolicitudesPrivadasComponent {
  content = UsuarioFietSolicitudesPrivadasContentComponent;
}
