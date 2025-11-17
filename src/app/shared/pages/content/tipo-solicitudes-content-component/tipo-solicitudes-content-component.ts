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
import { InputTextComponent } from '../../../inputs/input-text-component/input-text-component';
import { SimpleButtonComponent } from '../../../buttons/simple-button-component/simple-button-component';
import { RolesService } from '../../../../core/services/roles-service';

@Component({
  selector: 'app-tipo-solicitudes-content-component',
  imports: [CommonModule, CardMainComponent, Paginator, BarraBusquedaComponent, ButtonComponent, 
    GenericDialogInfoComponent, GenericDialogUploadFileComponent, InputSelectComponent, GenericDialogFormComponent,
    GenericDialogStepsFormComponent, InputTextComponent, SimpleButtonComponent, ButtonComponent
  ],
  templateUrl: './tipo-solicitudes-content-component.html',
  styleUrl: './tipo-solicitudes-content-component.css'
})
export class TipoSolicitudesContentComponent implements OnInit{
  // Referencias a inputs y templates
  // Formulario crear tipo solicitud
  @ViewChild('inputNombreTS') inputNombreCrearTS!: InputTextComponent;
  @ViewChild('inputDescripcionTS') inputDescripcionCrearTS!: InputTextComponent;
  @ViewChild('inputSeccionTS') inputSeccionCrearTS!: InputSelectComponent;
  @ViewChild('inputPerfilSolicitanteTS') inputPerfilSolicitanteCrearTS!: InputSelectComponent;
  @ViewChild('inputFuncionarioTS') inputFuncionarioCrearTS!: InputSelectComponent;
  @ViewChild('inputTipoAnexoNombre') inputTipoAnexoNombre?: InputTextComponent;
  @ViewChild('inputTipoAnexoDescripcion') inputTipoAnexoDescripcion?: InputTextComponent;
  @ViewChild('inputTipoAnexoFormato') inputTipoAnexoFormato?: InputSelectComponent;
  @ViewChild('inputTipoAnexoObligatoriedad') inputTipoAnexoObligatoriedad?: InputSelectComponent;
  // Referencias a inputs y templates
  // Formulario actualizar tipo solicitud
  @ViewChild('inputNombreTSUpdate') inputNombreUpdate?: InputTextComponent;
  @ViewChild('inputDescripcionTSUpdate') inputDescripcionUpdate?: InputTextComponent;
  @ViewChild('inputSeccionTSUpdate') inputSeccionUpdate?: InputSelectComponent;
  @ViewChild('inputPerfilSolicitanteTSUpdate') inputPerfilSolicitanteUpdate?: InputSelectComponent;
  @ViewChild('inputFuncionarioTSUpdate') inputFuncionarioUpdate?: InputSelectComponent;
  @ViewChild('inputTipoAnexoNombreUpdate') inputTipoAnexoNombreUpdate?: InputTextComponent;
  @ViewChild('inputTipoAnexoDescripcionUpdate') inputTipoAnexoDescripcionUpdate?: InputTextComponent;
  @ViewChild('inputTipoAnexoFormatoUpdate') inputTipoAnexoFormatoUpdate?: InputSelectComponent;
  @ViewChild('inputTipoAnexoObligatoriedadUpdate') inputTipoAnexoObligatoriedadUpdate?: InputSelectComponent;

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

  //Dialogo con steps para crear y actualizar tipo de solicitud
  dialogoStepsVisible = false;
  actualizarDialogVisible = false;
  forceAnexoValidation = false;
  steps: { 
    title: string; 
    contentTemplate: TemplateRef<any>; 
    canContinue?: () => boolean; 
  }[] = [];

  stepsActualizar: {
    title: string;
    contentTemplate: TemplateRef<any>;
    canContinue?: () => boolean;
  }[] = [];

  perfilesSolicitante: { label: string; value: string }[] = [];

  // Templates de los steps
  @ViewChild('step1', { static: true }) step1Template!: TemplateRef<any>;
  @ViewChild('step2', { static: true }) step2Template!: TemplateRef<any>;
  @ViewChild('step1Update', { static: true }) step1UpdateTemplate!: TemplateRef<any>;
  @ViewChild('step2Update', { static: true }) step2UpdateTemplate!: TemplateRef<any>;


  headers: any[] = [
    { title: 'Solicitud', headerTemplate: null },
    { title: 'Funcionario', headerTemplate: null }
  ];

  secciones: { label: string; value: string }[] = [
    { label: 'Asuntos Decano', value: 'asuntos decano' },
    { label: 'Asuntos Pregrado', value: 'asuntos pregrado' },
    { label: 'Asuntos Posgrados', value: 'asuntos posgrados' },
    { label: 'Asuntos Delegados en Decano', value: 'asuntos delegados en decano' },
    { label: 'Solicitud Comisión Académica al Interior del País', value: 'solicitud comisión académica al interior del país' },
    { label: 'Solicitud Comisión Académica al Exterior al País', value: 'solicitud comisión académica al exterior al país' },
    { label: 'Informe de Comisión Académica', value: 'informe de comisión académica' },
    { label: 'Asuntos Varios', value: 'asuntos varios' }
  ];

