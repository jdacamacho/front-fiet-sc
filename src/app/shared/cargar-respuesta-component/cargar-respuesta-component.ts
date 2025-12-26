import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-cargar-respuesta-component',
  standalone: true,
  imports: [CommonModule, FileUploadModule],
  templateUrl: './cargar-respuesta-component.html',
  styleUrl: './cargar-respuesta-component.css'
})
export class CargarRespuestaComponent {

  @Output() archivoSeleccionado = new EventEmitter<File>();

  @ViewChild(FileUpload) fileUpload!: FileUpload;

  archivo: File | null = null;
  errorFormato = false;

  formatosPermitidos = ['pdf', 'docx'];

  onFileSelect(event: any): void {
    const file: File = event.files?.[0];
    if (!file) return;

    if (!this.validarFormato(file)) {
      this.errorFormato = true;
      this.fileUpload.clear();
      return;
    }

    this.errorFormato = false;
    this.archivo = file;
  }

  confirmarCarga(): void {
    if (this.archivo) {
      this.archivoSeleccionado.emit(this.archivo);
    }
  }

  limpiar(): void {
    this.archivo = null;
    this.errorFormato = false;
    this.fileUpload.clear();
  }

  private validarFormato(file: File): boolean {
    const extension = file.name.split('.').pop()?.toLowerCase();
    return !!extension && this.formatosPermitidos.includes(extension);
  }
}
