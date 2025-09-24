import { Injectable } from '@angular/core';
import { ToastService } from './toast-service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private toastService: ToastService) { }

  public handleError(err: any, titulo: string = 'Error', mensaje: string = 'Ocurrió un error'): void {
    let error = '';

    console.error(`${titulo}`, err);

    if (err.error && typeof err.error === 'object' && !err.error.mensaje && !err.error.descripcion) {
      const fieldErrors = Object.entries(err.error)
        .filter(([_, value]) => typeof value === 'string')
        .map(([key, value]) => `${key}: ${value}`)
        .join(' | ');
      if (fieldErrors) 
        error = fieldErrors;
    } else if (err.error && err.error.mensaje) 
      error = err.error.mensaje;
    else if (err.error && err.error.descripcion)
      error = err.error.descripcion;
    else 
      error = err.message || 'Error desconocido';
    this.toastService.showError(titulo, `${mensaje}. ${error}`);
  }
}
