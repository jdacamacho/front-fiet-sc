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

@Component({
  selector: 'app-usuarios-content-component',
  imports: [CommonModule, CardMainComponent, Paginator, ButtonComponent, BarraBusquedaComponent,
    GenericDialogInfoComponent, GenericDialogFormComponent, InputTextComponent, InputSelectComponent],
  templateUrl: './usuarios-content-component.html',
  styleUrl: './usuarios-content-component.css'
})
export class UsuariosContentComponent implements OnInit, AfterViewInit{
  
  // Referencias a inputs y templates
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

  // Objeto seleccionado para edición o información
  selectedUsuarioInfo: any = null;
  selectedUsuarioActualizarForm: any = {};

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


  constructor(private usuariosService: UsuariosService, private toastService: ToastService) { }

  /**
   * Inicializa la carga de roles
   */
  ngOnInit(): void {
    this.loadUsuarios();

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
        onClick: () => this.crearUsuario()  
      }
    ];
  }

  private crearUsuario(): void {
    console.log('Crear usuario clicked');
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
        let error = '';
        console.log('Error actualizando usuario', err);
        if (err.error && typeof err.error === 'object' && !err.error.mensaje && !err.error.descripcion) {
          const fieldErrors = Object.entries(err.error)
            .filter(([key, value]) => typeof value === 'string')
            .map(([key, value]) => `${key}: ${value}`)
            .join(' | ');
          if (fieldErrors) 
            error = fieldErrors;

        } else if (err.error && err.error.mensaje) {
          error = err.error.mensaje;
        } else if (err.error && err.error.descripcion) {
          error = err.error.descripcion;
        } else {
          error = err.message || 'Error desconocido';
        }
        this.usuarioFormActualizarDialogVisible = false;
        this.toastService.showError('Error Actualizando el Usuario', `No se pudo actualizar el usuario. ${error}`);
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
