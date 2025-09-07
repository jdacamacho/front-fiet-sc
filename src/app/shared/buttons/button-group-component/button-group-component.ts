import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-group-component',
  imports: [CommonModule],
  templateUrl: './button-group-component.html',
  styleUrl: './button-group-component.css'
})
export class ButtonGroupComponent {
  @Input() label: string = '';
  @Input() imgUrl: string = '';
}
