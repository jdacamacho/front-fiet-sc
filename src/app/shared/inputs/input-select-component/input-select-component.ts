import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-select-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './input-select-component.html',
  styleUrl: './input-select-component.css'
})
export class InputSelectComponent {
  @Input() label: string = ''; 
  @Input() options: { label: string; value: any }[] = [];
  @Input() value: any; 
  @Input() required: boolean = false;
  @Output() valueChange = new EventEmitter<any>(); 
  touched: boolean = false;
  
  onValueChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.value = select.value;
    this.valueChange.emit(this.value);
  }

  isInvalid(): boolean {
    return this.required && (!this.value || this.value.trim() === '') && this.touched;
  }
}
