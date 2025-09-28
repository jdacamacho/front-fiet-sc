import { Component } from '@angular/core';
import { ContentComponent } from '../content/content-component/content-component';
import { CommonModule } from '@angular/common';
import { InfoUsuarioContentComponent } from '../content/info-usuario-content-component/info-usuario-content-component';

@Component({
  selector: 'app-info-usuario-component',
  imports: [CommonModule, ContentComponent],
  templateUrl: './info-usuario-component.html',
  styleUrl: './info-usuario-component.css'
})
export class InfoUsuarioComponent {
  content = InfoUsuarioContentComponent; 
}
