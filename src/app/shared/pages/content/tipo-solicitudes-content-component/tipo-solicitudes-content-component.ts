/**
 * Componente tipoSolicitudContentComponent
 * Author: Julian David Camacho Erazo  {@literal <jdacamacho@unicauca.edu.co>}
 */

import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { TableGenericComponent } from '../../../table-generic-component/table-generic-component';
import { CommonModule } from '@angular/common';
import { CardMainComponent } from '../../../card-main-component/card-main-component';
import { ButtonComponent } from '../../../buttons/button-component/button-component';
import { Paginator } from "../../../paginator/paginator";
import { BarraBusquedaComponent } from '../../../search/barra-busqueda-component/barra-busqueda-component';
import { TipoSolicitudService } from '../../../../core/services/tipo-solicitud-service';
import { GenericDialogInfoComponent } from '../../../generic-dialog-info-component/generic-dialog-info-component';
import { TipoSolicitudDTORespuesta } from '../../../../core/models/TipoSolicitud/DTOResponse/TipoSolicitudDTORespuesta';
import { GenericDialogUploadFileComponent } from '../../../generic-dialog-upload-file-component/generic-dialog-upload-file-component';
import { ToastService } from '../../../../core/services/toast-service';
import { ErrorHandlerService } from '../../../../core/services/error-handler-service';
import { InputSelectComponent } from '../../../inputs/input-select-component/input-select-component';
import { GenericDialogFormComponent } from '../../../generic-dialog-form-component/generic-dialog-form-component';
import { UsuariosService } from '../../../../core/services/usuarios-service';
import { UsuarioLivianoDTORespuesta } from '../../../../core/models/Usuario/DTOResponse/UsuarioLivianoDTORespuesta';
import { TipoSolicitudDTOPeticion } from '../../../../core/models/TipoSolicitud/DTORequest/TipoSolicitudDTOPeticion';
import { GenericDialogStepsFormComponent } from '../../../generic-dialog-steps-form-component/generic-dialog-steps-form-component';

@Component({
  selector: 'app-tipo-solicitudes-content-component',
  imports: [CommonModule, CardMainComponent, Paginator, BarraBusquedaComponent, ButtonComponent, 
    GenericDialogInfoComponent, GenericDialogUploadFileComponent, InputSelectComponent, GenericDialogFormComponent,
    GenericDialogStepsFormComponent
  ],
  templateUrl: './tipo-solicitudes-content-component.html',
  styleUrl: './tipo-solicitudes-content-component.css'
})
export class TipoSolicitudesContentComponent implements OnInit{
  // Flags de visibilidad de diálogos
  tipoInfoDialogVisible = false;
  tipoUploadDialogVisible = false;
  funcionarioFormActualizarDialogVisible= false;

  // Objeto seleccionado para edición o información
  selectedTipoInfo: any = null;
  selectedTipoSolicitudActualizarFuncionarioForm: any = {};

  // Archivo actual cargado
  archivoSeleccionado: File | null = null;

  currentPage = 1; // Página actual
  pageSize = 5;   // Tamaño de página
  totalElements = 0;
  totalPages = 1;
  tipoDeSolicitudFiltro: string = '';
  funcionarioFiltro: string = '';

  tableComponent = TableGenericComponent; // Componente de tabla
  pretitleComponentComponent = ButtonComponent; // Componente pre-title
  buttonsCard: any[] = [];
  funcionariosOptions: { label: string; value: string }[] = [];

  dialogoStepsVisible = false;
  steps: { title: string; contentTemplate: TemplateRef<any> }[] = [];

  @ViewChild('step1', { static: true }) step1Template!: TemplateRef<any>;
  @ViewChild('step2', { static: true }) step2Template!: TemplateRef<any>;

  // Encabezados de la tabla, algunos con template de búsqueda
  headers: any[] = [
    { title: 'Solicitud', headerTemplate: null },
    { title: 'Funcionario', headerTemplate: null }
  ];

  @ViewChild('inputFuncionario') inputFuncionario!: InputSelectComponent;
  @ViewChild('busquedaTipoSolicitud') busquedaTipoSolicitud!: TemplateRef<any>; // Template búsqueda Responsable
  @ViewChild('busquedaFuncionario') busquedaFuncionario!: TemplateRef<any>;             // Template búsqueda Fecha

  paginatedData: any[] = []; // Data de la página actual (proviene del backend)

