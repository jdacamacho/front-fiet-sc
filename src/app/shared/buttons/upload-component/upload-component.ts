import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-upload-component',
  imports: [CommonModule, FileUploadModule, ButtonModule],
  templateUrl: './upload-component.html',
  styleUrl: './upload-component.css'
})
export class UploadComponent {
  @Input() uploadedFile: File | null = null; 
  @Output() fileSelected = new EventEmitter<File>();
  @Output() fileRemoved = new EventEmitter<void>();

  onFileSelect(event: any) {
    const file: File = event.files[0];
    if (file) {
      this.uploadedFile = file;
      this.fileSelected.emit(file);
    }
  }

  removeFile() {
    this.uploadedFile = null;
    this.fileRemoved.emit();
  }
}
