import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBarSecretarioGeneralComponent } from '../../components/side-bar-secretario-general-component/side-bar-secretario-general-component';
import { HeaderMainComponent } from '../../../../shared/headers/header-main-component/header-main-component';
import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb-component/breadcrumb-component';
import { PageComponent } from '../../../../shared/pages/page-component/page-component';
import { RolesComponent } from '../../../../shared/pages/roles-component/roles-component';

@Component({
  selector: 'app-secretario-general-roles-component',
  imports: [CommonModule, PageComponent],
  templateUrl: './secretario-general-roles-component.html',
  styleUrl: './secretario-general-roles-component.css'
})
export class SecretarioGeneralRolesComponent {
  sidebar = SideBarSecretarioGeneralComponent;
  header = HeaderMainComponent;
  breadcrumb = BreadcrumbComponent;
  main = RolesComponent;
}
