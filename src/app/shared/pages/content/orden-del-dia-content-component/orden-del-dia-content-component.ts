import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudesService } from '../../../../core/services/solicitudes-service';
import { TableGenericComponent } from '../../../table-generic-component/table-generic-component';
import { ButtonComponent } from '../../../buttons/button-component/button-component';
import { CardMainComponent } from '../../../card-main-component/card-main-component';
import { Paginator } from '../../../paginator/paginator';
import { BarraBusquedaComponent } from '../../../search/barra-busqueda-component/barra-busqueda-component';
import { GenericDialogInfoComponent } from '../../../generic-dialog-info-component/generic-dialog-info-component';
import { GenericDialogFormComponent } from '../../../generic-dialog-form-component/generic-dialog-form-component';
import { InputTextComponent } from '../../../inputs/input-text-component/input-text-component';
import { OrdenDelDiaDTOPeticion } from '../../../../core/models/Solicitudes/DTORequest/OrdenDelDiaDTOPeticion';
import { OrdenDelDiaDTORespuesta } from '../../../../core/models/Solicitudes/DTOResponse/OrdenDelDiaDTORespuesta';
import { ToastService } from '../../../../core/services/toast-service';
import { ErrorHandlerService } from '../../../../core/services/error-handler-service';
import { InputTextTareaComponent } from '../../../inputs/input-text-tarea-component/input-text-tarea-component';
import { InputDateComponent } from '../../../inputs/input-date-component/input-date-component';
import { InputSelectComponent } from '../../../inputs/input-select-component/input-select-component';
import { ESTADO_BOOLEANO } from '../../../../core/constantes/constantes';
import { ACTIVO } from '../../../../core/constantes/constantes';
import { INACTIVO } from '../../../../core/constantes/constantes';
import { OrdenDelDiaVisualizadorComponent } from '../../../../core/secretario-general/components/orden-del-dia-visualizador-component/orden-del-dia-visualizador-component';
@Component({
  selector: 'app-orden-del-dia-content-component',
  imports: [
    CommonModule,
    CardMainComponent,
    Paginator,
    ButtonComponent,
    BarraBusquedaComponent,
    GenericDialogInfoComponent,
    GenericDialogFormComponent,
    InputTextComponent,
    InputTextTareaComponent,
    InputDateComponent,
    InputSelectComponent,
    OrdenDelDiaVisualizadorComponent
  ],
  templateUrl: './orden-del-dia-content-component.html',
  styleUrl: './orden-del-dia-content-component.css'
})
export class OrdenDelDiaContentComponent implements OnInit, AfterViewInit{
// Inputs Crear
  @ViewChild('inputNombre') inputNombre!: InputTextComponent;
  @ViewChild('inputDescripcion') inputDescripcion!: InputTextTareaComponent;
  @ViewChild('inputCiudad') inputCiudad!: InputTextComponent;
  @ViewChild('inputFecha') inputFecha!: InputDateComponent;
  @ViewChild('inputHoraInicio') inputHoraInicio!: InputTextComponent;
  @ViewChild('inputHoraFin') inputHoraFin!: InputTextComponent;
  @ViewChild('inputLugar') inputLugar!: InputTextComponent;
  @ViewChild('inputNumeroActa') inputNumeroActa!: InputTextComponent;

  // Inputs Actualizar
  @ViewChild('inputNombreActualizar') inputNombreActualizar!: InputTextComponent;
  @ViewChild('inputDescripcionActualizar') inputDescripcionActualizar!: InputTextTareaComponent;
  @ViewChild('inputCiudadActualizar') inputCiudadActualizar!: InputTextComponent;
  @ViewChild('inputFechaActualizar') inputFechaActualizar!: InputDateComponent;
  @ViewChild('inputHoraInicioActualizar') inputHoraInicioActualizar!: InputTextComponent;
  @ViewChild('inputHoraFinActualizar') inputHoraFinActualizar!: InputTextComponent;
  @ViewChild('inputLugarActualizar') inputLugarActualizar!: InputTextComponent;
  @ViewChild('inputNumeroActaActualizar') inputNumeroActaActualizar!: InputTextComponent;
  @ViewChild('inputEstadoActualizar') inputEstadoActualizar!: InputSelectComponent;

