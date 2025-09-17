import { Component, OnInit, ViewChild   } from '@angular/core';
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
export class RolesContentComponent implements OnInit {
  rolFormDialogVisible = false;
  selectedRolForm: any = {};
  currentPage = 1;
  pageSize = 10;
  tableComponent = TableGenericComponent;
  pretitleComponentComponent = ButtonComponent;
  buttons = []; 
  headers = ['nombre', 'descripcion', 'estado'];
  data: any[] = [];
  rolInfoDialogVisible = false;
  selectedRolInfo: any = null;
  @ViewChild('inputDescripcion') inputDescripcion!: InputTextComponent;
  @ViewChild('inputEstado') inputEstado!: InputSelectComponent;

  constructor(private rolesService: RolesService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.rolesService.getRoles().subscribe({
      next: (roles: RolDTORespuesta[]) => {
        this.data = roles.map(r => ({
          ...r,
          estado: r.estado 
            ? '✅ Activo' 
            : '❌ Inactivo'
        }));
      },
      error: (err) => {
        console.error('Error cargando roles', err);
      }
    });
  }

  protected abrirModalActualizarRol(rol: any): void {
    this.selectedRolForm = { ...rol };
    this.rolFormDialogVisible = true;
  }

  guardarRolActualizado(): void {
    if (!this.selectedRolForm.uuidRol) {
      return;
    }

    this.inputDescripcion.touched = true;
    this.inputEstado.touched = true;

    if (this.inputDescripcion.isInvalid() || this.inputEstado.isInvalid()) {
      return; 
    }


    console.log('Guardando rol actualizado:', this.selectedRolForm);
    const rolActualizado: RolDTOPeticion = {
      descripcion: this.selectedRolForm.descripcion,
      estado: this.selectedRolForm.estado === '✅ Activo' ? true : false
    };

    console.log('Datos a enviar para actualización:', rolActualizado);

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

  protected verMasInfo(rol: any): void {
    this.selectedRolInfo = rol;
    this.rolInfoDialogVisible = true;
  }

  get totalPages(): number {
    return this.data.length ? Math.ceil(this.data.length / this.pageSize) : 1;
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.data.slice(start, start + this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}
