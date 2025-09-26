import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, Input } from '@angular/core';
import { UsuariosService } from '../../../../core/services/usuarios-service';
import { TableGenericComponent } from '../../../table-generic-component/table-generic-component';
import { ButtonComponent } from '../../../buttons/button-component/button-component';
import { UsuarioLivianoDTORespuesta } from '../../../../core/models/Usuario/DTOResponse/UsuarioLivianoDTORespuesta';
import { CommonModule } from '@angular/common';
import { CardMainComponent } from '../../../card-main-component/card-main-component';
import { Paginator } from "../../../paginator/paginator";
import { BarraBusquedaComponent } from '../../../search/barra-busqueda-component/barra-busqueda-component';
import { GenericDialogInfoComponent } from '../../../generic-dialog-info-component/generic-dialog-info-component';
import { UsuarioDTORespuesta } from '../../../../core/models/Usuario/DTOResponse/UsuarioDTORespuesta';
import { GenericDialogFormComponent } from '../../../generic-dialog-form-component/generic-dialog-form-component';
import { InputTextComponent } from '../../../inputs/input-text-component/input-text-component';
import { InputSelectComponent } from '../../../inputs/input-select-component/input-select-component';
import { UsuarioDTOPeticion } from '../../../../core/models/Usuario/DTORequest/UsuarioDTOPeticion';
import { ToastService } from '../../../../core/services/toast-service';
import { UsuarioActualizarDTOPeticion } from '../../../../core/models/Usuario/DTORequest/UsuarioActualizarDTOPeticion';
import { ErrorHandlerService } from '../../../../core/services/error-handler-service';
import { RolesService } from '../../../../core/services/roles-service';
import { InputPasswordComponent } from '../../../inputs/input-password-component/input-password-component';
import { GenericDialogUploadFileComponent } from '../../../generic-dialog-upload-file-component/generic-dialog-upload-file-component';

@Component({
  selector: 'app-usuarios-content-component',
  imports: [CommonModule, CardMainComponent, Paginator, ButtonComponent, BarraBusquedaComponent,
    GenericDialogInfoComponent, GenericDialogFormComponent, InputTextComponent, InputSelectComponent, InputPasswordComponent,
    GenericDialogUploadFileComponent],
  templateUrl: './usuarios-content-component.html',
  styleUrl: './usuarios-content-component.css'
})
export class UsuariosContentComponent implements OnInit, AfterViewInit{
  // Referencias a inputs y templates
  // Formulario crear usuario
  @ViewChild('inputNombres') inputNombres!: InputTextComponent;
  @ViewChild('inputApellidos') inputApellidos!: InputTextComponent;
  @ViewChild('inputTipoDocumento') inputTipoDocumento!: InputSelectComponent;
  @ViewChild('inputNumeroDocumento') inputNumeroDocumento!: InputTextComponent;
  @ViewChild('inputTelefono') inputTelefono!: InputTextComponent;
  @ViewChild('inputCorreoElectronico') inputCorreoElectronico!: InputTextComponent;
  @ViewChild('inputUsername') inputUsername!: InputSelectComponent;
  @ViewChild('inputPassword') inputPassword!: InputPasswordComponent;
  @ViewChild('inputTipoUsuario') inputTipoUsuario!: InputSelectComponent;
  @ViewChild('inputRoles') inputRoles!: InputSelectComponent;
  // Formulario actualización usuario
  @ViewChild('inputNombresActualizar') inputNombresActualizar!: InputTextComponent;
  @ViewChild('inputApellidosActualizar') inputApellidosActualizar!: InputTextComponent;
  @ViewChild('inputEstadoActualizar') inputEstadoActualizar!: InputSelectComponent;
  @ViewChild('inputTipoDocumentoActualizar') inputTipoDocumentoActualizar!: InputSelectComponent;
  @ViewChild('inputNumeroDocumentoActualizar') inputNumeroDocumentoActualizar!: InputTextComponent;
  @ViewChild('inputTelefonoActualizar') inputTelefonoActualizar!: InputTextComponent;
  @ViewChild('inputCorreoElectronicoActualizar') inputCorreoElectronicoActualizar!: InputTextComponent;
  @ViewChild('inputUsernameActualizar') inputUsernameActualizar!: InputSelectComponent;
  @ViewChild('inputTipoUsuarioActualizar') inputTipoUsuarioActualizar!: InputSelectComponent;
  // busqueda tabla
  @ViewChild('busquedaNombre') busquedaNombre!: TemplateRef<any>; // Template búsqueda nombre de usuario

