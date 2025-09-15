import { Component, OnInit } from '@angular/core';
import { TableGenericComponent } from '../../../table-generic-component/table-generic-component';
import { CommonModule } from '@angular/common';
import { CardMainComponent } from '../../../card-main-component/card-main-component';
import { ButtonComponent } from '../../../buttons/button-component/button-component';
import { LogService } from '../../../../core/services/log-service';
import { LogDTORespuesta } from '../../../../core/models/Log/DTOResponse/LogDTORespuesta';
import { Paginator } from "../../../paginator/paginator";

@Component({
  selector: 'app-log-content-component',
  imports: [CommonModule, CardMainComponent, Paginator],
  templateUrl: './log-content-component.html', 
  styleUrl: './log-content-component.css'
})
export class LogContentComponent implements OnInit {
  currentPage = 1;
  pageSize = 10;
  tableComponent = TableGenericComponent;
  pretitleComponentComponent = ButtonComponent;
  buttons = []; 
  headers = ['Responsable', 'Fecha', 'Acción', 'Resultado'];
  data: any[] = [];

  constructor(private logService: LogService) {}

  ngOnInit(): void {
    this.loadLogs();
    console.log(this.data);
  }

  loadLogs(): void {
    this.logService.getLogs().subscribe({
      next: (logs: LogDTORespuesta[]) => {
        this.data = logs.map(log => ({
          Responsable: `${log.objUsuarioLog.nombres} ${log.objUsuarioLog.apellidos}`,
          Fecha: log.fecha,
          Acción: log.accion,
          Resultado: log.resultado 
        }));
      },
      error: (err) => {
        console.error('Error cargando logs', err);
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
