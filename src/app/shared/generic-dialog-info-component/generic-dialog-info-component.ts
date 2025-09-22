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

  @Output() visibleChange = new EventEmitter<boolean>(); 

  close() {
    this.visibleChange.emit(false);
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  formatKey(key: string): string {
    return key
      .replace(/_/g, ' ')             
      .replace(/\w\S*/g, (w) =>      
        w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
      );
  }
}
