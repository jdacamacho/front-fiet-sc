import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { SimpleButtonComponent } from '../buttons/simple-button-component/simple-button-component';

@Component({
  selector: 'app-generic-dialog-steps-form-component',
  imports: [CommonModule, DialogModule, ButtonModule, SimpleButtonComponent],
  templateUrl: './generic-dialog-steps-form-component.html',
  styleUrl: './generic-dialog-steps-form-component.css'
})
export class GenericDialogStepsFormComponent {
  @Input() visible: boolean = false;
  @Input() title: string = '';
  @Input() steps: { title: string; contentTemplate: any }[] = []; // secciones dinámicas

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<void>();

  currentStep = 0;

  close() {
    this.visibleChange.emit(false);
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  onSave() {
    this.save.emit();
  }
}
