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
  @Input() forceValidation: boolean = false;
  touched: boolean = false;
  
  onValueChange(newValue: any) {
    this.value = newValue;
    this.valueChange.emit(this.value);
  }

  isInvalid(): boolean {
    const empty =
      this.value === null ||
      this.value === undefined ||
      (typeof this.value === 'string' && this.value.trim() === '');

    return this.required && empty && (this.touched || this.forceValidation);
  }

  compareFn = (o1: any, o2: any): boolean => {
    return JSON.stringify(o1) === JSON.stringify(o2);
  };

  public reset(): void {
    this.value = null;
    this.valueChange.emit(this.value);
    this.touched = false;
    this.forceValidation = false;
  }

  public setValue(newValue: any): void {
    this.value = newValue;
    this.valueChange.emit(this.value);
  }
}
