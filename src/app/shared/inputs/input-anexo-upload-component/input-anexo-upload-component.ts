import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule, FileUpload } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { TipoAnexoDTORespuesta } from '../../../core/models/TipoSolicitud/DTOResponse/TipoAnexoDTORespuesta';

@Component({
  selector: 'app-input-anexo-upload-component',
  imports: [
    CommonModule,
    FileUploadModule,
    ButtonModule
  ],
  templateUrl: './input-anexo-upload-component.html',
  styleUrl: './input-anexo-upload-component.css'
})
export class InputAnexoUploadComponent {
   @Input() tipoAnexo!: TipoAnexoDTORespuesta;
  @Input() uploadedFile: File | null = null;

  @Output() fileSelected = new EventEmitter<File>();
  @Output() fileRemoved = new EventEmitter<void>();

  @ViewChild(FileUpload) fileUpload!: FileUpload;

  errorFormato = false;

  onFileSelect(event: any): void {
    const file: File = event.files[0];
    if (!file) return;

    if (!this.validarFormato(file)) {
      this.errorFormato = true;
      this.fileUpload.clear();
      return;
    }

    this.errorFormato = false;
    this.uploadedFile = file;
    this.fileSelected.emit(file);
  }

  removeFile(): void {
    this.uploadedFile = null;
    this.fileUpload.clear();
    this.fileRemoved.emit();
  }

  private validarFormato(file: File): boolean {
    if (!this.tipoAnexo.formato) return true;

    const extensiones = this.tipoAnexo.formato
      .split(',')
      .map(f => f.trim().toLowerCase());

    const extensionArchivo = file.name.split('.').pop()?.toLowerCase();
    return extensionArchivo ? extensiones.includes(extensionArchivo) : false;
  }

  esInvalido(): boolean {
    return this.tipoAnexo.obligatoriedad && !this.uploadedFile;
  }

  reset(): void {
    this.uploadedFile = null;
    this.errorFormato = false;

    if (this.fileUpload) {
      this.fileUpload.clear();
    }
  }
}
