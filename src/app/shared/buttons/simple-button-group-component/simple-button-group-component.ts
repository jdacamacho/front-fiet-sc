import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-simple-button-group-component',
  imports: [CommonModule],
  templateUrl: './simple-button-group-component.html',
  styleUrl: './simple-button-group-component.css'
})
export class SimpleButtonGroupComponent {
  @Input() label: string = '';
  @Input() imgUrl?: string; //
  @Input() color: string = '#1E257B';   
  @Input() width: string = '';    
  @Input() height: string = '';
  @Input() disabled: boolean = false;
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    if (this.disabled) return;
    this.clicked.emit();
  }
}