  constructor(private tipoSolicitudesService: TipoSolicitudService, private toastService: ToastService,
    private errorHandlerService: ErrorHandlerService, private usuariosService: UsuariosService
  ) {}
  
  ngOnInit(): void {
    this.loadTiposSolicitudes();
    this.loadFuncionarios();

    this.steps = [
      { title: 'Paso 1: Información del Tipo de Solicitud', contentTemplate: this.step1Template },
      { title: 'Paso 2: Anexos', contentTemplate: this.step2Template },
    ];

    this.buttonsCard = [
      {
        imgUrl: 'buttons/add.svg',
        color: '#1E257B',
        width: '20px',
        height: '20px',
        onClick: () => this.abrirDialogoStepsPrueba() 
      },
      {
        imgUrl: 'buttons/upload.svg',
        color: '#1E257B',
        width: '20px',
        height: '20px',
        onClick: () => this.abrirDialogoUpload() 
      }
    ];
  }

  ngAfterViewInit(): void {
    // Asignar templates de búsqueda a los encabezados
    this.headers = [
      { title: 'Solicitud', headerTemplate: this.busquedaTipoSolicitud },
      { title: 'Funcionario', headerTemplate: this.busquedaFuncionario }
    ];
  }

  abrirDialogoStepsPrueba(): void {
    this.dialogoStepsVisible = true;
  }

