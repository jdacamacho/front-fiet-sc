import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RespuestasService } from '../../../../core/services/respuesta-service';
import { TableGenericComponent } from '../../../table-generic-component/table-generic-component';
import { CardMainComponent } from '../../../card-main-component/card-main-component';
import { Paginator } from '../../../paginator/paginator';
import { BarraBusquedaComponent } from '../../../search/barra-busqueda-component/barra-busqueda-component';
import { ButtonComponent } from '../../../buttons/button-component/button-component';
import { GenericDialogInfoComponent } from '../../../generic-dialog-info-component/generic-dialog-info-component';
import { DialogGestionRespuestaComponent } from '../../../dialog-gestion-respuesta-component/dialog-gestion-respuesta-component';
import { DescargarRespuestaComponent } from '../../../descargar-respuesta-component/descargar-respuesta-component';

@Component({
  selector: 'app-sec-respuestas-content-component',
  standalone: true,
  imports: [
    CommonModule,
    CardMainComponent,
    Paginator,
    BarraBusquedaComponent,
    ButtonComponent,
    GenericDialogInfoComponent,
    DialogGestionRespuestaComponent,
    DescargarRespuestaComponent
  ],
  templateUrl: './sec-respuestas-content-component.html',
  styleUrl: './sec-respuestas-content-component.css',
})
export class SecRespuestasContentComponent implements OnInit, AfterViewInit {
  @ViewChild('busquedaSolicitud') busquedaSolicitud!: TemplateRef<any>;

  tableComponent = TableGenericComponent;
  pretitleComponentComponent = ButtonComponent;

  dialogGestionVisible = false;
  selectedRespuestaUuid!: string;

  headers = [{ title: 'solicitud', headerTemplate: this.busquedaSolicitud }, { title: 'estado' }];
  paginatedData: any[] = [];

  currentPage = 1;
  pageSize = 5;
  totalElements = 0;
  totalPages = 1;
  busquedaActual = '';

  respuestaInfoDialogVisible = false;
  selectedRespuestaInfo: any = null;

  respuestaUrl: string | null = null;
  nombreArchivoRespuesta: string | null = null;

  constructor(private respuestasService: RespuestasService) {}

  ngOnInit(): void {
    this.cargarRespuestas();
  }

  ngAfterViewInit(): void {
    this.headers = [
      { title: 'solicitud', headerTemplate: this.busquedaSolicitud },
      { title: 'estado' },
    ];
  }

  cargarRespuestas(page: number = 1, busqueda: string = ''): void {
    const backendPage = page - 1;

    const observable =
      busqueda && busqueda.trim()
        ? this.respuestasService.getRespuestasPorNombreSolicitud(
            busqueda,
            backendPage,
            this.pageSize
          )
        : this.respuestasService.getRespuestas(backendPage, this.pageSize);

    observable.subscribe({
      next: (resp) => {
        if (!resp.content || resp.content.length === 0) {
          this.paginatedData = [];
          this.totalElements = 0;
          this.totalPages = 0;
          this.currentPage = 1;
          this.busquedaActual = busqueda;
          return;
        }

        this.paginatedData = resp.content.map((r) => ({
          uuidRespuesta: r.uuidRespuesta,
          solicitud: r.solicitud?.nombre,
          estado: r.solicitud?.estado,
        }));

        this.totalElements = resp.totalElements;
        this.totalPages = Math.ceil(this.totalElements / this.pageSize);
        this.currentPage = Math.min(page, this.totalPages);
        this.busquedaActual = busqueda;
      },
      error: () => {
        this.paginatedData = [];
        this.totalElements = 0;
        this.totalPages = 0;
        this.currentPage = 1;
        this.busquedaActual = busqueda;
      },
    });
  }

  /** Buscar por nombre de solicitud */
  onBuscarSolicitud(nombre: string): void {
    this.currentPage = 1;
    this.cargarRespuestas(1, nombre);
  }

  /** Cambio de página */
  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.cargarRespuestas(page, this.busquedaActual);
  }

  /** Ver información detallada */
  verMasInfo(respuesta: any): void {
    this.respuestasService.getRespuesta(respuesta.uuidRespuesta).subscribe({
      next: (detalle) => {
        this.selectedRespuestaInfo = {
          Solicitante:
            detalle.solicitud.informacionSolicitante.nombres +
            ' ' +
            detalle.solicitud.informacionSolicitante.apellidos,
          Identificacion:
            detalle.solicitud.informacionSolicitante.tipoDocumento +
            ' ' +
            detalle.solicitud.informacionSolicitante.numeroDocumento,
          Contacto:
            detalle.solicitud.informacionSolicitante.correoElectronico +
            ' / ' +
            detalle.solicitud.informacionSolicitante.telefono,
          Tipo_Respuesta: detalle.tipoRespuesta,
          Consecutivo_FIET: detalle.consecutivoFiet,
          Respuesta_Consejo: detalle.respuestaConsejo,
          Indicaciones: detalle.indicaciones || 'Sin indicaciones',
        };

        if (detalle.urlRespuesta) {
          this.respuestaUrl = detalle.urlRespuesta;
          const partes = detalle.urlRespuesta.split('/');
          this.nombreArchivoRespuesta = partes.pop() ?? null;

        } else {
          this.respuestaUrl = null;
          this.nombreArchivoRespuesta = null;
        }

        this.respuestaInfoDialogVisible = true;
      },
      error: (err) => console.error('Error cargando detalle', err),
    });
  }

  /** Ver información detallada */
  abrirCargarRespuesta(row: any): void {
    this.selectedRespuestaUuid = row.uuidRespuesta;
    this.dialogGestionVisible = true;
  }
}
