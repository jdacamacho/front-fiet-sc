import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextComponent } from '../inputs/input-text-component/input-text-component';
import { InputPasswordComponent } from '../inputs/input-password-component/input-password-component';
import { SimpleButtonComponent } from '../buttons/simple-button-component/simple-button-component';
import { AuthService } from '../../core/services/auth-service';
import { SesionDTOPeticion } from '../../core/models/Sesión/DTORequest/SesionDTOPeticion';
import { Router } from '@angular/router';
import { ErrorHandlerService } from '../../core/services/error-handler-service';

@Component({
  selector: 'app-login-form-component',
    imports: [CommonModule, InputTextComponent, InputPasswordComponent, SimpleButtonComponent],
  templateUrl: './login-form-component.html',
  styleUrl: './login-form-component.css'
})
export class LoginFormComponent {
  username = '';
  password = '';

  constructor(
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router
  ) {}

  onSubmit(): void {
    const request: SesionDTOPeticion = { username: this.username, password: this.password };

    this.authService.login(request).subscribe({
      next: (userInfo) => {
        const roles = userInfo.roles.map(r => r.nombre);
        if (roles.includes('Secretario General')) this.router.navigate(['/secgeneral']);
      },
      error: (err) => this.errorHandlerService.handleError(err, "Error en Autenticación")
    });
  }
}
