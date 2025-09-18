import { CommonModule } from '@angular/common';
import { Component, Input, Type, TemplateRef  } from '@angular/core';

export interface TableHeader {
  title: string;
  headerTemplate?: TemplateRef<any>;
}

@Component({
  selector: 'app-table-generic-component',
  imports: [CommonModule],
  templateUrl: './table-generic-component.html',
  styleUrl: './table-generic-component.css'
})
export class TableGenericComponent {
  @Input() headers: TableHeader[] = [];
  @Input() data: any[] = [];
  @Input() actionTemplate!: TemplateRef<any>; 
}
