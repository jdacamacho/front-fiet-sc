import { Component, Input, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { SimpleButtonComponent } from '../../../../shared/buttons/simple-button-component/simple-button-component';
import { SECCIONES_ORDEN_DIA } from '../../../constantes/constantes';
import { OrdenDelDiaDTORespuesta } from '../../../models/Solicitudes/DTOResponse/OrdenDelDiaDTORespuesta';
import { SolicitudesService } from '../../../services/solicitudes-service';
import { SolicitudDTORespuesta } from '../../../models/Solicitudes/DTOResponse/SolicitudDTORespuesta';
import { ButtonComponent } from '../../../../shared/buttons/button-component/button-component';
import { GenericDialogInfoComponent } from '../../../../shared/generic-dialog-info-component/generic-dialog-info-component';
import { AnexosViewComponent } from '../../../../shared/others/anexos-view-component/anexos-view-component';
import { InputSelectComponent } from '../../../../shared/inputs/input-select-component/input-select-component';
import { PENDIENTE_AL_ORDEN_DEL_DIA } from '../../../constantes/constantes';
import { SolicitudActualizarDTOPeticion } from '../../../models/Solicitudes/DTORequest/SolicitudActualizarDTOPeticion';
import { AGREGADO_EN_EL_ORDEN_DEL_DIA } from '../../../constantes/constantes';
import { ToastService } from '../../../services/toast-service';
import { ErrorHandlerService } from '../../../services/error-handler-service';
import { SimpleButtonGroupComponent } from '../../../../shared/buttons/simple-button-group-component/simple-button-group-component';

@Component({
  selector: 'app-orden-del-dia-visualizador-component',
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    SimpleButtonComponent,
    ButtonComponent,
    GenericDialogInfoComponent,
    AnexosViewComponent,
    InputSelectComponent,
    ButtonComponent,
    SimpleButtonGroupComponent,
  ],
  templateUrl: './orden-del-dia-visualizador-component.html',
  styleUrl: './orden-del-dia-visualizador-component.css',
})
export class OrdenDelDiaVisualizadorComponent {
  title: string = 'Orden del Día';
  seccionesOrdenDia = SECCIONES_ORDEN_DIA;
  solicitudes: any[] = [];
  loadingSolicitudes = false;
  solicitudInfoVisible = false;
  solicitudInfoSeleccionada: any = null;
  selectedSolicitudInfo: any = null;
  solicitudAnexos: any[] = [];
  dialogUsaComponente = false;
  solicitudesDisponiblesOpciones: { label: string; value: string }[] = [];
  solicitudSeleccionadaParaAgregar: string | null = null;

  @ViewChild('inputSolicitudAgregar') inputSolicitudAgregar!: InputSelectComponent;

  solicitudesPorSeccion: Record<string, SolicitudDTORespuesta[]> = SECCIONES_ORDEN_DIA.reduce(
    (acc, s) => {
      acc[s.label] = [];
      return acc;
    },
    {} as Record<string, SolicitudDTORespuesta[]>
  );

  @Input() visible: boolean = false;
  private _orden!: OrdenDelDiaDTORespuesta;

  @Input()
  set orden(value: OrdenDelDiaDTORespuesta) {
    if (value?.uuidOrdenDelDia) {
      this._orden = value;
      this.cargarSolicitudes();
    }
  }

  get orden(): OrdenDelDiaDTORespuesta {
    return this._orden;
  }

  @Output() visibleChange = new EventEmitter<boolean>();

  constructor(
    private solicitudesService: SolicitudesService,
    private toastService: ToastService,
    private handlerError: ErrorHandlerService
  ) {}

  private inicializarSecciones(): void {
    this.solicitudesPorSeccion = this.seccionesOrdenDia.reduce((acc, s) => {
      acc[s.label] = [];
      return acc;
    }, {} as Record<string, SolicitudDTORespuesta[]>);
  }

  cargarSolicitudes(): void {
    this.loadingSolicitudes = true;
    this.solicitudes = [];
    this.inicializarSecciones();

    this.solicitudesService.getSolicitudesPorOrdenDelDia(this._orden.uuidOrdenDelDia).subscribe({
      next: (data) => {
        this.solicitudes = [...data];
        this.agruparSolicitudesPorSeccion();
        this.loadingSolicitudes = false;
      },
      error: () => {
        this.solicitudes = [];
        this.inicializarSecciones();
        this.loadingSolicitudes = false;
      },
    });
  }

  cargarSolicitudesDisponibles(): void {
    this.solicitudesService.getSolicitudesPorEstado(PENDIENTE_AL_ORDEN_DEL_DIA).subscribe({
      next: (data) => {
        this.solicitudesDisponiblesOpciones = data.map((s) => ({
          label: s.nombre,
          value: s.uuidSolicitud,
        }));
      },
      error: (err) => {
        this.solicitudesDisponiblesOpciones = [];
      },
    });
  }

  agruparSolicitudesPorSeccion(): void {
    this.inicializarSecciones();

    for (const solicitud of this.solicitudes) {
      const seccion = solicitud.tipoSolicitud?.seccion;
      if (seccion && this.solicitudesPorSeccion[seccion]) 
        this.solicitudesPorSeccion[seccion] = [...this.solicitudesPorSeccion[seccion], solicitud];
    }
  }

