import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SecretarioGeneralRolesComponent } from './core/secretario-general/pages/secretario-general-roles-component/secretario-general-roles-component';
import { SecretarioGeneralLogComponent } from "./core/secretario-general/pages/secretario-general-log-component/secretario-general-log-component";
import { SecretarioGeneralUsuariosComponent } from "./core/secretario-general/pages/secretario-general-usuarios-component/secretario-general-usuarios-component";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SecretarioGeneralRolesComponent, SecretarioGeneralLogComponent, SecretarioGeneralUsuariosComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front-fiet-sc');
}
