import { CommonModule } from '@angular/common';
import { Component, Input, Type } from '@angular/core';
import { LayoutSimpleComponent } from '../../../layouts/layout-simple-component/layout-simple-component';

@Component({
  selector: 'app-page-simple-component',
  imports: [CommonModule, LayoutSimpleComponent],
  templateUrl: './page-simple-component.html',
  styleUrl: './page-simple-component.css'
})
export class PageSimpleComponent {
   @Input() mainComponent!: Type<any>;
}
