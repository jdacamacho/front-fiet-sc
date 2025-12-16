import { Component } from '@angular/core';
import { SideBarUsuarioFietComponent } from '../../components/side-bar-usuario-fiet-component/side-bar-usuario-fiet-component';
import { HeaderMainComponent } from '../../../../shared/headers/header-main-component/header-main-component';
import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb-component/breadcrumb-component';
import { PageComponent } from '../../../../shared/pages/page-component/page-component';
import { InfoUsuarioComponent } from '../../../../shared/pages/info-usuario-component/info-usuario-component';

@Component({
  selector: 'app-usuario-fiet-home-component',
  imports: [PageComponent],
  templateUrl: './usuario-fiet-home-component.html',
  styleUrl: './usuario-fiet-home-component.css'
})
export class UsuarioFietHomeComponent {
  sidebar = SideBarUsuarioFietComponent;
  header = HeaderMainComponent;
  breadcrumb = BreadcrumbComponent
  main = InfoUsuarioComponent
}
