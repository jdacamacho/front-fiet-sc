import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { RespuestasService } from '../../core/services/respuesta-service';
import { DescargarRespuestaComponent } from '../descargar-respuesta-component/descargar-respuesta-component';
import { CargarRespuestaComponent } from '../cargar-respuesta-component/cargar-respuesta-component';
import { SimpleButtonComponent } from '../buttons/simple-button-component/simple-button-component';
import { ToastService } from '../../core/services/toast-service';
import { ErrorHandlerService } from '../../core/services/error-handler-service';
import { SolicitudesService } from '../../core/services/solicitudes-service';
import { RespuestaDTORespuesta } from '../../core/models/Respuesta/DTOResponse/RespuestaDTORespuesta';
import { SolicitudDTORespuesta } from '../../core/models/Solicitudes/DTOResponse/SolicitudDTORespuesta';
import { SolicitudActualizarDTOPeticion } from '../../core/models/Solicitudes/DTORequest/SolicitudActualizarDTOPeticion';
import { AGREGADO_EN_EL_ORDEN_DEL_DIA, RESPONDIDA } from '../../core/constantes/constantes';
import { switchMap } from 'rxjs';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Component({
  selector: 'app-dialog-gestion-respuesta-component',
  imports: [
    CommonModule,
    DialogModule,
    DescargarRespuestaComponent,
    CargarRespuestaComponent,
    SimpleButtonComponent
  ],
  templateUrl: './dialog-gestion-respuesta-component.html',
  styleUrl: './dialog-gestion-respuesta-component.css'
})
export class DialogGestionRespuestaComponent implements OnChanges{
  @Input() visible = false;
  @Input() uuidRespuesta!: string;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() respuestaModificada = new EventEmitter<void>();

  respuesta: any = null;
  cargando = false;

  constructor(
    private respuestasService: RespuestasService,
    private solicitudesService: SolicitudesService,
    private toastService: ToastService,
    private errorHandlerService: ErrorHandlerService  
  ) {}

  ngOnChanges(): void {
    if (this.visible && this.uuidRespuesta) {
      this.cargarRespuesta();
    }
  }

  private cargarRespuesta(): void {
    this.cargando = true;
    this.respuestasService.getRespuesta(this.uuidRespuesta).subscribe({
      next: resp => {
        this.respuesta = resp;
        this.cargando = false;
      },
      error: () => {
        this.respuesta = null;
        this.cargando = false;
      }
    });
  }

  cerrar(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  /** Se ejecuta cuando se sube un archivo */
  onArchivoSeleccionado(file: File): void {
    this.respuestasService.responderSolicitud(this.uuidRespuesta, file)
      .pipe(
        switchMap(() => this.actualizarEstadoSolicitud(this.uuidRespuesta, RESPONDIDA))
      )
      .subscribe({
        next: () => {
          this.cargarRespuesta();
          this.toastService.showSuccess('Éxito', 'Se ha respondido a la solicitud');
          this.respuestaModificada.emit(); // ahora se emite después de actualizar el estado
        },
        error: err => {
          this.errorHandlerService.handleError(err, 'Error Cargando Respuesta', 'No se pudo cargar la respuesta');
        }
      });
  }

  /** Se ejecuta cuando se elimina el archivo */
  onArchivoEliminado(): void {
    this.respuestasService.eliminarArchivoRespuesta(this.uuidRespuesta)
      .pipe(
        switchMap(() => this.actualizarEstadoSolicitud(this.uuidRespuesta, AGREGADO_EN_EL_ORDEN_DEL_DIA))
      )
      .subscribe({
        next: () => {
          this.cargarRespuesta();
          this.toastService.showSuccess('Éxito', 'Se ha eliminado la respuesta');
          this.respuestaModificada.emit(); // se emite después de actualizar
        },
        error: err => {
          this.errorHandlerService.handleError(err, 'Error Eliminando Respuesta', 'No se pudo eliminar la respuesta');
        }
      });
  }

  /** Actualiza el estado de la solicitud asociada a una respuesta */
  private actualizarEstadoSolicitud(uuidRespuesta: string, nuevoEstado: string): Observable<void> {
    return this.respuestasService.getRespuesta(uuidRespuesta).pipe(
      switchMap((resp: RespuestaDTORespuesta) => {
        const uuidSolicitud = resp.solicitud.uuidSolicitud;
        if (!uuidSolicitud) return of(void 0);

        return this.solicitudesService.getSolicitud(uuidSolicitud).pipe(
          switchMap((solicitud: SolicitudDTORespuesta) => {
            const solicitudActualizar: SolicitudActualizarDTOPeticion = {
              consecutivo: solicitud.consecutivo,
              nombre: solicitud.nombre,
              descripcion: solicitud.descripcion,
              estado: nuevoEstado,
              uuidFuncionario: solicitud.objFuncionario.uuidUsuario,
              uuidOrdenDelDia: solicitud.ordenDelDia.uuidOrdenDelDia
            };
            return this.solicitudesService.actualizarSolicitud(solicitud.uuidSolicitud, solicitudActualizar);
          })
        );
      }),
      map(() => void 0) // <-- esto fuerza que el Observable sea void
    );
  }

}
