import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContentComponent } from '../content/content-component/content-component';
import { FunSolicitudesContentComponent } from '../content/fun-solicitudes-content-component/fun-solicitudes-content-component';

@Component({
  selector: 'app-fun-solicitudes-component',
  imports: [CommonModule, ContentComponent],
  templateUrl: './fun-solicitudes-component.html',
  styleUrl: './fun-solicitudes-component.css'
})
export class FunSolicitudesComponent {
  content = FunSolicitudesContentComponent
}
