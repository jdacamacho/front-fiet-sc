import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageSimpleComponent } from '../../../../shared/pages/page-simple-component/page-simple-component';
import { UsuarioPublicoSolicitudesContentComponent } from '../../components/usuario-publico-solicitudes-content-component/usuario-publico-solicitudes-content-component';

@Component({
  selector: 'app-usuario-publico-solicitudes-component',
  imports: [CommonModule, PageSimpleComponent],
  templateUrl: './usuario-publico-solicitudes-component.html',
  styleUrl: './usuario-publico-solicitudes-component.css'
})
export class UsuarioPublicoSolicitudesComponent {
  main = UsuarioPublicoSolicitudesContentComponent;
}