  @ViewChild('inputFuncionario') inputFuncionario!: InputSelectComponent;
  @ViewChild('busquedaTipoSolicitud') busquedaTipoSolicitud!: TemplateRef<any>; // Template búsqueda Responsable
  @ViewChild('busquedaFuncionario') busquedaFuncionario!: TemplateRef<any>;             // Template búsqueda Fecha

  // Datos para crear nuevo tipo de solicitud
  nuevoTipoSolicitud: any = {};
  nuevoTipoAnexo: any = {};
  paginatedData: any[] = [];
  tiposAnexos: any[] = []; 
  // Datos para actualizar tipo de solicitud
  nuevoTipoSolicitudUpdate: any = {};
  nuevoTipoAnexoUpdate: any = {};
  tiposAnexosUpdate: any[] = [];
  forceAnexoValidationUpdate = false;

  constructor(private tipoSolicitudesService: TipoSolicitudService, private toastService: ToastService,
    private errorHandlerService: ErrorHandlerService, private usuariosService: UsuariosService,
    private rolesService: RolesService
  ) {}
  
  ngOnInit(): void {
    this.loadTiposSolicitudes();
    this.loadFuncionarios();
    this.loadPerfilesSolicitante(); 

    this.steps = [
      { title: 'Paso 1: Información del Tipo de Solicitud', contentTemplate: this.step1Template, canContinue: () => this.canContinueStep1()},
      { title: 'Paso 2: Anexos', contentTemplate: this.step2Template,  canContinue: () => this.canContinueStep2() },
    ];

    this.stepsActualizar = [
      { title: 'Paso 1: Información (Actualizar)', contentTemplate: this.step1UpdateTemplate, canContinue: () => this.canContinueStep1Update() },
      { title: 'Paso 2: Anexos (Actualizar)', contentTemplate: this.step2UpdateTemplate, canContinue: () => this.canContinueStep2Update() }
    ];

    this.buttonsCard = [
      {
        imgUrl: 'buttons/add.svg',
        color: '#1E257B',
        width: '20px',
        height: '20px',
        onClick: () => this.abrirDialogCrearTipoSolicitud() 
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
    this.headers = [
      { title: 'Solicitud', headerTemplate: this.busquedaTipoSolicitud },
      { title: 'Funcionario', headerTemplate: this.busquedaFuncionario }
    ];
  }

  // Abre el diálogo para crear un nuevo Tipo de Solicitud
  abrirDialogCrearTipoSolicitud(): void {
    this.resetFormulariosCrear();
    this.dialogoStepsVisible = true;
  }

  // Carga la lista de funcionarios para el filtro y selección
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

  // Carga los tipos de solicitudes con paginación y filtros
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

  loadPerfilesSolicitante(): void {
    this.rolesService.getRoles().subscribe({
      next: (perfiles: any[]) => {
        this.perfilesSolicitante = perfiles.map(p => ({
          label: p.nombre, 
          value: p.nombre    
        }));
      },
      error: (err) => {
        console.error('Error cargando perfiles de solicitante', err);
        this.perfilesSolicitante = [];
      }
    });
  }

  // Validaciones para avanzar en los steps
  canContinueStep1(): boolean {
    return !!(
      this.nuevoTipoSolicitud.nombre?.trim() &&
      this.nuevoTipoSolicitud.seccion &&
      this.nuevoTipoSolicitud.uuidFuncionario
    );
  }

  // Validaciones para avanzar en los steps
  canContinueStep2(): boolean {
    return this.tiposAnexos.length > 0;
  }

  // Validaciones para avanzar en los steps
  canContinueStep1Update(): boolean {
    return !!(
      this.nuevoTipoSolicitudUpdate.nombre?.trim() &&
      this.nuevoTipoSolicitudUpdate.seccion &&
      this.nuevoTipoSolicitudUpdate.uuidFuncionario
    );
  }

  // Validaciones para avanzar en los steps
  canContinueStep2Update(): boolean {
    return this.tiposAnexosUpdate.length > 0;
  }

  // Métodos para agregar y eliminar tipos de anexos (actualizar)
  agregarTipoAnexoUpdate() {
    this.forceAnexoValidationUpdate = true;

    if (
      !this.nuevoTipoAnexoUpdate.nombre?.trim() ||
      !this.nuevoTipoAnexoUpdate.formato ||
      this.nuevoTipoAnexoUpdate.obligatoriedad == null
    ) {
      return;
    }

    this.tiposAnexosUpdate.push({ ...this.nuevoTipoAnexoUpdate });

    this.nuevoTipoAnexoUpdate = {
      nombre: '',
      descripcion: '',
      formato: '',
      obligatoriedad: null
    };

    this.inputTipoAnexoNombreUpdate?.reset();
    this.inputTipoAnexoDescripcionUpdate?.reset();
    this.inputTipoAnexoFormatoUpdate?.reset();
    this.inputTipoAnexoObligatoriedadUpdate?.reset();

    this.forceAnexoValidationUpdate = false;
  }

  eliminarTipoAnexoUpdate(index: number) {
    this.tiposAnexosUpdate.splice(index, 1);
  }

  // Métodos para agregar y eliminar tipos de anexos (crear)
  agregarTipoAnexo() {
    this.forceAnexoValidation = true; 

    if (
    !this.nuevoTipoAnexo.nombre?.trim() ||
    !this.nuevoTipoAnexo.formato ||
    this.nuevoTipoAnexo.obligatoriedad == null || this.nuevoTipoAnexo.obligatoriedad === undefined
    ) {
      return; 
    }

    this.tiposAnexos.push({ ...this.nuevoTipoAnexo });
    this.nuevoTipoAnexo = {
      nombre: '',
      descripcion: '',
      formato: '',
      obligatoriedad: null
    };

    this.inputTipoAnexoNombre?.reset();
    this.inputTipoAnexoDescripcion?.reset();
    this.inputTipoAnexoFormato?.reset();
    this.inputTipoAnexoObligatoriedad?.reset();
    this.forceAnexoValidation = false; 
  }

  eliminarTipoAnexo(index: number) {
    this.tiposAnexos.splice(index, 1);
  }

  // Guarda el nuevo tipo de solicitud
  protected guardarTipoSolicitud(): void {
    if (!this.canContinueStep1() || !this.canContinueStep2()) {
      this.toastService.showError(
        'No se puede guardar',
        'Por favor completa los pasos antes de continuar.'
      );
      return;
    }

    const peticion: TipoSolicitudDTOPeticion = {
      nombre: this.nuevoTipoSolicitud.nombre.trim(),
      descripcion: this.nuevoTipoSolicitud.descripcion?.trim() || '',
      seccion: this.nuevoTipoSolicitud.seccion,
      perfilSolicitante: this.nuevoTipoSolicitud.perfilSolicitante,
      uuidFuncionario: this.nuevoTipoSolicitud.uuidFuncionario,
      anexos: this.tiposAnexos.map(a => ({
        nombre: a.nombre,
        descripcion: a.descripcion?.trim() || '',
        formato: a.formato,
        obligatoriedad: a.obligatoriedad
      }))
    };

    this.tipoSolicitudesService.crearTipoSolicitud(peticion).subscribe({
      next: () => {
        this.toastService.showSuccess(
          'Tipo de Solicitud creado',
          'El registro fue creado correctamente.'
        );

        this.dialogoStepsVisible = false;
        this.loadTiposSolicitudes();
        this.resetFormulariosCrear();
      },
      error: (err) => {
        this.dialogoStepsVisible = false;
        this.resetFormulariosCrear();
        this.errorHandlerService.handleError(err, 'Error creando el Tipo de Solicitud');
      }
    });
  }

  // Resetea los formularios de creación
  private resetFormulariosCrear(): void {
    this.nuevoTipoSolicitud = {};
    this.nuevoTipoAnexo = {};
    this.tiposAnexos = [];

    this.inputNombreCrearTS?.reset();
    this.inputDescripcionCrearTS?.reset();
    this.inputSeccionCrearTS?.reset();
    this.inputFuncionarioCrearTS?.reset();

    this.inputTipoAnexoNombre?.reset();
    this.inputTipoAnexoDescripcion?.reset();
    this.inputTipoAnexoFormato?.reset();
    this.inputTipoAnexoObligatoriedad?.reset();
  }

  // Guarda la actualización del tipo de solicitud
  protected actualizarTipoSolicitud(): void {
    if (!this.canContinueStep1Update() || !this.canContinueStep2Update()) {
      this.toastService.showError('No se puede actualizar', 'Por favor completa los pasos antes de continuar.');
      return;
    }

    const peticion: TipoSolicitudDTOPeticion = {
      nombre: this.nuevoTipoSolicitudUpdate.nombre.trim(),
      descripcion: this.nuevoTipoSolicitudUpdate.descripcion.trim(),
      seccion: this.nuevoTipoSolicitudUpdate.seccion,
      perfilSolicitante: this.nuevoTipoSolicitudUpdate.perfilSolicitante,
      uuidFuncionario: this.nuevoTipoSolicitudUpdate.uuidFuncionario,
      anexos: this.tiposAnexosUpdate.map(a => ({
        nombre: a.nombre,
        descripcion: a.descripcion,
        formato: a.formato,
        obligatoriedad: a.obligatoriedad
      }))
    };

    console.log('Actualizar Tipo de Solicitud con petición:', peticion);

    const uuid = this.nuevoTipoSolicitudUpdate.uuidTipoSolicitud || this.nuevoTipoSolicitudUpdate.uuidTipoSolicitud;
    this.tipoSolicitudesService.actualizarTipoSolicitud(uuid, peticion).subscribe({
      next: () => {
        this.toastService.showSuccess('Tipo de Solicitud actualizado', 'Cambios guardados.');
        this.actualizarDialogVisible = false;
        this.loadTiposSolicitudes();
        this.resetFormulariosActualizar();
      },
      error: (err) => {
        this.actualizarDialogVisible = false;
        this.resetFormulariosActualizar();
        this.errorHandlerService.handleError(err, 'Error actualizando Tipo de Solicitud');
      }
    });
  }

  // Resetea los formularios de actualización
  private resetFormulariosActualizar(): void {
    this.nuevoTipoSolicitudUpdate = {};
    this.nuevoTipoAnexoUpdate = {};
    this.tiposAnexosUpdate = [];

    this.inputNombreUpdate?.reset();
    this.inputDescripcionUpdate?.reset();
    this.inputSeccionUpdate?.reset();
    this.inputFuncionarioUpdate?.reset();

    this.inputTipoAnexoNombreUpdate?.reset();
    this.inputTipoAnexoDescripcionUpdate?.reset();
    this.inputTipoAnexoFormatoUpdate?.reset();
    this.inputTipoAnexoObligatoriedadUpdate?.reset();
  }

  // Guarda el funcionario asignado al tipo de solicitud
  protected guardarFuncionarioTipoSolicitud(): void {
    this.inputFuncionario.touched = true;

    if (this.inputFuncionario.isInvalid()) return;

    const peticion: TipoSolicitudDTOPeticion = {
      nombre: this.selectedTipoSolicitudActualizarFuncionarioForm.nombre,
      descripcion: this.selectedTipoSolicitudActualizarFuncionarioForm.descripcion,
      seccion: this.selectedTipoSolicitudActualizarFuncionarioForm.seccion,
      perfilSolicitante: this.selectedTipoSolicitudActualizarFuncionarioForm.perfilSolicitante,
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
    this.tipoSolicitudesService.getTipoSolicitud(tipoSolicitud.uuidTipoSolicitud).subscribe({
      next: (tipoSolicitudDetallado: TipoSolicitudDTORespuesta) => {
        const anexosTexto = (tipoSolicitudDetallado.anexos || [])
          .map(a => 
            `\n• ${a.nombre}\n${a.descripcion}\n${a.formato}\nObligatorio: ${a.obligatoriedad ? 'Sí ✅' : 'No ❌'}`
          )
          .join('\n');

        this.selectedTipoInfo = {
          Nombre: tipoSolicitudDetallado.nombre,
          Descripción: tipoSolicitudDetallado.descripcion,
          Sección: tipoSolicitudDetallado.seccion,
          Perfil_Solicitante: tipoSolicitudDetallado.perfilSolicitante,
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

  // Abre el diálogo para actualizar un Tipo de Solicitud
  protected abrirModalActualizarTipoSolicitud(row: any): void {
    this.tipoSolicitudesService.getTipoSolicitud(row.uuidTipoSolicitud).subscribe({
      next: (tipoSolicitud) => {
        this.nuevoTipoSolicitudUpdate = {
          uuidTipoSolicitud: tipoSolicitud.uuidTipoSolicitud,
          nombre: tipoSolicitud.nombre,
          descripcion: tipoSolicitud.descripcion,
          seccion: tipoSolicitud.seccion,
          uuidFuncionario: tipoSolicitud.objFuncionarioEncargado?.uuidUsuario || null,
          perfilSolicitante: tipoSolicitud.perfilSolicitante
        };

        this.tiposAnexosUpdate = (tipoSolicitud.anexos || []).map((a: any) => ({
          nombre: a.nombre,
          descripcion: a.descripcion,
          formato: a.formato,
          obligatoriedad: a.obligatoriedad
        }));

        this.nuevoTipoAnexoUpdate = {
          nombre: '',
          descripcion: '',
          formato: '',
          obligatoriedad: null
        };

        this.forceAnexoValidationUpdate = false;
        this.actualizarDialogVisible = true;
      },
      error: (err) => {
        this.errorHandlerService.handleError(err, 'Error cargando Tipo de Solicitud para actualizar');
      }
    });
  }

  // Abre el formulario para actualizar el funcionario encargado del tipo de solicitud
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

  // Guarda el archivo cargado para crear tipos de solicitud
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
