import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBarSecretarioGeneralComponent } from '../../components/side-bar-secretario-general-component/side-bar-secretario-general-component';
import { HeaderMainComponent } from '../../../../shared/headers/header-main-component/header-main-component';
import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb-component/breadcrumb-component';
import { PageComponent } from '../../../../shared/pages/page-component/page-component';
import { LogsComponent } from '../../../../shared/pages/logs-component/logs-component';

@Component({
  selector: 'app-secretario-general-log-component',
  imports: [CommonModule, PageComponent],
  templateUrl: './secretario-general-log-component.html',
  styleUrl: './secretario-general-log-component.css'
})
export class SecretarioGeneralLogComponent {
  sidebar = SideBarSecretarioGeneralComponent;
  header = HeaderMainComponent;
  breadcrumb = BreadcrumbComponent;
  main = LogsComponent
}
