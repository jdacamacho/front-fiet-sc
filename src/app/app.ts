import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SecretarioGeneralRolesComponent } from './core/secretario-general/pages/secretario-general-roles-component/secretario-general-roles-component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SecretarioGeneralRolesComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front-fiet-sc');
}