  // Búsqueda
  @ViewChild('busquedaNumeroActa') busquedaNumeroActa!: TemplateRef<any>;

  ordenInfoDialogVisible = false;
  ordenFormDialogVisible = false;
  ordenFormActualizarDialogVisible = false;

  estadosBooleano = ESTADO_BOOLEANO;
  ordenDelDiaVisible: boolean = false;
  ordenSeleccionada: any;

  selectedOrdenInfo: any = null;
  selectedOrdenForm: any = {};
  selectedOrdenActualizarForm: any = {};

  // Paginación
  currentPage = 1;
  pageSize = 5;
  totalElements = 0;
  totalPages = 1;
  busquedaActual = '';

  tableComponent = TableGenericComponent;
  pretitleComponentComponent = ButtonComponent;

  buttonsCard: any[] = [];

  headers = [
    { title: 'acta', headerTemplate: this.busquedaNumeroActa },
    { title: 'estado' }
  ];

  paginatedData: any[] = [];

  constructor(
    private solicitudesService: SolicitudesService,
    private toastService: ToastService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.cargarOrdenes();

    this.buttonsCard = [
      {
        imgUrl: 'buttons/add.svg',
        color: '#1E257B',
        width: '20px',
        height: '20px',
        onClick: () => this.crearOrden()
      }
    ];
  }

  ngAfterViewInit(): void {
    this.headers = [
      { title: 'acta', headerTemplate: this.busquedaNumeroActa },
      { title: 'estado' }
    ];
  }

  abrirOrdenDelDia(row: any) {
    this.solicitudesService.getOrdenDelDia(row.uuidOrdenDelDia).subscribe({
      next: (orden: OrdenDelDiaDTORespuesta) => {
        this.ordenSeleccionada = orden;
        this.ordenSeleccionada.estado = orden.estado ? ACTIVO : INACTIVO;
        this.ordenDelDiaVisible = true;
      }
    });
  }
  
  cargarOrdenes(page: number = 1, filtro: string = ''): void {
    const backendPage = page - 1;

    const observable = filtro
      ? this.solicitudesService.buscarOrdenesDelDia(filtro, backendPage, this.pageSize)
      : this.solicitudesService.getOrdenesDelDiaPaginado(backendPage, this.pageSize);

    observable.subscribe({
      next: (resp) => {
        if (!resp.content?.length) {
          this.paginatedData = [];
          this.totalElements = 0;
          return;
        }

        this.paginatedData = resp.content.map(o => ({
          uuidOrdenDelDia: o.uuidOrdenDelDia,
          nombre: o.nombre,
          acta: o.numeroActa,
          estado: o.estado ? ACTIVO : INACTIVO
        }));

        this.totalElements = resp.totalElements;
        this.totalPages = Math.ceil(this.totalElements / this.pageSize);
        this.currentPage = page;
        this.busquedaActual = filtro;
      },
      error: err => console.error(err)
    });
  }

  onBuscarPorNumeroActa(numeroActa: string): void {
    this.currentPage = 1;
    this.cargarOrdenes(1, numeroActa);
  }

  onPageChange(page: number): void {
    this.cargarOrdenes(page, this.busquedaActual);
  }

  crearOrden(): void {
    this.selectedOrdenForm = {};
    this.inputNombre.reset();
    this.inputDescripcion.reset();
    this.inputCiudad.reset();
    this.inputFecha.reset();
    this.inputHoraInicio.reset();
    this.inputHoraFin.reset();
    this.inputLugar.reset();
    this.inputNumeroActa.reset();
    this.ordenFormDialogVisible = true;
  }

