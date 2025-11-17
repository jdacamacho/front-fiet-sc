import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBarSecretarioGeneralComponent } from '../../components/side-bar-secretario-general-component/side-bar-secretario-general-component';
import { HeaderMainComponent } from '../../../../shared/headers/header-main-component/header-main-component';
import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb-component/breadcrumb-component';
import { PageComponent } from '../../../../shared/pages/page-component/page-component';
import { TipoSolicitudesComponent } from '../../../../shared/pages/tipo-solicitudes-component/tipo-solicitudes-component';

@Component({
  selector: 'app-secretario-general-tipo-solicitudes-component',
  imports: [CommonModule, PageComponent],
  templateUrl: './secretario-general-tipo-solicitudes-component.html',
  styleUrl: './secretario-general-tipo-solicitudes-component.css'
})
export class SecretarioGeneralTipoSolicitudesComponent {
  sidebar = SideBarSecretarioGeneralComponent;
  header = HeaderMainComponent;
  breadcrumb = BreadcrumbComponent;
  main = TipoSolicitudesComponent;
}
