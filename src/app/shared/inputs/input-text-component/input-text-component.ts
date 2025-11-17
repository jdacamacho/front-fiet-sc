import { Component, Input, Output, EventEmitter} from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-text-component',
  imports: [CommonModule, FloatLabelModule, FormsModule],
  templateUrl: './input-text-component.html',
  styleUrl: './input-text-component.css'
})
export class InputTextComponent {
  @Input() label: string = '';    
  @Input() value: string = '';     
  @Input() required: boolean = false;
  @Input() forceValidation: boolean = false;
  @Output() valueChange = new EventEmitter<string>(); 
  touched: boolean = false;
  
  onValueChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.valueChange.emit(this.value);
  }

  isInvalid(): boolean {
    const empty = !this.value || this.value.trim() === '';
    return this.required && empty && (this.touched || this.forceValidation);
  }

  public reset(): void {
    this.value = '';
    this.valueChange.emit(this.value);
    this.touched = false;
    this.forceValidation = false;
  }

  public setValue(newValue: string): void {
    this.value = newValue;
    this.valueChange.emit(this.value);
  }
}
