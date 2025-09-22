import { CommonModule } from '@angular/common';
import { Component, Input, Type } from '@angular/core';
import { ButtonComponent } from '../buttons/button-component/button-component';

export interface ButtonConfig {
  imgUrl: string;
  color: string;
  width: string;
  height: string;
  onClick: () => void;
}

@Component({
  selector: 'app-card-main-component',
  imports: [CommonModule, ButtonComponent] ,
  templateUrl: './card-main-component.html',
  styleUrl: './card-main-component.css'
})
export class CardMainComponent {
  @Input() preTitleComponent: Type<any> | null = null;
  @Input() title: string = '';
  @Input() buttons: ButtonConfig[] = [];
  @Input() bodyComponent: Type<any> | null = null;
  @Input() bodyInputs: Record<string, any> = {};
  @Input() preTitleInputs: Record<string, any> = {};
}
