import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { TableGenericComponent } from '../../../table-generic-component/table-generic-component';
import { CommonModule } from '@angular/common';
import { CardMainComponent } from '../../../card-main-component/card-main-component';
import { ButtonComponent } from '../../../buttons/button-component/button-component';
import { Paginator } from "../../../paginator/paginator";
import { BarraBusquedaComponent } from '../../../search/barra-busqueda-component/barra-busqueda-component';
import { TipoSolicitudService } from '../../../../core/services/tipo-solicitud-service';
import { GenericDialogInfoComponent } from '../../../generic-dialog-info-component/generic-dialog-info-component';
import { TipoSolicitudDTORespuesta } from '../../../../core/models/TipoSolicitud/DTOResponse/TipoSolicitudDTORespuesta';
import { AuthService } from '../../../../core/services/auth-service';
import { EnviarSolicitudUsuarioFietComponent } from '../../../../core/usuario fiet/components/enviar-solicitud-usuario-fiet-component/enviar-solicitud-usuario-fiet-component';

@Component({
  selector: 'app-usuario-fiet-solicitudes-privadas-content-component',
  imports: [
    CommonModule, 
    CardMainComponent,
    Paginator, 
    BarraBusquedaComponent, 
    ButtonComponent, 
    GenericDialogInfoComponent,
    EnviarSolicitudUsuarioFietComponent
  ],
  templateUrl: './usuario-fiet-solicitudes-privadas-content-component.html',
  styleUrls: ['./usuario-fiet-solicitudes-privadas-content-component.css']
})
export class UsuarioFietSolicitudesPrivadasContentComponent implements OnInit, AfterViewInit {
  tableComponent = TableGenericComponent;
  pretitleComponentComponent = ButtonComponent;

  buttonsCard: any[] = [
    {
      imgUrl: 'buttons/campana.svg',
      color: '#1E257B',
      width: '20px',
      height: '20px',
      onClick: () => {
        this.enviarSolicitudVisible = true;
      }
    }
  ];

  headers: any[] = [
    { title: 'Solicitud', headerTemplate: null }
  ];

  paginatedData: any[] = [];
  totalElements = 0;
  totalPages = 1;
  currentPage = 1;
  pageSize = 5;

  tipoDeSolicitudFiltro: string = '';
  usuario: any;

  @ViewChild('busquedaTipoSolicitud') busquedaTipoSolicitud!: TemplateRef<any>;
  @ViewChild('actionTemplate') actionTemplate!: TemplateRef<any>;

  enviarSolicitudVisible = false;
  tipoInfoDialogVisible = false;
  selectedTipoInfo: any = null;

  constructor(private tipoSolicitudesService: TipoSolicitudService, 
              private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.usuario$.subscribe(user => {
      this.usuario = user;
    });
    this.loadTiposSolicitudes();
  }

  ngAfterViewInit(): void {
    this.headers = [
      { title: 'Solicitud', headerTemplate: this.busquedaTipoSolicitud },
    ];
  }

  loadTiposSolicitudes(page: number = 1): void {
    const backendPage = page - 1; 
    let perfilSolicitante = this.usuario?.roles[0].nombre;

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
