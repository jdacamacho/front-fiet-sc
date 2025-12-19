import { Component } from '@angular/core';
import { PageComponent } from '../../../../shared/pages/page-component/page-component';
import { SideBarFuncionarioComponent } from '../../components/side-bar-funcionario-component/side-bar-funcionario-component';
import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb-component/breadcrumb-component';
import { InfoUsuarioComponent } from '../../../../shared/pages/info-usuario-component/info-usuario-component';
import { HeaderMainComponent } from '../../../../shared/headers/header-main-component/header-main-component';

@Component({
  selector: 'app-funcionario-home-component',
  imports: [PageComponent],
  templateUrl: './funcionario-home-component.html',
  styleUrl: './funcionario-home-component.css'
})
export class FuncionarioHomeComponent {
  sidebar = SideBarFuncionarioComponent;
  header = HeaderMainComponent;
  breadcrumb = BreadcrumbComponent
  main = InfoUsuarioComponent
}
