import { CommonModule } from '@angular/common';
import { Component, Input, Type } from '@angular/core';

@Component({
  selector: 'app-content-component',
  imports: [CommonModule],
  templateUrl: './content-component.html',
  styleUrl: './content-component.css'
})
export class ContentComponent {
  @Input() title: string = '';
  @Input() bodyComponent!: Type<any>;
}
