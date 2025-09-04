import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './layouts/layout-component/layout-component';
import { HeaderMainComponent } from './shared/headers/header-main-component/header-main-component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb-component/breadcrumb-component';
import { SidebarComponent } from './shared/sidebars/sidebar-component/sidebar-component';
import { FooterSimpleComponent } from './shared/footers/footer-simple-component/footer-simple-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutComponent, HeaderMainComponent, BreadcrumbComponent, 
    SidebarComponent, FooterSimpleComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front-fiet-sc');
}
