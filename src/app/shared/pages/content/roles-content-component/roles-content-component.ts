import { Component, OnInit  } from '@angular/core';
import { TableGenericComponent } from '../../../table-generic-component/table-generic-component';
import { CommonModule } from '@angular/common';
import { CardMainComponent } from '../../../card-main-component/card-main-component';
import { ButtonComponent } from '../../../buttons/button-component/button-component';
import { RolesService } from '../../../../core/services/roles-service';
import { RolDTORespuesta } from '../../../../core/models/Rol/DTOResponse/RolDTORespuesta';
import { Paginator } from "../../../paginator/paginator";
import { GenericDialogInfoComponent } from '../../../generic-dialog-info-component/generic-dialog-info-component';

@Component({
  selector: 'app-roles-content-component',
  imports: [CommonModule, CardMainComponent, Paginator, ButtonComponent, GenericDialogInfoComponent],
  templateUrl: './roles-content-component.html',
  styleUrl: './roles-content-component.css'
})
export class RolesContentComponent implements OnInit {
  currentPage = 1;
  pageSize = 10;
  tableComponent = TableGenericComponent;
  pretitleComponentComponent = ButtonComponent;
  buttons = []; 
  headers = ['nombre', 'descripcion', 'estado'];
  data: any[] = [];
  rolInfoDialogVisible = false;
  selectedRolInfo: any = null;

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
    console.log('Abrir modal para actualizar rol:', rol);
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
