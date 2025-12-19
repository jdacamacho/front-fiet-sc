import { Component, Input, Output, EventEmitter, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericDialogStepsFormComponent } from '../../../../shared/generic-dialog-steps-form-component/generic-dialog-steps-form-component';
import { InputTextComponent } from '../../../../shared/inputs/input-text-component/input-text-component';
import { InputTextTareaComponent } from '../../../../shared/inputs/input-text-tarea-component/input-text-tarea-component';
import { InputSelectComponent } from '../../../../shared/inputs/input-select-component/input-select-component';
import { SolicitudDTOPeticion } from '../../../models/Solicitudes/DTORequest/SolicitudDTOPeticion';
import { TipoSolicitudService } from '../../../services/tipo-solicitud-service';
import { SolicitudesService } from '../../../services/solicitudes-service';
import { AuthService } from '../../../services/auth-service';
import { TipoSolicitudDTORespuesta } from '../../../models/TipoSolicitud/DTOResponse/TipoSolicitudDTORespuesta';
import { InputAnexoUploadComponent } from '../../../../shared/inputs/input-anexo-upload-component/input-anexo-upload-component';
import { ToastService } from '../../../services/toast-service';
import { ErrorHandlerService } from '../../../services/error-handler-service';

@Component({
  selector: 'app-enviar-solicitud-usuario-fiet-component',
  standalone: true,
  imports: [
    CommonModule,
    GenericDialogStepsFormComponent,
    InputTextComponent,
    InputTextTareaComponent,
    InputSelectComponent,
    InputAnexoUploadComponent
  ],
  templateUrl: './enviar-solicitud-usuario-fiet-component.html',
  styleUrl: './enviar-solicitud-usuario-fiet-component.css'
})
export class EnviarSolicitudUsuarioFietComponent implements OnInit {

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  nuevaSolicitud: SolicitudDTOPeticion = {
    consecutivo: '',
    nombre: '',
    descripcion: '',
    uuidTipoSolicitud: '',
    anexos: [],
    uuidOrdenDelDia: ''
  };

  steps: {
    title: string;
    contentTemplate: TemplateRef<any>;
    canContinue?: () => boolean;
  }[] = [];

  @ViewChild('step1', { static: true }) step1Template!: TemplateRef<any>;
  @ViewChild('step2', { static: true }) step2Template!: TemplateRef<any>;
  

  tiposSolicitudOptions: { label: string; value: string }[] = [];
  ordenesDelDiaOptions: { label: string; value: string }[] = [];

  tipoSolicitudSeleccionado: TipoSolicitudDTORespuesta | null = null; 
  tiposSolicitud: TipoSolicitudDTORespuesta[] = [];

  usuario: any;

  archivosAnexos: File[] = [];
  anexosSolicitud: { nombre: string }[] = [];
  archivosPorTipo: Record<string, File> = {};

  constructor(
    private tipoSolicitudService: TipoSolicitudService,
    private solicitudesService: SolicitudesService,
    private authService: AuthService,
    private toastService: ToastService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.steps = [
      {
        title: 'Paso 1: Información de la Solicitud',
        contentTemplate: this.step1Template,
        canContinue: () => this.canContinueStep1()
      },
      {
        title: 'Paso 2: Tipos de Anexos',
        contentTemplate: this.step2Template
      }
    ];

    this.authService.usuario$.subscribe(user => {
      this.usuario = user;
      if (user) {
        this.cargarTiposSolicitud(user.roles[0].nombre);
        this.cargarOrdenesDelDia();
      }
    });
  }

  canContinueStep1(): boolean {
    return !!(
      this.nuevaSolicitud.nombre?.trim() &&
      this.nuevaSolicitud.uuidTipoSolicitud &&
      this.nuevaSolicitud.uuidOrdenDelDia
    );
  }

  cargarTiposSolicitud(perfil: string): void {
    this.tipoSolicitudService.getTiposSolicitudPorPerfil(perfil).subscribe(res => {
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

  cargarOrdenesDelDia(): void {
    this.solicitudesService.getOrdenesDelDiaPorEstado(true).subscribe(res => {
      this.ordenesDelDiaOptions = res.map(o => ({
        label: o.nombre,
        value: o.uuidOrdenDelDia
      }));
    });
  }

  enviarSolicitud(): void {
    if (!this.tipoSolicitudSeleccionado)
      return;

    for (let i = 0; i < this.tipoSolicitudSeleccionado.anexos.length; i++) {
      const tipoAnexo = this.tipoSolicitudSeleccionado.anexos[i];

      if (tipoAnexo.obligatoriedad && !this.archivosAnexos[i]) {
        this.toastService.showError('Error', `El anexo "${tipoAnexo.nombre}" es obligatorio`);
        return;
      }
    }

    this.nuevaSolicitud.anexos = [];
    const archivosOrdenados: File[] = [];

    this.archivosAnexos.forEach((file, index) => {
      if (file) {
        this.nuevaSolicitud.anexos.push(this.anexosSolicitud[index]);
        archivosOrdenados.push(file);
      }
    });

    this.solicitudesService
      .enviarSolicitud(this.nuevaSolicitud, archivosOrdenados)
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
    this.nuevaSolicitud = {
      consecutivo: '',
      nombre: '',
      descripcion: '',
      uuidTipoSolicitud: '',
      anexos: [],
      uuidOrdenDelDia: ''
    };
    this.archivosAnexos = [];
    this.anexosSolicitud = [];
    this.archivosPorTipo = {};
    this.tipoSolicitudSeleccionado = null;
  }

  onArchivoCargado(file: File, index: number, nombre: string): void {
    this.archivosAnexos[index] = file;
    this.anexosSolicitud[index] = { nombre };
  }

  onArchivoRemovido(index: number): void {
    this.archivosAnexos.splice(index, 1);
    this.anexosSolicitud.splice(index, 1);
  }
  
}
