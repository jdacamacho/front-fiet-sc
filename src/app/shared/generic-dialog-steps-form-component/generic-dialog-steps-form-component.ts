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
  private _visible: boolean = false;
  @Input() title: string = '';
  @Input() steps: { 
    title: string; 
    contentTemplate: any;
    canContinue?: () => boolean;
  }[] = [];

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<void>();

  currentStep = 0;

  @Input()
  set visible(value: boolean) {
    this._visible = value;
    if (value === true) 
      this.currentStep = 0;
  }

  get visible(): boolean {
    return this._visible;
  }

  close() {
    this.visibleChange.emit(false);
  }

  nextStep() {
    const current = this.steps[this.currentStep];

    if (current.canContinue && !current.canContinue()) 
      return;

    if (this.currentStep < this.steps.length - 1) 
      this.currentStep++;
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
