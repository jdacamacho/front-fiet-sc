import { Component } from '@angular/core';
import { ContentComponent } from '../content/content-component/content-component';
import { CommonModule } from '@angular/common';
import { UsuariosContentComponent } from '../content/usuarios-content-component/usuarios-content-component';

@Component({
  selector: 'app-usuarios-component',
  imports: [CommonModule, ContentComponent],
  templateUrl: './usuarios-component.html',
  styleUrl: './usuarios-component.css'
})
export class UsuariosComponent {
  content = UsuariosContentComponent; 
}
