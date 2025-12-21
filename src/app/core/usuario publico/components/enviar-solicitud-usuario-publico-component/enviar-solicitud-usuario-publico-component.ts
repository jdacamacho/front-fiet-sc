import { Component, Input, Output, EventEmitter, OnInit, TemplateRef, ViewChild , ViewChildren, QueryList} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericDialogStepsFormComponent } from '../../../../shared/generic-dialog-steps-form-component/generic-dialog-steps-form-component';
import { InputTextComponent } from '../../../../shared/inputs/input-text-component/input-text-component';
import { InputTextTareaComponent } from '../../../../shared/inputs/input-text-tarea-component/input-text-tarea-component';
import { InputSelectComponent } from '../../../../shared/inputs/input-select-component/input-select-component';
import { InputAnexoUploadComponent } from '../../../../shared/inputs/input-anexo-upload-component/input-anexo-upload-component';
import { TipoSolicitudService } from '../../../services/tipo-solicitud-service';
import { SolicitudesService } from '../../../services/solicitudes-service';
import { ToastService } from '../../../services/toast-service';
import { ErrorHandlerService } from '../../../services/error-handler-service';
import { TipoSolicitudDTORespuesta } from '../../../models/TipoSolicitud/DTOResponse/TipoSolicitudDTORespuesta';
import { SolicitudPublicaDTOPeticion } from '../../../models/Solicitudes/DTORequest/SolicitudPublicaDTOPeticion';
import { TIPOS_DOCUMENTO } from '../../../constantes/constantes';

@Component({
  selector: 'app-enviar-solicitud-usuario-publico-component',
  standalone: true,
  imports: [
    CommonModule,
    GenericDialogStepsFormComponent,
    InputTextComponent,
    InputTextTareaComponent,
    InputSelectComponent,
    InputAnexoUploadComponent
  ],
  templateUrl: './enviar-solicitud-usuario-publico-component.html',
  styleUrl: './enviar-solicitud-usuario-publico-component.css'
})
export class EnviarSolicitudUsuarioPublicoComponent implements OnInit {

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  solicitudPublica: SolicitudPublicaDTOPeticion = {
    nombre: '',
    descripcion: '',
    uuidTipoSolicitud: '',
    anexos: [],
    informacionSolicitante: {
      tipoDocumento: '',
      numeroDocumento: '',
      nombres: '',
      apellidos: '',
      correoElectronico: '',
      telefono: ''
    }
  };

  steps: {
    title: string;
    contentTemplate: TemplateRef<any>;
    canContinue?: () => boolean;
  }[] = [];

  @ViewChild('step1', { static: true }) step1Template!: TemplateRef<any>;
  @ViewChild('step2', { static: true }) step2Template!: TemplateRef<any>;
  @ViewChild('step3', { static: true }) step3Template!: TemplateRef<any>;

  // Step 1
  @ViewChild('inputTipoDocumento') inputTipoDocumento!: InputSelectComponent;
  @ViewChild('inputNumeroDocumento') inputNumeroDocumento!: InputTextComponent;
  @ViewChild('inputNombres') inputNombres!: InputTextComponent;
  @ViewChild('inputApellidos') inputApellidos!: InputTextComponent;
  @ViewChild('inputCorreo') inputCorreo!: InputTextComponent;
  @ViewChild('inputTelefono') inputTelefono!: InputTextComponent;

  // Step 2
  @ViewChild('inputNombreSolicitud') inputNombreSolicitud!: InputTextComponent;
  @ViewChild('inputDescripcionSolicitud') inputDescripcionSolicitud!: InputTextTareaComponent;
  @ViewChild('inputTipoSolicitud') inputTipoSolicitud!: InputSelectComponent;

  // Step 3 – Anexos (muchos)
  @ViewChildren('inputAnexo') inputAnexos!: QueryList<InputAnexoUploadComponent>;

  tiposSolicitudOptions: { label: string; value: string }[] = [];
  tiposSolicitud: TipoSolicitudDTORespuesta[] = [];
  tipoSolicitudSeleccionado: TipoSolicitudDTORespuesta | null = null;

  archivosAnexos: File[] = [];
  anexosSolicitud: { nombre: string }[] = [];
  tiposDocumento = TIPOS_DOCUMENTO;

