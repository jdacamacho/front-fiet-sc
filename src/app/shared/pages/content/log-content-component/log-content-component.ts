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
import { LogDTORespuesta } from '../../../../core/models/Log/DTOResponse/LogDTORespuesta';
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

  originalData: any[] = []; // Data completa
  data: any[] = [];         // Data filtrada para mostrar

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
  loadLogs(): void {
    this.logService.getLogs().subscribe({
      next: (logs: LogDTORespuesta[]) => {
        this.originalData = logs.map(log => ({
          Responsable: `${log.objUsuarioLog.nombres} ${log.objUsuarioLog.apellidos}`,
          Fecha: log.fecha,
          Acción: log.accion,
          Resultado: log.resultado
        }));
        this.data = [...this.originalData]; // Inicializa la data filtrada
      },
      error: (err) => console.error('Error cargando logs', err)
    });
  }

  // Filtra la data según el campo y texto ingresado
  filtrarData(campo: string, texto: string) {
    if (!texto) {
      this.data = [...this.originalData]; // Mostrar todo si no hay texto
    } else {
      this.data = this.originalData.filter(item =>
        item[campo]?.toLowerCase().includes(texto.toLowerCase())
      );
    }
    this.currentPage = 1; // Reinicia paginación al filtrar
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
