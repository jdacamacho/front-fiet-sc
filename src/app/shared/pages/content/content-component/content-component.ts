import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-content-component',
  imports: [],
  templateUrl: './content-component.html',
  styleUrl: './content-component.css'
})
export class ContentComponent {
  @Input() title: string = '';
  @Input() body: string = '';  
}
