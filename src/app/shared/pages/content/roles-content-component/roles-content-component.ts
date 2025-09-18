/**
 * RolesContentComponent
 * Author: Julian David Camacho Erazo  {@literal <jdacamacho@unicauca.edu.co>}
 *
 * Componente que muestra la gestión de roles usando una tabla genérica,
 * botones de acción, paginación y modales para ver o actualizar información.
 */

import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { TableGenericComponent } from '../../../table-generic-component/table-generic-component';
import { CommonModule } from '@angular/common';
import { CardMainComponent } from '../../../card-main-component/card-main-component';
import { ButtonComponent } from '../../../buttons/button-component/button-component';
import { RolesService } from '../../../../core/services/roles-service';
import { RolDTORespuesta } from '../../../../core/models/Rol/DTOResponse/RolDTORespuesta';
import { Paginator } from "../../../paginator/paginator";
import { GenericDialogInfoComponent } from '../../../generic-dialog-info-component/generic-dialog-info-component';
import { GenericDialogFormComponent } from '../../../generic-dialog-form-component/generic-dialog-form-component';
import { InputTextComponent } from '../../../inputs/input-text-component/input-text-component';
import { InputSelectComponent } from '../../../inputs/input-select-component/input-select-component';
import { RolDTOPeticion } from '../../../../core/models/Rol/DTORequest/RolDTOPeticion';

@Component({
  selector: 'app-roles-content-component',
  imports: [CommonModule, CardMainComponent, Paginator, ButtonComponent,
     GenericDialogInfoComponent, GenericDialogFormComponent, InputTextComponent, InputSelectComponent],
  templateUrl: './roles-content-component.html',
  styleUrl: './roles-content-component.css'
})
export class RolesContentComponent implements OnInit, AfterViewInit {
  // Referencias a inputs y templates
  @ViewChild('inputDescripcion') inputDescripcion!: InputTextComponent;
  @ViewChild('inputEstado') inputEstado!: InputSelectComponent;
  @ViewChild('botonNombre') botonNombre!: TemplateRef<any>;
  @ViewChild('botonDescripcion') botonDescripcion!: TemplateRef<any>;

  // Flags de visibilidad de diálogos
  rolFormDialogVisible = false;
  rolInfoDialogVisible = false;

  // Objeto seleccionado para edición o información
  selectedRolForm: any = {};
  selectedRolInfo: any = null;

  // Paginación
  currentPage = 1;
  pageSize = 10;

  // Flag para controlar orden
  private nombreOrdenAsc = true;
  private descripcionOrdenAsc = true;

  // Componentes para uso en CardMainComponent
  tableComponent = TableGenericComponent;
  pretitleComponentComponent = ButtonComponent;
  buttons = []; 

  // Cabeceras y datos de la tabla
  headers = [
    {title: 'nombre', headerTemplate: this.botonNombre}, 
    {title: 'descripcion', headerTemplate: this.botonDescripcion}, 
    {title: 'estado'}];

  data: any[] = [];

  constructor(private rolesService: RolesService) {}

  /**
   * Ordena la tabla por el campo nombre
   */
  public ordenarPorNombre(): void {
    this.data.sort((a, b) => {
      if (this.nombreOrdenAsc) {
        return a.nombre.localeCompare(b.nombre); 
      } else {
        return b.nombre.localeCompare(a.nombre); 
      }
    });
    this.nombreOrdenAsc = !this.nombreOrdenAsc;
  }

  /**
   * Ordena la tabla por el campo nombre
   */
  public ordenarPorDescripcion(): void {
    this.data.sort((a, b) => {
      if (this.descripcionOrdenAsc) {
        return a.descripcion.localeCompare(b.descripcion); 
      } else {
        return b.descripcion.localeCompare(a.descripcion); 
      }
    });
    this.descripcionOrdenAsc = !this.descripcionOrdenAsc;
  }

  /**
   * Inicializa la carga de roles
   */
  ngOnInit(): void {
    this.loadRoles();
  }

  /**
   * Se ejecuta después de que la vista se inicializa
   * Se asigna la referencia del template del botón al header
   */
  ngAfterViewInit(): void {
    this.headers = [
      { title: 'nombre', headerTemplate: this.botonNombre },
      { title: 'descripcion', headerTemplate: this.botonDescripcion },
      { title: 'estado' }
    ];
  }

  /**
   * Carga los roles desde el servicio
   */
  loadRoles(): void {
    this.rolesService.getRoles().subscribe({
      next: (roles: RolDTORespuesta[]) => {
        this.data = roles.map(r => ({
          ...r,
          estado: r.estado ? '✅ Activo' : '❌ Inactivo'
        }));
      },
      error: (err) => {
        console.error('Error cargando roles', err);
      }
    });
  }

  /**
   * Abre el modal para actualizar un rol
   */
  protected abrirModalActualizarRol(rol: any): void {
    this.selectedRolForm = { descripcion: '', estado: '' };
    this.selectedRolForm = { ...rol };
    this.rolFormDialogVisible = true;
  }

  /**
   * Guarda los cambios realizados a un rol
   */
  guardarRolActualizado(): void {
    if (!this.selectedRolForm.uuidRol) return;

    // Marcar inputs como tocados para validación
    this.inputDescripcion.touched = true;
    this.inputEstado.touched = true;

    if (this.inputDescripcion.isInvalid() || this.inputEstado.isInvalid()) return; 

    // Preparar datos a enviar
    const rolActualizado: RolDTOPeticion = {
      descripcion: this.selectedRolForm.descripcion,
      estado: this.selectedRolForm.estado === '✅ Activo' ? true : false
    };

    // Llamada al servicio para actualizar
    this.rolesService.actualizarRol(this.selectedRolForm.uuidRol, rolActualizado).subscribe({
      next: (updatedRol) => {
        const index = this.data.findIndex(r => r.uuidRol === updatedRol.uuidRol);
        if (index !== -1) {
          this.data[index] = {
            ...updatedRol,
            estado: updatedRol.estado ? '✅ Activo' : '❌ Inactivo'
          };
        }
        this.rolFormDialogVisible = false;
      },
      error: (err) => {
        console.error('Error actualizando rol', err);
      }
    });
  }

  /**
   * Abre el diálogo de información del rol
   */
  protected verMasInfo(rol: any): void {
    this.selectedRolInfo = rol;
    this.rolInfoDialogVisible = true;
  }

  /**
   * Devuelve el número total de páginas según pageSize
   */
  get totalPages(): number {
    return this.data.length ? Math.ceil(this.data.length / this.pageSize) : 1;
  }

  /**
   * Devuelve los datos paginados para la tabla
   */
  get paginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.data.slice(start, start + this.pageSize);
  }

  /**
   * Actualiza la página actual al cambiar el paginador
   */
  onPageChange(page: number) {
    this.currentPage = page;
  }
}