  // Flags de visibilidad de diálogos
  usuarioInfoDialogVisible = false;
  usuarioFormActualizarDialogVisible = false;
  usuarioFormDialogVisible = false;
  usuarioUploadDialogVisible = false;

  // Archivo actual cargado
  archivoSeleccionado: File | null = null;

  // Objeto seleccionado para edición o información
  selectedUsuarioInfo: any = null;
  selectedUsuarioActualizarForm: any = {};
  selectedUsuarioForm: any = {};

  // Paginación
  currentPage = 1;
  pageSize = 5;

  // Componentes para uso en CardMainComponent
  tableComponent = TableGenericComponent;
  pretitleComponentComponent = ButtonComponent;
  buttonsCard: any[] = [];

  // Cabeceras y datos de la tabla
  headers = [
    {title: 'nombre', headerTemplate: this.busquedaNombre}, 
    {title: 'estado'}
  ];

  data: any[] = [];
  dataCopy: any[] = [];
  tiposUsuario: any[] = [];
  tiposUsuarioOptions: { label: string; value: any }[] = [];
  roles: any[] = [];
  rolesOptions: { label: string; value: any }[] = [];


  constructor(private usuariosService: UsuariosService, private toastService: ToastService,
    private errorHandlerService: ErrorHandlerService, private rolesService:RolesService
  ) { }

