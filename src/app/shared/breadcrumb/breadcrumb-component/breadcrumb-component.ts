import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrumb-component',
  imports: [],
  templateUrl: './breadcrumb-component.html',
  styleUrl: './breadcrumb-component.css'
})
export class BreadcrumbComponent {
  @Input() role: string = ''; // nombre del rol
  @Input() breadcrumbs: { label: string, url?: string }[] = [];
}
