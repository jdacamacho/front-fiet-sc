import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { SimpleButtonComponent } from '../buttons/simple-button-component/simple-button-component';
import { UploadComponent } from '../buttons/upload-component/upload-component';

@Component({
  selector: 'app-generic-dialog-upload-file-component',
  imports: [CommonModule, DialogModule, ButtonModule, SimpleButtonComponent, UploadComponent],
  templateUrl: './generic-dialog-upload-file-component.html',
  styleUrl: './generic-dialog-upload-file-component.css'
})
export class GenericDialogUploadFileComponent {
  @Input() visible: boolean = false;
  @Input() title: string = '';
  @Input() uploadedFile: File | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() fileSelected = new EventEmitter<File>();
  @Output() fileRemoved = new EventEmitter<void>();
  @Output() upload = new EventEmitter<File>();

  close() {
    this.visibleChange.emit(false);
  }

  onFileSelected(file: File) {
    this.uploadedFile = file;
    this.fileSelected.emit(file);
  }

  onFileRemoved() {
    this.uploadedFile = null;
    this.fileRemoved.emit();
  }

  onUpload() {
    if (this.uploadedFile) {
      this.upload.emit(this.uploadedFile);
      this.close();
    }
  }
}