  /**
   * Inicializa la carga de roles
   */
  ngOnInit(): void {
    this.loadUsuarios();
    this.loadTiposUsuario();
    this.loadRoles();

    this.buttonsCard = [
      {
        imgUrl: 'buttons/add-user.svg',
        color: '#1E257B',
        width: '20px',
        height: '20px',
        onClick: () => this.crearUsuario()  
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

  private loadTiposUsuario(): void {
    this.usuariosService.getTiposUsuario().subscribe({
      next: (tipos: any[]) => {
        this.tiposUsuario = tipos;
        this.tiposUsuarioOptions = tipos.map(tu => ({
          label: tu.nombre,
          value: tu
        }));
      },
      error: (err) => {
        console.error('Error cargando tipos de usuario', err);
      }
    });
  }

  private loadRoles(): void {
    this.rolesService.getRoles().subscribe({
      next: (roles: any[]) => {
        this.roles = roles;
        this.rolesOptions = roles.map(r => ({
          label: r.nombre,
          value: r
        }));
      },
      error: (err) => {
        console.error('Error cargando roles', err);
      }
    });
  }

  /**
   * Se ejecuta después de que la vista se inicializa
   * Se asigna la referencia del template del botón al header
   */
  ngAfterViewInit(): void {
    this.headers = [
      { title: 'nombre', headerTemplate: this.busquedaNombre },
      { title: 'estado' }
    ];
  }

  protected abrirDialogoUpload(): void {
    this.archivoSeleccionado = null; 
    this.usuarioUploadDialogVisible = true;
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

    this.usuariosService.crearUsuariosDesdeArchivo(file).subscribe({
      next: (respuesta) => {
        this.toastService.showSuccess(
          'Archivo cargado',
          `Se subieron ${respuesta.length} registros al sistema. Para más detalles consulte el historial.`
        );
        this.usuarioUploadDialogVisible = false;
        this.loadUsuarios();
      },
      error: (err) => {
        this.usuarioUploadDialogVisible = false;
        this.errorHandlerService.handleError(err, 'Error creando usuarios');
      }
    });
  }

  /**
   * Carga los usuarios desde el servicio
   */
  loadUsuarios(): void {
    this.usuariosService.getUsuarios().subscribe({
      next: (usuarios: UsuarioLivianoDTORespuesta[]) => {
        this.data = usuarios.map(u => ({
          uuidUsuario: u.uuidUsuario,
          nombre: `${u.nombres} ${u.apellidos}`,
          estado: u.estado ? '✅ Activo' : '❌ Inactivo'
        }));
        this.dataCopy = [...this.data];
      },
      error: (err) => {
        console.error('Error cargando usuarios', err);
      }
    });
  }

  // Filtra la data según el campo y texto ingresado
  filtrarData(campo: string, texto: string) {
    if (!texto) {
      this.dataCopy = [...this.data]; // Mostrar todo si no hay texto
    } else {
      this.dataCopy = this.data.filter(item =>
        item[campo]?.toLowerCase().includes(texto.toLowerCase())
      );
    }
    this.currentPage = 1; // Reinicia paginación al filtrar
  }

  protected crearUsuario(): void {
    this.selectedUsuarioForm = {};
    this.inputNombres.reset();
    this.inputApellidos.reset();
    this.inputNumeroDocumento.reset();
    this.inputTelefono.reset();
    this.inputCorreoElectronico.reset();
    this.inputPassword.reset();
    this.inputTipoDocumento.reset();
    this.inputUsername.reset();
    this.inputTipoUsuario.reset();
    this.inputRoles.reset();
    this.usuarioFormDialogVisible = true; 
  }

  protected guardarNuevoUsuario(): void {
    this.inputNombres.touched = true;
    this.inputApellidos.touched = true;
    this.inputTipoDocumento.touched = true;
    this.inputNumeroDocumento.touched = true;
    this.inputTelefono.touched = true;
    this.inputCorreoElectronico.touched = true;
    this.inputUsername.touched = true;
    this.inputPassword.touched = true;
    this.inputTipoUsuario.touched = true;
    this.inputRoles.touched = true;

    if (
      this.inputNombres.isInvalid() ||
      this.inputApellidos.isInvalid() ||
      this.inputTipoDocumento.isInvalid() ||
      this.inputNumeroDocumento.isInvalid() ||
      this.inputTelefono.isInvalid() ||
      this.inputCorreoElectronico.isInvalid() ||
      this.inputUsername.isInvalid() ||
      this.inputPassword.isInvalid() ||
      this.inputTipoUsuario.isInvalid() ||
      this.inputRoles.isInvalid()
    ) return;

    const peticion: UsuarioDTOPeticion = {
      nombres: this.inputNombres.value,
      apellidos: this.inputApellidos.value,
      estado: true,
      tipoDocumento: this.inputTipoDocumento.value,
      numeroDocumento: this.inputNumeroDocumento.value,
      telefono: this.inputTelefono.value,
      correoElectronico: this.inputCorreoElectronico.value,
      username: this.inputUsername.value,
      password: this.inputPassword.value,
      objTipoUsuario: this.inputTipoUsuario.value, 
      roles: [this.inputRoles.value]              
    };

    const tipoUsuarioParam = this.inputRoles.value.nombre.replace(/\s+/g, '');

    this.usuariosService.crearUsuario(peticion, tipoUsuarioParam).subscribe({
      next: () => {
        this.toastService.showSuccess('Usuario creado','El usuario se creó correctamente.');
        this.usuarioFormDialogVisible = false;
        this.loadUsuarios();
      },
      error: (err) => {
        this.usuarioFormDialogVisible = false;
        this.errorHandlerService.handleError(err, 'Error creando usuario');
      }
    });

  }

  /**
   * Abre el modal para actualizar un usuario
   */
  protected abrirModalActualizarUsuario(usuario: any): void {
    this.usuariosService.getUsuario(usuario.uuidUsuario).subscribe({
      next: (usuarioDetallado: UsuarioDTORespuesta) => {
        this.selectedUsuarioActualizarForm = {
          uuidUsuario: usuario.uuidUsuario,
          nombres: usuarioDetallado.nombres,
          apellidos: usuarioDetallado.apellidos,
          estado: usuarioDetallado.estado ? '✅ Activo' : '❌ Inactivo',
          tipoDocumento: usuarioDetallado.tipoDocumento,
          numeroDocumento: usuarioDetallado.numeroDocumento,
          telefono: usuarioDetallado.telefono,
          correoElectronico: usuarioDetallado.correoElectronico,
          username: usuarioDetallado.username,
          objTipoUsuario: usuarioDetallado.objTipoUsuario, 
          roles: usuarioDetallado.roles
        };
        this.usuarioFormActualizarDialogVisible = true;
      },
      error: (err) => {
        console.error('Error cargando usuario', err);
      }
    });
  }

  /**
   * Guarda los cambios realizados a un usuario
   */
  protected guardarUsuarioActualizado(): void {
    // Marcar inputs como tocados para validación
    this.inputNombresActualizar.touched = true;
    this.inputApellidosActualizar.touched = true;
    this.inputTipoDocumentoActualizar.touched = true;
    this.inputNumeroDocumentoActualizar.touched = true;
    this.inputTelefonoActualizar.touched = true;
    this.inputCorreoElectronicoActualizar.touched = true;
    this.inputUsernameActualizar.touched = true;
    this.inputTipoUsuarioActualizar.touched = true;
    this.inputEstadoActualizar.touched = true;

    if (
      this.inputNombresActualizar.isInvalid() ||
      this.inputApellidosActualizar.isInvalid() ||
      this.inputTipoDocumentoActualizar.isInvalid() ||
      this.inputNumeroDocumentoActualizar.isInvalid() ||
      this.inputTelefonoActualizar.isInvalid() ||
      this.inputCorreoElectronicoActualizar.isInvalid() ||
      this.inputUsernameActualizar.isInvalid() ||
      this.inputTipoUsuarioActualizar.isInvalid() ||
      this.inputEstadoActualizar.isInvalid()
    ) return;

    // Preparar datos a enviar
    const usuarioActualizado: UsuarioActualizarDTOPeticion = {
      nombres: this.selectedUsuarioActualizarForm.nombres,
      apellidos: this.selectedUsuarioActualizarForm.apellidos,
      tipoDocumento: this.selectedUsuarioActualizarForm.tipoDocumento,
      numeroDocumento: this.selectedUsuarioActualizarForm.numeroDocumento,
      telefono: this.selectedUsuarioActualizarForm.telefono,
      correoElectronico: this.selectedUsuarioActualizarForm.correoElectronico,
      username: this.selectedUsuarioActualizarForm.username,
      objTipoUsuario: this.selectedUsuarioActualizarForm.objTipoUsuario,
      estado: this.selectedUsuarioActualizarForm.estado === '✅ Activo' ? true : false,
      roles: this.selectedUsuarioActualizarForm.roles
    };

    // Llamada al servicio para actualizar
    this.usuariosService.actualizarUsuario(this.selectedUsuarioActualizarForm.uuidUsuario, usuarioActualizado).subscribe({
      next: (updatedUsuario) => {
        const index = this.data.findIndex(u => u.uuidUsuario === updatedUsuario.uuidUsuario);
        if (index !== -1) {
          this.data[index] = {
            uuidUsuario: updatedUsuario.uuidUsuario,
            nombre: `${updatedUsuario.nombres} ${updatedUsuario.apellidos}`,
            estado: updatedUsuario.estado ? '✅ Activo' : '❌ Inactivo'
          };
        }
        this.loadUsuarios(); 
        this.usuarioFormActualizarDialogVisible = false;
        this.toastService.showSuccess('Éxito', 'Usuario actualizado correctamente');
      },
      error: (err) => {
        this.usuarioFormActualizarDialogVisible = false;
        this.errorHandlerService.handleError(err, 'Error Actualizando el Usuario', 'No se pudo actualizar el usuario');
      }
    });
  }


   /**
   * Abre el diálogo de información del usuario
   */
  protected verMasInfo(usuario: any): void {
    this.usuariosService.getUsuario(usuario.uuidUsuario).subscribe({
      next: (usuarioDetallado: UsuarioDTORespuesta) => {
        this.selectedUsuarioInfo = {
          UUID_Usuario: usuarioDetallado.uuidUsuario,
          Nombre: `${usuarioDetallado.nombres} ${usuarioDetallado.apellidos}`,
          Tipo_Documento: usuarioDetallado.tipoDocumento,
          Numero_Documento: usuarioDetallado.numeroDocumento,
          Teléfono: usuarioDetallado.telefono,
          Correo_Electrónico: usuarioDetallado.correoElectronico,
          username: usuarioDetallado.username,
          Tipo_Usuario: usuarioDetallado.objTipoUsuario?.nombre, 
          Roles: usuarioDetallado.roles?.map(r => r.nombre).join(', ') || 'Sin roles', 
          Estado: usuarioDetallado.estado ? '✅ Activo' : '❌ Inactivo'
        };
        this.usuarioInfoDialogVisible = true;
      },
      error: (err) => {
        console.error('Error cargando usuario', err);
      }
    });
  }

  /**
   * Devuelve el número total de páginas según pageSize
   */
  get totalPages(): number {
    return this.dataCopy.length ? Math.ceil(this.dataCopy.length / this.pageSize) : 1;
  }

  /**
   * Devuelve los datos paginados para la tabla
   */
  get paginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.dataCopy.slice(start, start + this.pageSize);
  }

  /**
   * Actualiza la página actual al cambiar el paginador
   */
  onPageChange(page: number) {
    this.currentPage = page;
  }
}
