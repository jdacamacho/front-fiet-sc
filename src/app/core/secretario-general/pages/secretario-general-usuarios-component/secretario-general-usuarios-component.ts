import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBarSecretarioGeneralComponent } from '../../components/side-bar-secretario-general-component/side-bar-secretario-general-component';
import { HeaderMainComponent } from '../../../../shared/headers/header-main-component/header-main-component';
import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb-component/breadcrumb-component';
import { PageComponent } from '../../../../shared/pages/page-component/page-component';
import { UsuariosComponent } from '../../../../shared/pages/usuarios-component/usuarios-component';

@Component({
  selector: 'app-secretario-general-usuarios-component',
  imports: [CommonModule, PageComponent],
  templateUrl: './secretario-general-usuarios-component.html',
  styleUrl: './secretario-general-usuarios-component.css'
})
export class SecretarioGeneralUsuariosComponent {
  sidebar = SideBarSecretarioGeneralComponent;
  header = HeaderMainComponent;
  breadcrumb = BreadcrumbComponent;
  main = UsuariosComponent;
}
