import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../enviroments/environment';
@Component({
  selector: 'app-descargar-respuesta-component',
  imports: [CommonModule],
  templateUrl: './descargar-respuesta-component.html',
  styleUrl: './descargar-respuesta-component.css'
})
export class DescargarRespuestaComponent {
  @Input() uuidRespuesta!: string;
  @Input() urlRespuesta!: string;
  @Input() nombreArchivo!: string;
  @Input() mostrarEliminar: boolean = true;

  @Output() eliminado = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  descargar(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`
    });

    const url = `${environment.domain}${this.urlRespuesta.replace(/^\/+/, '')}`;

    this.http.get(url, { responseType: 'blob', headers }).subscribe({
      next: blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = this.nombreArchivo;
        link.click();
        window.URL.revokeObjectURL(link.href);
      },
      error: err => console.error('Error descargando respuesta', err)
    });
  }

  eliminar(): void {
    this.eliminado.emit();
  }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}
