import { CommonModule } from '@angular/common';
import { Component, Input, Type } from '@angular/core';

@Component({
  selector: 'app-card-main-component',
  imports: [CommonModule],
  templateUrl: './card-main-component.html',
  styleUrl: './card-main-component.css'
})
export class CardMainComponent {
  @Input() preTitleComponent: Type<any> | null = null;
  @Input() title: string = '';
  @Input() buttons: Type<any>[] = [];
  @Input() bodyComponent: Type<any> | null = null;
  @Input() bodyInputs: Record<string, any> = {};
  @Input() preTitleInputs: Record<string, any> = {};
}
