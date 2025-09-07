import { Component } from '@angular/core';
import { SideBarSecretarioGeneralComponent } from '../../components/side-bar-secretario-general-component/side-bar-secretario-general-component';
import { HeaderMainComponent } from '../../../../shared/headers/header-main-component/header-main-component';
import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb-component/breadcrumb-component';
import { PageComponent } from '../../../../shared/pages/page-component/page-component';
import { InfoUsuarioComponent } from '../../../../shared/pages/info-usuario-component/info-usuario-component';

@Component({
  selector: 'app-secretario-general-home-component',
  imports: [PageComponent],
  templateUrl: './secretario-general-home-component.html',
  styleUrl: './secretario-general-home-component.css'
})
export class SecretarioGeneralHomeComponent {
  sidebar = SideBarSecretarioGeneralComponent;
  header = HeaderMainComponent;
  breadcrumb = BreadcrumbComponent
  main = InfoUsuarioComponent
}
