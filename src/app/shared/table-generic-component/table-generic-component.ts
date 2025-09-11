import { CommonModule } from '@angular/common';
import { Component, Input, Type } from '@angular/core';

@Component({
  selector: 'app-table-generic-component',
  imports: [CommonModule],
  templateUrl: './table-generic-component.html',
  styleUrl: './table-generic-component.css'
})
export class TableGenericComponent {
  @Input() headers: string[] = [];
  @Input() data: any[] = [];
  @Input() actionButtons?: Type<any>[][] | null = null;
}
