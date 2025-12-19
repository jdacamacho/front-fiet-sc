import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-date-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './input-date-component.html',
  styleUrl: './input-date-component.css'
})
export class InputDateComponent {

  @Input() label = '';
  @Input() value = '';
  @Input() required = false;

  @Output() valueChange = new EventEmitter<string>();

  touched = false;

  onChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.valueChange.emit(this.value);
  }

  isInvalid(): boolean {
    return this.required && !this.value && this.touched;
  }

  reset(): void {
    this.value = '';
    this.valueChange.emit(this.value);
    this.touched = false;
  }

  setValue(value: string): void {
    this.value = value;
    this.valueChange.emit(this.value);
  }
}