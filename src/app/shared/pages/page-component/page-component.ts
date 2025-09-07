import { Component, Input, Type } from '@angular/core';
import { FooterSimpleComponent } from '../../footers/footer-simple-component/footer-simple-component';
import { LayoutComponent } from '../../../layouts/layout-component/layout-component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-page-component',
  imports: [CommonModule, LayoutComponent, FooterSimpleComponent],
  templateUrl: './page-component.html',
  styleUrl: './page-component.css'
})
export class PageComponent {
  @Input() sidebarComponent!: Type<any>;
  @Input() headerComponent!: Type<any>;
  @Input() breadcrumbComponent!: Type<any>;
  @Input() breadcrumbInputs: any;
  @Input() mainComponent!: Type<any>;
}
