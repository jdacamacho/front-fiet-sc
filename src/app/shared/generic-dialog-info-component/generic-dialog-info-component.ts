import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { SimpleButtonComponent } from '../buttons/simple-button-component/simple-button-component';
@Component({
  selector: 'app-generic-dialog-info-component',
  imports: [CommonModule, DialogModule, ButtonModule, SimpleButtonComponent],
  templateUrl: './generic-dialog-info-component.html',
  styleUrl: './generic-dialog-info-component.css'
})
export class GenericDialogInfoComponent {
  @Input() visible: boolean = false;       
  @Input() title: string = ''; 
  @Input() data: Record<string, any> = {};

  @Output() visibleChange = new EventEmitter<boolean>(); // <-- importante

  close() {
    this.visibleChange.emit(false); // notifica al padre
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
