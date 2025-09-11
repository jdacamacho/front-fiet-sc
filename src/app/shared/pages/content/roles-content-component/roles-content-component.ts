import { Component, OnInit, Type  } from '@angular/core';
import { TableGenericComponent } from '../../../table-generic-component/table-generic-component';
import { CommonModule } from '@angular/common';
import { CardMainComponent } from '../../../card-main-component/card-main-component';
import { ButtonComponent } from '../../../buttons/button-component/button-component';
import { RolesService } from '../../../../core/services/roles-service';
import { RolDTORespuesta } from '../../../../core/models/Rol/DTOResponse/RolDTORespuesta';
import { Paginator } from "../../../paginator/paginator";

@Component({
  selector: 'app-roles-content-component',
  imports: [CommonModule, CardMainComponent, Paginator],
  templateUrl: './roles-content-component.html',
  styleUrl: './roles-content-component.css'
})
export class RolesContentComponent implements OnInit {
  currentPage = 1;
  pageSize = 10;
  tableComponent = TableGenericComponent;
  buttonComponent = ButtonComponent;
  buttons = []; 
  actionButtons: Type<any>[][] = [];

  headers = ['nombre', 'descripcion', 'estado'];
  data: any[] = [];

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
        this.actionButtons = this.data.map(() => [ButtonComponent, ButtonComponent]);
      },
      error: (err) => {
        console.error('Error cargando roles', err);
      }
    });
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
