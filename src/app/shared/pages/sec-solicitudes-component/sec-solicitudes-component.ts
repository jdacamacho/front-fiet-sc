import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContentComponent } from '../content/content-component/content-component';
import { SecContentComponent } from '../content/sec-content-component/sec-content-component';

@Component({
  selector: 'app-sec-solicitudes-component',
  imports: [CommonModule, ContentComponent],
  templateUrl: './sec-solicitudes-component.html',
  styleUrl: './sec-solicitudes-component.css'
})
export class SecSolicitudesComponent {
  content = SecContentComponent;
}
