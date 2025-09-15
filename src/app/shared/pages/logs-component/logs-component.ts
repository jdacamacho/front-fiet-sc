import { Component } from '@angular/core';
import { ContentComponent } from '../content/content-component/content-component';
import { CommonModule } from '@angular/common';
import { LogContentComponent } from '../content/log-content-component/log-content-component';

@Component({
  selector: 'app-logs-component',
  imports: [CommonModule, ContentComponent],
  templateUrl: './logs-component.html',
  styleUrl: './logs-component.css'
})
export class LogsComponent {
  content = LogContentComponent
}
