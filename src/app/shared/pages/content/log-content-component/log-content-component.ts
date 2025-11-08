/**
 * Componente LogContentComponent
 * Muestra un historial de logs con paginación y búsqueda.
 * Author: Julian David Camacho Erazo  {@literal <jdacamacho@unicauca.edu.co>}
 */

import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { TableGenericComponent } from '../../../table-generic-component/table-generic-component';
import { CommonModule } from '@angular/common';
import { CardMainComponent } from '../../../card-main-component/card-main-component';
import { ButtonComponent } from '../../../buttons/button-component/button-component';
import { LogService } from '../../../../core/services/log-service';
import { Paginator } from "../../../paginator/paginator";
import { BarraBusquedaComponent } from '../../../search/barra-busqueda-component/barra-busqueda-component';

@Component({
  selector: 'app-log-content-component',
  imports: [CommonModule, CardMainComponent, Paginator, BarraBusquedaComponent],
  templateUrl: './log-content-component.html',
  styleUrl: './log-content-component.css'
})
export class LogContentComponent implements OnInit {
  currentPage = 1; // Página actual
  pageSize = 5;   // Tamaño de página
  totalElements = 0;
  totalPages = 1;
  responsableFiltro: string = '';
  fechaFiltro: string = '';

  tableComponent = TableGenericComponent; // Componente de tabla
  pretitleComponentComponent = ButtonComponent; // Componente pre-title

  // Encabezados de la tabla, algunos con template de búsqueda
  headers: any[] = [
    { title: 'Responsable', headerTemplate: null },
    { title: 'Fecha', headerTemplate: null },
    { title: 'Acción' },
    { title: 'Resultado' }
  ];

  @ViewChild('busquedaResponsable') busquedaResponsable!: TemplateRef<any>; // Template búsqueda Responsable
  @ViewChild('busquedaFecha') busquedaFecha!: TemplateRef<any>;             // Template búsqueda Fecha

  paginatedData: any[] = []; // Data de la página actual (proviene del backend)

  constructor(private logService: LogService) {}

  ngOnInit(): void {
    this.loadLogs(); // Carga inicial de logs
  }

  ngAfterViewInit(): void {
    // Asignar templates de búsqueda a los encabezados
    this.headers = [
      { title: 'Responsable', headerTemplate: this.busquedaResponsable },
      { title: 'Fecha', headerTemplate: this.busquedaFecha },
      { title: 'Acción' },
      { title: 'Resultado' }
    ];
  }

  // Cargar logs desde el servicio
  loadLogs(page: number = 1): void {
    const backendPage = page - 1; 

    const observable =
      this.responsableFiltro.trim() !== '' || this.fechaFiltro.trim() !== ''
        ? this.logService.getLogsFiltrados(this.responsableFiltro, this.fechaFiltro, backendPage, this.pageSize)
        : this.logService.getLogsPaginado(backendPage, this.pageSize);

    observable.subscribe({
      next: (respuesta) => {
        this.paginatedData = (respuesta.content || []).map((log: any) => ({
          Responsable: `${log.objUsuarioLog?.nombres ?? ''} ${log.objUsuarioLog?.apellidos ?? ''}`.trim(),
          Fecha: log.fecha,
          Acción: log.accion,
          Resultado: log.resultado
        }));

        this.totalElements = respuesta.totalElements ?? 0;
        this.totalPages = this.totalElements > 0 ? Math.ceil(this.totalElements / this.pageSize) : 1;
        this.currentPage = Math.min(page, this.totalPages);
      },
      error: (err) => console.error('Error cargando logs', err)
    });
  }

  onBuscarResponsable(responsable: string): void {
    this.responsableFiltro = responsable;
    this.currentPage = 1;
    this.loadLogs(1);
  }

  onBuscarFecha(fecha: string): void {
    this.fechaFiltro = fecha;
    this.currentPage = 1;
    this.loadLogs(1);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.loadLogs(page);
  }
}
