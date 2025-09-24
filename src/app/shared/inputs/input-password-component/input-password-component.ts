import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-password-component',
  imports: [CommonModule, FloatLabelModule, FormsModule],
  templateUrl: './input-password-component.html',
  styleUrl: './input-password-component.css'
})
export class InputPasswordComponent {
  @Input() label: string = '';    
  @Input() value: string = '';     
  @Input() required: boolean = false;
  @Output() valueChange = new EventEmitter<string>(); 
  touched: boolean = false;
  
  onValueChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.valueChange.emit(this.value);
  }

  isInvalid(): boolean {
    return this.required && (!this.value || this.value === '') && this.touched;
  }

  public reset(): void {
    this.value = '';
    this.valueChange.emit(this.value);
    this.touched = false;
  }

  public setValue(newValue: string): void {
    this.value = newValue;
    this.valueChange.emit(this.value);
  }
}
