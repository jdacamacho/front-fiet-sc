import { Component } from '@angular/core';
import { SideBarUsuarioFietComponent } from '../../components/side-bar-usuario-fiet-component/side-bar-usuario-fiet-component';
import { HeaderMainComponent } from '../../../../shared/headers/header-main-component/header-main-component';
import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb-component/breadcrumb-component';
import { PageComponent } from '../../../../shared/pages/page-component/page-component';
import { UsuarioFietSolicitudesPrivadasComponent } from '../../../../shared/pages/usuario-fiet-solicitudes-privadas-component/usuario-fiet-solicitudes-privadas-component';


@Component({
  selector: 'app-usuariofiet-solicitudes-component',
  imports: [PageComponent],
  templateUrl: './usuariofiet-solicitudes-component.html',
  styleUrl: './usuariofiet-solicitudes-component.css'
})
export class UsuariofietSolicitudesComponent {
  sidebar = SideBarUsuarioFietComponent;
  header = HeaderMainComponent;
  breadcrumb = BreadcrumbComponent
  main = UsuarioFietSolicitudesPrivadasComponent
}
