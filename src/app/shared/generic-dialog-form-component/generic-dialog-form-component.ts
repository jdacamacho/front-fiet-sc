import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { SimpleButtonComponent } from '../buttons/simple-button-component/simple-button-component';
@Component({
  selector: 'app-generic-dialog-form-component',
  imports: [CommonModule, DialogModule, ButtonModule, SimpleButtonComponent],
  templateUrl: './generic-dialog-form-component.html',
  styleUrl: './generic-dialog-form-component.css'
})
export class GenericDialogFormComponent {
  @Input() visible: boolean = false;
  @Input() title: string = '';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<void>();

  close() {
    this.visibleChange.emit(false);
  }

  onSave() {
    this.save.emit(); 
  }
}
