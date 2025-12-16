import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableGenericComponent } from '../../../../shared/table-generic-component/table-generic-component';
import { CardMainComponent } from '../../../../shared/card-main-component/card-main-component';
import { ButtonComponent } from '../../../../shared/buttons/button-component/button-component';
import { BarraBusquedaComponent } from '../../../../shared/search/barra-busqueda-component/barra-busqueda-component';
import { GenericDialogInfoComponent } from '../../../../shared/generic-dialog-info-component/generic-dialog-info-component';
import { Paginator } from '../../../../shared/paginator/paginator';
import { TipoSolicitudService } from '../../../../core/services/tipo-solicitud-service';
import { TipoSolicitudDTORespuesta } from '../../../../core/models/TipoSolicitud/DTOResponse/TipoSolicitudDTORespuesta';
import { EnviarSolicitudUsuarioPublicoComponent } from '../enviar-solicitud-usuario-publico-component/enviar-solicitud-usuario-publico-component';

@Component({
  selector: 'app-usuario-publico-solicitudes-content-component',
  standalone: true,
  imports: [
    CommonModule,
    CardMainComponent,
    ButtonComponent,
    BarraBusquedaComponent,
    GenericDialogInfoComponent,
    Paginator,
    EnviarSolicitudUsuarioPublicoComponent
  ],
  templateUrl: './usuario-publico-solicitudes-content-component.html',
  styleUrl: './usuario-publico-solicitudes-content-component.css'
})
export class UsuarioPublicoSolicitudesContentComponent implements OnInit, AfterViewInit {

  tableComponent = TableGenericComponent;
  tipoDeSolicitudFiltro: string = '';
  enviarSolicitudVisible = false;

  headers: any[] = [
    { title: 'Solicitud', headerTemplate: null }
  ];

  paginatedData: any[] = [];

  totalElements = 0;
  totalPages = 1;
  currentPage = 1;
  pageSize = 5;

  filtroNombre = '';

  tipoInfoDialogVisible = false;
  selectedTipoInfo: any = null;

  @ViewChild('busquedaTipoSolicitud') busquedaTipoSolicitud!: TemplateRef<any>;
  @ViewChild('actionTemplate') actionTemplate!: TemplateRef<any>;

  constructor(private tipoSolicitudesService: TipoSolicitudService) {}

  ngOnInit(): void {
    this.loadTiposSolicitudes();
  }

  ngAfterViewInit(): void {
    this.headers = [
      { title: 'Solicitud', headerTemplate: this.busquedaTipoSolicitud }
    ];
  }

  onRealizarSolicitud(): void {
    this.enviarSolicitudVisible = true;
  }

  loadTiposSolicitudes(page: number = 1): void {
    const backendPage = page - 1; 
    let perfilSolicitante = 'Solicitante Publico';

    const observable =
      this.tipoDeSolicitudFiltro.trim() !== ''
        ? this.tipoSolicitudesService.getTiposSolicitudPorNombreYPerfilSolicitante(this.tipoDeSolicitudFiltro, perfilSolicitante, backendPage, this.pageSize)
        : this.tipoSolicitudesService.getTiposSolicitudPorPerfilSolicitante(perfilSolicitante, backendPage, this.pageSize);

    observable.subscribe({
      next: (respuesta) => {
        if (respuesta.content.length === 0) {
          this.paginatedData = [];
          this.totalElements = 0;
          this.totalPages = 1;
          this.currentPage = 1;
          return;
        }
        this.paginatedData = (respuesta.content || []).map((tipoSolicitud:any) => ({
          ...tipoSolicitud,
          Solicitud: tipoSolicitud.nombre,
          Funcionario: `${tipoSolicitud.objFuncionarioEncargado?.nombres ?? ''} ${tipoSolicitud.objFuncionarioEncargado?.apellidos ?? ''}`.trim()
        }));

        this.totalElements = respuesta.totalElements ?? 0;
        this.totalPages = this.totalElements > 0 ? Math.ceil(this.totalElements / this.pageSize) : 1;
        this.currentPage = Math.min(page, this.totalPages);
      },
      error: (err) => {
        this.paginatedData = [];
        this.totalElements = 0;
        this.totalPages = 1;
        this.currentPage = 1;
      }
    });
  }

  onBuscarTipoSolicitud(filtro: string): void {
    this.tipoDeSolicitudFiltro = filtro;
    this.currentPage = 1;
    this.loadTiposSolicitudes(1);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.loadTiposSolicitudes(page);
  }

  protected verMasInfo(tipoSolicitud: TipoSolicitudDTORespuesta): void {
    this.tipoSolicitudesService.getTipoSolicitud(tipoSolicitud.uuidTipoSolicitud).subscribe({
      next: (tipoSolicitudDetallado: TipoSolicitudDTORespuesta) => {
        const anexosTexto = (tipoSolicitudDetallado.anexos || [])
          .map(a => 
            `\n• ${a.nombre}\n${a.descripcion}\n${a.formato}\nObligatorio: ${a.obligatoriedad ? 'Sí ✅' : 'No ❌'}`
          )
          .join('\n');

        this.selectedTipoInfo = {
          Nombre: tipoSolicitudDetallado.nombre,
          Descripción: tipoSolicitudDetallado.descripcion,
          Anexos: anexosTexto || 'Sin anexos registrados',
          Funcionario_Responsable: `${tipoSolicitudDetallado.objFuncionarioEncargado?.nombres ?? ''} ${tipoSolicitudDetallado.objFuncionarioEncargado?.apellidos ?? ''}`.trim(),
          Correo_Electrónico: tipoSolicitudDetallado.objFuncionarioEncargado?.correoElectronico || 'N/A'
        };
        this.tipoInfoDialogVisible = true;
      },
      error: (err) => {
        console.error('Error cargando Tipo de Solicitud', err);
      }
    });
  }
  
}