  loadFuncionarios(): void {
    this.usuariosService.getFuncionarios().subscribe({
      next: (respuesta: UsuarioLivianoDTORespuesta[]) => {
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

  loadTiposSolicitudes(page: number = 1): void {
    const backendPage = page - 1; 

    const observable =
      this.tipoDeSolicitudFiltro.trim() !== '' || this.funcionarioFiltro.trim() !== ''
        ? this.tipoSolicitudesService.getTiposSolicitudFiltrado (this.tipoDeSolicitudFiltro, this.funcionarioFiltro, backendPage, this.pageSize)
        : this.tipoSolicitudesService.getTiposSolicitudPaginado(backendPage, this.pageSize);

    observable.subscribe({
      next: (respuesta) => {
        if (respuesta.content.length === 0) {
          this.paginatedData = [];
          this.totalElements = 0;
          this.totalPages = 1;
          this.currentPage = 1;
          return;
        }
        this.paginatedData = (respuesta.content || []).map((tipoSolicitud:any) => ({
          ...tipoSolicitud,
          Solicitud: tipoSolicitud.nombre,
          Funcionario: `${tipoSolicitud.objFuncionarioEncargado?.nombres ?? ''} ${tipoSolicitud.objFuncionarioEncargado?.apellidos ?? ''}`.trim()
        }));

        this.totalElements = respuesta.totalElements ?? 0;
        this.totalPages = this.totalElements > 0 ? Math.ceil(this.totalElements / this.pageSize) : 1;
        this.currentPage = Math.min(page, this.totalPages);
      },
      error: (err) => console.error('Error cargando Tipos de Solicitudes', err)
    });
  }

  protected guardarFuncionarioTipoSolicitud(): void {
    this.inputFuncionario.touched = true;

    if (this.inputFuncionario.isInvalid()) return;

    const peticion: TipoSolicitudDTOPeticion = {
      nombre: this.selectedTipoSolicitudActualizarFuncionarioForm.nombre,
      descripcion: this.selectedTipoSolicitudActualizarFuncionarioForm.descripcion,
      seccion: this.selectedTipoSolicitudActualizarFuncionarioForm.seccion,
      anexos: (this.selectedTipoSolicitudActualizarFuncionarioForm.anexos || []).map((a: any) => ({
        nombre: a.nombre,
        descripcion: a.descripcion,
        formato: a.formato,
        obligatoriedad: a.obligatoriedad
      })),
      uuidFuncionario: this.inputFuncionario.value
    };
    const uuidTipoSolicitud = this.selectedTipoSolicitudActualizarFuncionarioForm.uuidTipoSolicitud;
    this.tipoSolicitudesService.actualizarTipoSolicitud(uuidTipoSolicitud, peticion).subscribe({
      next: () => {
        this.toastService.showSuccess(
          'Funcionario actualizado',
          'El funcionario fue asignado correctamente al tipo de solicitud.'
        );
        this.funcionarioFormActualizarDialogVisible = false;
        this.loadTiposSolicitudes();
      },
      error: (err) => {
        this.funcionarioFormActualizarDialogVisible = false;
        this.errorHandlerService.handleError(err, 'Error actualizando funcionario');
      }
    });
  }

  /**
   * Abre el diálogo de información del Tipo de Solicitud
   */
  protected verMasInfo(tipoSolicitud: TipoSolicitudDTORespuesta): void {
    this.tipoSolicitudesService.getTipoSolicitud  (tipoSolicitud.uuidTipoSolicitud).subscribe({
      next: (tipoSolicitudDetallado: TipoSolicitudDTORespuesta) => {
        const anexosTexto = (tipoSolicitudDetallado.anexos || [])
          .map(a => 
            `\n• ${a.nombre}\n${a.descripcion}\nObligatorio: ${a.obligatoriedad ? 'Sí ✅' : 'No ❌'}`
          )
          .join('\n');

        this.selectedTipoInfo = {
          Nombre: tipoSolicitudDetallado.nombre,
          Descripción: tipoSolicitudDetallado.descripcion,
          Sección: tipoSolicitudDetallado.seccion,
          Anexos: anexosTexto || 'Sin anexos registrados',
          Funcionario_Responsable: `${tipoSolicitudDetallado.objFuncionarioEncargado?.nombres ?? ''} ${tipoSolicitudDetallado.objFuncionarioEncargado?.apellidos ?? ''}`.trim(),
          Correo_Electrónico: tipoSolicitudDetallado.objFuncionarioEncargado?.correoElectronico || 'N/A'
        };
        this.tipoInfoDialogVisible = true;
      },
      error: (err) => {
        console.error('Error cargando Tipo de Solicitud', err);
      }
    });
  }

  protected abrirModalActualizarTipoSolicitud(usuario: any): void {

  }

  protected abrirModalActualizarFuncionarioTipoSolicitud(tipoSolicitud: any): void {
    this.selectedTipoSolicitudActualizarFuncionarioForm = { ...tipoSolicitud };

    this.selectedTipoSolicitudActualizarFuncionarioForm.uuidUsuarioFuncionario =
      tipoSolicitud.objFuncionarioEncargado?.uuidUsuario || null;
    this.selectedTipoSolicitudActualizarFuncionarioForm.nombreFuncionarioActual =
      tipoSolicitud.objFuncionarioEncargado
        ? `${tipoSolicitud.objFuncionarioEncargado.nombres} ${tipoSolicitud.objFuncionarioEncargado.apellidos}`
        : 'Sin funcionario asignado';

    this.funcionarioFormActualizarDialogVisible = true;
  }


  protected abrirDialogoUpload(): void {
    this.archivoSeleccionado = null; 
    this.tipoUploadDialogVisible = true;
  }

  protected guardarArchivo(file: File): void {
    if (!file) {
      this.toastService.showError('Error', 'Debe seleccionar un archivo antes de continuar');
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    const extensionesPermitidas = ['csv', 'xls', 'xlsx'];

    if (!extension || !extensionesPermitidas.includes(extension)) {
      this.toastService.showError('Error', 'Solo se permiten archivos CSV o Excel (.csv, .xls, .xlsx)');
      return;
    }

    this.toastService.showInfo('Procesando', 'Su archivo se está procesando...');

    this.tipoSolicitudesService.crearTiposSolicitudDesdeArchivo(file).subscribe({
      next: (respuesta) => {
        this.toastService.showSuccess(
          'Archivo cargado',
          `Se subieron ${respuesta.length} registros al sistema. Para más detalles consulte el historial.`
        );
        this.tipoUploadDialogVisible = false;
        this.loadTiposSolicitudes();
      },
      error: (err) => {
        this.tipoUploadDialogVisible = false;
        this.errorHandlerService.handleError(err, 'Error creando Tipos de Solicitudes');
      }
    });
  }

  onBuscarTipoSolicitud(tipoSolicitud: string): void {
    this.tipoDeSolicitudFiltro = tipoSolicitud;
    this.currentPage = 1;
    this.paginatedData = [];
    this.totalElements = 0;
    this.totalPages = 0;
    this.loadTiposSolicitudes(1);
  }

  onBuscarFuncionario(funcionario: string): void {
    this.funcionarioFiltro = funcionario;
    this.currentPage = 1;
    this.paginatedData = [];
    this.totalElements = 0;
    this.totalPages = 0;
    this.loadTiposSolicitudes(1);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.loadTiposSolicitudes(page);
  }
}
