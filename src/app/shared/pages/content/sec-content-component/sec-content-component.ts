/**
 * Componente solcitudes secretario general
 * Author: Julian David Camacho Erazo  {@literal <jdacamacho@unicauca.edu.co>}
 */
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CardMainComponent } from '../../../card-main-component/card-main-component';
import { TableGenericComponent } from '../../../table-generic-component/table-generic-component';
import { ButtonComponent } from '../../../buttons/button-component/button-component';
import { ViewChild, TemplateRef } from '@angular/core';
import { SolicitudesService } from '../../../../core/services/solicitudes-service';
import { Paginator } from '../../../paginator/paginator';
import { BarraBusquedaComponent } from '../../../search/barra-busqueda-component/barra-busqueda-component';
import { GenericDialogInfoComponent } from '../../../generic-dialog-info-component/generic-dialog-info-component';
import { SolicitudDTORespuesta } from '../../../../core/models/Solicitudes/DTOResponse/SolicitudDTORespuesta';
import { AnexosViewComponent } from '../../../others/anexos-view-component/anexos-view-component';
import { UsuariosService } from '../../../../core/services/usuarios-service';
import { InputTextComponent } from '../../../inputs/input-text-component/input-text-component';
import { InputSelectComponent } from '../../../inputs/input-select-component/input-select-component';
import { ToastService } from '../../../../core/services/toast-service';
import { ErrorHandlerService } from '../../../../core/services/error-handler-service';
import { GenericDialogFormComponent } from '../../../generic-dialog-form-component/generic-dialog-form-component';
import { InputTextTareaComponent } from '../../../inputs/input-text-tarea-component/input-text-tarea-component';

@Component({
  selector: 'app-sec-content-component',
  imports: [CommonModule, CardMainComponent, ButtonComponent, Paginator, BarraBusquedaComponent,
    GenericDialogInfoComponent,AnexosViewComponent, InputTextComponent, InputSelectComponent, GenericDialogFormComponent,
    InputTextTareaComponent
  ],
  templateUrl: './sec-content-component.html',
  styleUrl: './sec-content-component.css'
})
export class SecContentComponent implements OnInit{
  // Flags de visibilidad de diálogos
  solicitudInfoDialogVisible = false;
  dialogUsaComponente: boolean = false;
  // Flag de visibilidad del diálogo
  actualizarDialogVisible = false;
  solicitudAnexos: any[] = [];

  // Objeto seleccionado para edición o información
  selectedSolicitudInfo: any = null;

  tableComponent = TableGenericComponent; // Componente de tabla
  pretitleComponentComponent = ButtonComponent; // Componente pre-title

  paginatedData: any[] = [];

  // Objeto temporal para la solicitud que se va a actualizar
  solicitudUpdate: any = {};
  solicitudFiltro: string = '';

  // Objeto temporal para la actualización
  solicitudActualizar: any = {};

  // Flag para mostrar el diálogo
  actualizarSolicitudDialogVisible = false;

  // Lista de funcionarios para el select
  funcionariosOptions: { label: string; value: string }[] = [];

  // Paginación
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  totalElements = 0;

  // Header con filtro incrustado
  @ViewChild('headerSolicitud') headerSolicitud!: TemplateRef<any>;

  @ViewChild('inputNombreActualizar') inputNombreActualizar!: InputTextComponent;
  @ViewChild('inputEstadoActualizar') inputEstadoActualizar!: InputSelectComponent;
  @ViewChild('inputFuncionarioActualizar') inputFuncionarioActualizar!: InputSelectComponent;
  @ViewChild('inputDescripcionActualizar') inputDescripcionActualizar!: InputTextComponent;
  @ViewChild('inputConsecutivoActualizar') inputConsecutivoActualizar!: InputTextComponent;


  headers: any[] = [
    { title: 'Solicitud', headerTemplate: null },
    { title: 'Responsable', headerTemplate: null },
    { title: 'Estado', headerTemplate: null }
  ];

  constructor(
    private solicitudesService: SolicitudesService,
    private usuariosService: UsuariosService,
    private toastService: ToastService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.loadSolicitudes();
    this.loadFuncionarios();
  }

  ngAfterViewInit(): void {
    this.headers = [
      { title: 'Solicitud', headerTemplate: this.headerSolicitud },
      { title: 'Responsable', headerTemplate: null },
      { title: 'Estado', headerTemplate: null }
    ];
  }

  // Carga solicitudes con paginación y filtros
  loadSolicitudes(page: number = 1): void {
    const backendPage = page - 1;

    const observable = this.solicitudFiltro && this.solicitudFiltro.trim() !== ''
      ? this.solicitudesService.buscarSolicitudesPorNombre(this.solicitudFiltro.trim(), backendPage, this.pageSize)
      : this.solicitudesService.getSolicitudesPaginado(backendPage, this.pageSize);

    observable.subscribe({
      next: (respuesta: any) => {
        const content = respuesta.content || [];
        if (content.length === 0) {
          this.paginatedData = [];
          this.totalElements = 0;
          this.totalPages = 1;
          this.currentPage = 1;
          return;
        }

        this.paginatedData = content.map((s: any) => ({
          ...s,
          Solicitud: s.nombre || s.titulo || s.asunto || '', 
          Responsable: `${s.objFuncionario?.nombres} ${s.objFuncionario?.apellidos }`.trim(),
          Estado: s.estado || s.estadoSolicitud || ''
        }));

        this.totalElements = respuesta.totalElements ?? 0;
        this.totalPages = this.totalElements > 0 ? Math.ceil(this.totalElements / this.pageSize) : 1;
        this.currentPage = Math.min(page, this.totalPages);
      },
      error: (err) => {
        console.error('Error cargando Solicitudes', err);
        this.paginatedData = [];
        this.totalElements = 0;
        this.totalPages = 1;
        this.currentPage = 1;
      }
    });
  }