  constructor(
    private tipoSolicitudService: TipoSolicitudService,
    private solicitudesService: SolicitudesService,
    private toastService: ToastService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.steps = [
      {
        title: 'Paso 1: Información del Solicitante',
        contentTemplate: this.step1Template,
        canContinue: () => this.canContinueStep1()
      },
      {
        title: 'Paso 2: Información de la Solicitud',
        contentTemplate: this.step2Template,
        canContinue: () => this.canContinueStep2()
      },
      {
        title: 'Paso 3: Tipos de Anexos',
        contentTemplate: this.step3Template
      }
    ];

    this.cargarTiposSolicitudPublicos();
  }

  canContinueStep1(): boolean {
    const i = this.solicitudPublica.informacionSolicitante;
    return !!(
      i.tipoDocumento &&
      i.numeroDocumento &&
      i.nombres &&
      i.apellidos &&
      i.correoElectronico &&
      i.telefono
    );
  }

  canContinueStep2(): boolean {
    return !!(
      this.solicitudPublica.nombre?.trim() &&
      this.solicitudPublica.uuidTipoSolicitud
    );
  }

  cargarTiposSolicitudPublicos(): void {
    this.tipoSolicitudService.getTiposSolicitudPorPerfil('Solicitante Publico')
      .subscribe(res => {
        this.tiposSolicitud = res;
        this.tiposSolicitudOptions = res.map(t => ({
          label: t.nombre,
          value: t.uuidTipoSolicitud
        }));
      });
  }

  onTipoSolicitudChange(uuid: string): void {
    this.tipoSolicitudSeleccionado =
      this.tiposSolicitud.find(t => t.uuidTipoSolicitud === uuid) || null;
  }

  onArchivoCargado(file: File, index: number, nombre: string): void {
    this.archivosAnexos[index] = file;
    this.anexosSolicitud[index] = { nombre };
  }

  onArchivoRemovido(index: number): void {
    this.archivosAnexos.splice(index, 1);
    this.anexosSolicitud.splice(index, 1);
  }

  enviarSolicitud(): void {
    if (!this.tipoSolicitudSeleccionado) return;

    for (let i = 0; i < this.tipoSolicitudSeleccionado.anexos.length; i++) {
      const tipoAnexo = this.tipoSolicitudSeleccionado.anexos[i];
      if (tipoAnexo.obligatoriedad && !this.archivosAnexos[i]) {
        this.toastService.showError('Error', `El anexo "${tipoAnexo.nombre}" es obligatorio`);
        return;
      }
    }

    this.solicitudPublica.anexos = [];
    const archivosOrdenados: File[] = [];

    this.archivosAnexos.forEach((file, index) => {
      if (file) {
        this.solicitudPublica.anexos.push(this.anexosSolicitud[index]);
        archivosOrdenados.push(file);
      }
    });

     this.solicitudesService
      .enviarSolicitudPublica(this.solicitudPublica, archivosOrdenados)
      .subscribe({
        next: res => {
          this.toastService.showSuccess('Éxito', 'Solicitud enviada correctamente');
          this.cerrar();
        },
        error: err => {
          this.errorHandlerService.handleError(err, 'Error enviando la solicitud');
        }
      });
  }

  cerrar(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetFormulario();
  }

  private resetFormulario(): void {
    this.solicitudPublica = {
      nombre: '',
      descripcion: '',
      uuidTipoSolicitud: '',
      anexos: [],
      informacionSolicitante: {
        tipoDocumento: '',
        numeroDocumento: '',
        nombres: '',
        apellidos: '',
        correoElectronico: '',
        telefono: ''
      }
    };

    this.archivosAnexos = [];
    this.anexosSolicitud = [];
    this.tipoSolicitudSeleccionado = null;


    this.inputTipoDocumento?.reset();
    this.inputNumeroDocumento?.reset();
    this.inputNombres?.reset();
    this.inputApellidos?.reset();
    this.inputCorreo?.reset();
    this.inputTelefono?.reset();
    this.inputNombreSolicitud?.reset();
    this.inputDescripcionSolicitud?.reset();
    this.inputTipoSolicitud?.reset();
    this.inputAnexos?.forEach(anexo => anexo.reset?.());
  }
}
