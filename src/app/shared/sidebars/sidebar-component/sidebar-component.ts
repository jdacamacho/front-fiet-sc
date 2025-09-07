import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonGroupComponent } from '../../buttons/button-group-component/button-group-component';

@Component({
  selector: 'app-sidebar-component',
  imports: [CommonModule, ButtonGroupComponent],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.css'
})
export class SidebarComponent {
  @Input() buttons: { label: string, imgUrl?: string }[] = [];
}
