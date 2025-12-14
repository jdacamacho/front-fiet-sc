import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContentComponent } from '../content/content-component/content-component';
import { OrdenDelDiaContentComponent } from '../content/orden-del-dia-content-component/orden-del-dia-content-component';

@Component({
  selector: 'app-orden-del-dia-component',
  imports: [CommonModule, ContentComponent],
  templateUrl: './orden-del-dia-component.html',
  styleUrl: './orden-del-dia-component.css'
})
export class OrdenDelDiaComponent {
  content = OrdenDelDiaContentComponent
}