  loadFuncionarios(): void {
    this.usuariosService.getFuncionarios().subscribe({
      next: (respuesta: any[]) => {
        this.funcionariosOptions = respuesta.map(f => ({
          label: `${f.nombres} ${f.apellidos}`,
          value: f.uuidUsuario
        }));
      },
      error: (err) => {
        console.error('Error cargando funcionarios:', err);
        this.funcionariosOptions = [];
      }
    });
  }

  /**
   * Abre el diálogo de información de Solicitud
   */
  protected verMasInfo(solicitud: SolicitudDTORespuesta): void {
    this.solicitudesService.getSolicitud(solicitud.uuidSolicitud).subscribe({
      next: (solicitudDetallada) => {

        const tieneAnexos = solicitudDetallada.anexos && solicitudDetallada.anexos.length > 0;

        this.selectedSolicitudInfo = {
          Nombre: solicitudDetallada.nombre || 'N/A',
          Descripción: solicitudDetallada.descripcion,
          Estado: solicitudDetallada.estado,
          Consecutivo: solicitudDetallada.consecutivo || 'Sin consecutivo',
          Orden_del_Día_identificador: solicitudDetallada.ordenDelDia
            ? solicitudDetallada.ordenDelDia.uuidOrdenDelDia + " / " + (solicitudDetallada.ordenDelDia.nombre || '')
            : 'Sin orden del día asignado',

          Tipo_de_Solicitud: solicitudDetallada.tipoSolicitud.nombre,
          Solicitante: solicitudDetallada.informacionSolicitante.nombres + " " +
                      solicitudDetallada.informacionSolicitante.apellidos,

          Identificacion: solicitudDetallada.informacionSolicitante.tipoDocumento + " " +
                          solicitudDetallada.informacionSolicitante.numeroDocumento,

          Contacto: solicitudDetallada.informacionSolicitante.correoElectronico + " / " +
                    solicitudDetallada.informacionSolicitante.telefono
        };

        this.solicitudAnexos = solicitudDetallada.anexos || [];
        this.dialogUsaComponente = tieneAnexos;

        this.solicitudInfoDialogVisible = true;
      }
    });
  }

  abrirModalActualizarSolicitud(row: any): void {
    this.solicitudActualizar = {
      uuidSolicitud: row.uuidSolicitud,
      nombre: row.Solicitud,
      estado: row.Estado,
      uuidFuncionario: row.objFuncionario?.uuidUsuario || null
    };
    this.actualizarSolicitudDialogVisible = true;
  }

  guardarSolicitudActualizada(): void {
    this.inputNombreActualizar.touched = true;
    this.inputEstadoActualizar.touched = true;
    this.inputFuncionarioActualizar.touched = true;

    // Validar los campos obligatorios
    if (
      this.inputNombreActualizar.isInvalid() ||
      this.inputEstadoActualizar.isInvalid() ||
      this.inputFuncionarioActualizar.isInvalid()
    ) {
      this.toastService.showError('Error', 'Completa todos los campos requeridos.');
      return;
    }

    const peticion: any = {
      nombre: this.solicitudActualizar.nombre,
      consecutivo: this.solicitudActualizar.consecutivo,
      descripcion: this.solicitudActualizar.descripcion,
      estado: this.solicitudActualizar.estado,
      uuidFuncionario: this.solicitudActualizar.uuidFuncionario
    };

    this.solicitudesService.actualizarSolicitud(this.solicitudActualizar.uuidSolicitud, peticion)
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Solicitud actualizada', 'Cambios guardados correctamente.');
          this.actualizarSolicitudDialogVisible = false;
          this.resetFormulariosActualizar();
        },
        error: (err) => {
          this.actualizarSolicitudDialogVisible = false;
          this.resetFormulariosActualizar();
          this.errorHandlerService.handleError(err, 'Error actualizando la solicitud');
        }
      });
  }

  private resetFormulariosActualizar(): void {
    this.solicitudActualizar = {};
    this.inputNombreActualizar?.reset();
    this.inputDescripcionActualizar?.reset();
    this.inputConsecutivoActualizar?.reset();
    this.inputEstadoActualizar?.reset();
    this.inputFuncionarioActualizar?.reset();
  }

  buscarSolicitudes(value: string): void {
    this.solicitudFiltro = value ?? '';
    this.currentPage = 1;
    this.loadSolicitudes(1);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.loadSolicitudes(page);
  }

}
