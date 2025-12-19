import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageComponent } from '../../../../shared/pages/page-component/page-component';
import { HeaderMainComponent } from '../../../../shared/headers/header-main-component/header-main-component';
import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb-component/breadcrumb-component';
import { SideBarSecretarioGeneralComponent } from '../../components/side-bar-secretario-general-component/side-bar-secretario-general-component';
import { SecSolicitudesComponent } from '../../../../shared/pages/sec-solicitudes-component/sec-solicitudes-component';

@Component({
  selector: 'app-secretario-general-solicitudes',
  imports: [CommonModule, PageComponent],
  templateUrl: './secretario-general-solicitudes.html',
  styleUrl: './secretario-general-solicitudes.css'
})
export class SecretarioGeneralSolicitudes {
  sidebar = SideBarSecretarioGeneralComponent;
  header = HeaderMainComponent;
  breadcrumb = BreadcrumbComponent;
  main = SecSolicitudesComponent;
}
