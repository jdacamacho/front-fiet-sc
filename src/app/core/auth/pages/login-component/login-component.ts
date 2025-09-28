import { Component } from '@angular/core';
import { PageSimpleComponent } from '../../../../shared/pages/page-simple-component/page-simple-component';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from '../../../../shared/login-form-component/login-form-component';

@Component({
  selector: 'app-login-component',
  imports: [CommonModule ,PageSimpleComponent],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css'
})
export class LoginComponent {
  loginFormComponent = LoginFormComponent
}
