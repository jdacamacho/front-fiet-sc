import { Component } from '@angular/core';
import { PageSimpleComponent } from '../../../../shared/pages/page-simple-component/page-simple-component';
import { CommonModule } from '@angular/common';
import { InfoUsuarioComponent } from '../../../../shared/pages/info-usuario-component/info-usuario-component';

@Component({
  selector: 'app-login-component',
  imports: [CommonModule ,PageSimpleComponent],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css'
})
export class LoginComponent {
  loginFormComponent = InfoUsuarioComponent
}
