import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SecretarioGeneralHomeComponent } from './core/secretario-general/pages/secretario-general-home-component/secretario-general-home-component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SecretarioGeneralHomeComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front-fiet-sc');
}
