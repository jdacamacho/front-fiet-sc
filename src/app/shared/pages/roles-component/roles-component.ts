import { Component } from '@angular/core';
import { ContentComponent } from '../content/content-component/content-component';
import { CommonModule } from '@angular/common';
import { RolesContentComponent } from '../content/roles-content-component/roles-content-component';

@Component({
  selector: 'app-roles-component',
  imports: [CommonModule, ContentComponent],
  templateUrl: './roles-component.html',
  styleUrl: './roles-component.css'
})
export class RolesComponent {
  content = RolesContentComponent; 
}
