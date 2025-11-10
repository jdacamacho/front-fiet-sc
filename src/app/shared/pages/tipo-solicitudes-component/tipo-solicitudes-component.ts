import { Component } from '@angular/core';
import { ContentComponent } from '../content/content-component/content-component';
import { CommonModule } from '@angular/common';
import { TipoSolicitudesContentComponent } from '../content/tipo-solicitudes-content-component/tipo-solicitudes-content-component';

@Component({
  selector: 'app-tipo-solicitudes-component',
  imports: [CommonModule, ContentComponent],
  templateUrl: './tipo-solicitudes-component.html',
  styleUrl: './tipo-solicitudes-component.css'
})
export class TipoSolicitudesComponent {
  content = TipoSolicitudesContentComponent;
}