  verSolicitud(solicitud: SolicitudDTORespuesta): void {
    this.solicitudesService.getSolicitud(solicitud.uuidSolicitud).subscribe({
      next: (solicitudDetallada) => {
        const tieneAnexos = solicitudDetallada.anexos?.length > 0;

        this.selectedSolicitudInfo = {
          Nombre: solicitudDetallada.nombre || 'N/A',
          Descripción: solicitudDetallada.descripcion,
          Estado: solicitudDetallada.estado,
          Consecutivo: solicitudDetallada.consecutivo || 'Sin consecutivo',

          Orden_del_Día: solicitudDetallada.ordenDelDia
            ? solicitudDetallada.ordenDelDia.nombre
            : 'Sin orden del día',

          Tipo_de_Solicitud: solicitudDetallada.tipoSolicitud?.nombre,

          Solicitante:
            solicitudDetallada.informacionSolicitante?.nombres +
            ' ' +
            solicitudDetallada.informacionSolicitante?.apellidos,

          Identificación:
            solicitudDetallada.informacionSolicitante?.tipoDocumento +
            ' ' +
            solicitudDetallada.informacionSolicitante?.numeroDocumento,

          Contacto:
            solicitudDetallada.informacionSolicitante?.correoElectronico +
            ' / ' +
            solicitudDetallada.informacionSolicitante?.telefono,
        };

        this.solicitudAnexos = solicitudDetallada.anexos || [];
        this.dialogUsaComponente = tieneAnexos;
        this.solicitudInfoVisible = true;
      },
    });
  }

  modificarSolicitud(solicitud: SolicitudDTORespuesta): void {
    console.log('Modificar solicitud (pendiente):', solicitud);
  }

  removerSolicitud(solicitud: SolicitudDTORespuesta): void {
    const peticion: SolicitudActualizarDTOPeticion = {
      consecutivo: solicitud.consecutivo || '',
      nombre: solicitud.nombre,
      descripcion: solicitud.descripcion || '',
      estado: PENDIENTE_AL_ORDEN_DEL_DIA,
      uuidFuncionario: solicitud.objFuncionario.uuidUsuario,
      uuidOrdenDelDia: '',
    };

    this.solicitudesService.actualizarSolicitud(solicitud.uuidSolicitud, peticion).subscribe({
      next: (res) => {
        const seccion = solicitud.tipoSolicitud?.seccion;
        if (seccion && this.solicitudesPorSeccion[seccion]) {
          this.solicitudesPorSeccion[seccion] = this.solicitudesPorSeccion[seccion].filter(
            (s) => s.uuidSolicitud !== solicitud.uuidSolicitud
          );
        }
        this.toastService.showSuccess(
          'Éxito',
          'Solicitud removida del Orden del Día correctamente'
        );
      },
      error: (err) => {
        this.handlerError.handleError(err, 'Error al remover la solicitud del Orden del Día');
      },
    });
  }

  onSolicitudSeleccionada(uuidSolicitud: string): void {
    this.solicitudSeleccionadaParaAgregar = uuidSolicitud;
  }

  agregarSolicitudSeleccionada(): void {
    if (!this.solicitudSeleccionadaParaAgregar) return;

    const uuid = this.solicitudSeleccionadaParaAgregar;
    this.solicitudesService.getSolicitud(uuid).subscribe({
      next: (solicitudCompleta) => {
        const seccion = solicitudCompleta.tipoSolicitud?.seccion;
        if (seccion && this.solicitudesPorSeccion[seccion])
          this.solicitudesPorSeccion[seccion].push(solicitudCompleta);
        this.registrarSolicitudesEnOrdenDelDia(solicitudCompleta);
        this.solicitudSeleccionadaParaAgregar = null;
        this.inputSolicitudAgregar.reset();
      },
      error: (err) => {
        this.handlerError.handleError(err, 'Error al agregar la solicitud al Orden del Día');
      },
    });
  }

  descargarAnexos(): void {
    if (!this.orden) return;
    const uuidOrden = this.orden.uuidOrdenDelDia;
    let nombreOrden = this.orden.nombre || 'Orden';

    nombreOrden = nombreOrden
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '_');

    this.solicitudesService.descargarAnexosOrdenDelDia(uuidOrden, nombreOrden).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${nombreOrden}.zip`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.toastService.showError(
          'Error',
          'El orden del día no tiene anexos para descargar.'
        );
      },
    });
  }

  exportarOrdenDelDia(): void {
    console.log('Exportar Orden del Día (pendiente)');
  }

  registrarSolicitudesEnOrdenDelDia(solicitud: SolicitudDTORespuesta): void {
    const peticion: SolicitudActualizarDTOPeticion = {
      consecutivo: solicitud.consecutivo || '',
      nombre: solicitud.nombre,
      descripcion: solicitud.descripcion || '',
      estado: AGREGADO_EN_EL_ORDEN_DEL_DIA,
      uuidFuncionario: solicitud.objFuncionario.uuidUsuario,
      uuidOrdenDelDia: this.orden.uuidOrdenDelDia,
    };

    this.solicitudesService.actualizarSolicitud(solicitud.uuidSolicitud, peticion).subscribe({
      next: (res) => {
        this.toastService.showSuccess(
          'Éxito',
          'Solicitud registrada en Orden del Día correctamente'
        );
      },
      error: (err) => {
        this.handlerError.handleError(err, 'Error al registrar la solicitud en el Orden del Día');
      },
    });
  }

  close() {
    this.visibleChange.emit(false);
  }
}