  guardarOrden(): void {
    this.inputNombre.touched = true;
    this.inputNumeroActa.touched = true;

    if (
      this.inputNombre.isInvalid() ||
      this.inputNumeroActa.isInvalid()
    ) {
      this.toastService.showError('Error', 'Complete los campos requeridos');
      return;
    }

    const peticion: OrdenDelDiaDTOPeticion = {
      nombre: this.selectedOrdenForm.nombre,
      descripcion: this.selectedOrdenForm.descripcion,
      ciudad: this.selectedOrdenForm.ciudad,
      fecha: this.selectedOrdenForm.fecha,
      horaInicio: this.selectedOrdenForm.horaInicio,
      horaFin: this.selectedOrdenForm.horaFin,
      lugarReunion: this.selectedOrdenForm.lugarReunion,
      numeroActa: this.selectedOrdenForm.numeroActa,
      estado: true
    };

    this.solicitudesService.crearOrdenDelDia(peticion).subscribe({
      next: () => {
        this.toastService.showSuccess('Éxito', 'Orden del día creada');
        this.ordenFormDialogVisible = false;
        this.cargarOrdenes();
      },
      error: err => this.errorHandlerService.handleError(err, 'Error creando orden')
    });
  }

  abrirActualizarOrden(row: any): void {
    this.solicitudesService.getOrdenDelDia(row.uuidOrdenDelDia).subscribe({
      next: (orden: OrdenDelDiaDTORespuesta) => {
        this.selectedOrdenActualizarForm = orden;
        this.selectedOrdenActualizarForm.estado = orden.estado ? ACTIVO : INACTIVO;
        this.ordenFormActualizarDialogVisible = true;
      }
    });
  }

  guardarOrdenActualizada(): void {
    this.inputNombreActualizar.touched = true;
    this.inputNumeroActaActualizar.touched = true;

    if (
      this.inputNombreActualizar.isInvalid() ||
      this.inputNumeroActaActualizar.isInvalid()
    ) {
      this.toastService.showError('Error', 'Complete los campos requeridos');
      return;
    }

    const peticion: OrdenDelDiaDTOPeticion = {
      nombre: this.selectedOrdenActualizarForm.nombre,
      descripcion: this.selectedOrdenActualizarForm.descripcion,
      ciudad: this.selectedOrdenActualizarForm.ciudad,
      fecha: this.selectedOrdenActualizarForm.fecha,
      horaInicio: this.selectedOrdenActualizarForm.horaInicio,
      horaFin: this.selectedOrdenActualizarForm.horaFin,
      lugarReunion: this.selectedOrdenActualizarForm.lugarReunion,
      numeroActa: this.selectedOrdenActualizarForm.numeroActa,
      estado: this.selectedOrdenActualizarForm.estado === ACTIVO,
    };

    this.solicitudesService.actualizarOrdenDelDia(
      this.selectedOrdenActualizarForm.uuidOrdenDelDia,
      peticion
    ).subscribe({
      next: () => {
        this.toastService.showSuccess('Éxito', 'Orden actualizada');
        this.ordenFormActualizarDialogVisible = false;
        this.cargarOrdenes(this.currentPage, this.busquedaActual);
      },
      error: err => this.errorHandlerService.handleError(err, 'Error actualizando orden')
    });
  }

  verMasInfo(row: any): void {
    this.solicitudesService.getOrdenDelDia(row.uuidOrdenDelDia).subscribe({
      next: (orden: OrdenDelDiaDTORespuesta) => {
        this.selectedOrdenInfo = {
          Nombre: orden.nombre,
          Descripción: orden.descripcion,
          Ciudad: orden.ciudad,
          Fecha: orden.fecha,
          Hora_Inicio: orden.horaInicio,
          Hora_Fin: orden.horaFin,
          Lugar: orden.lugarReunion,
          Acta: orden.numeroActa,
          Estado: orden.estado ? ACTIVO : INACTIVO
        };
        this.ordenInfoDialogVisible = true;
      }
    });
  }
}
