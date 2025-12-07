import { Component, Input } from '@angular/core';
import { AnexoDTORespuesta } from '../../../core/models/Solicitudes/DTOResponse/AnexoDTORespuesta';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-anexos-view-component',
  imports: [CommonModule],
  templateUrl: './anexos-view-component.html',
  styleUrls: ['./anexos-view-component.css']
})
export class AnexosViewComponent {
  @Input() anexos: AnexoDTORespuesta[] = [];

  constructor(private http: HttpClient) {}

  descargar(anexo: AnexoDTORespuesta) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    this.http.get(anexo.urlAnexo, { responseType: 'blob', headers }).subscribe({
      next: (blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = decodeURIComponent(anexo.nombre + this.getFileExtension(anexo.urlAnexo));
        link.click();
        window.URL.revokeObjectURL(link.href);
      },
      error: (err) => console.error('Error descargando el archivo', err)
    });
  }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }

  private getFileExtension(url: string): string {
    return url.substring(url.lastIndexOf('.'));
  }
}
