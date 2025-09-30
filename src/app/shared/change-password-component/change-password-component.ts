import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { ButtonComponent } from '../buttons/button-component/button-component';
import { GenericDialogFormComponent } from '../generic-dialog-form-component/generic-dialog-form-component';
import { InputPasswordComponent } from '../inputs/input-password-component/input-password-component';
import { UsuariosService } from '../../core/services/usuarios-service';
import { CambioContraseñaDTOPeticion } from '../../core/models/Usuario/DTORequest/CambioContraseñaDTOPeticion';
import { ToastService } from '../../core/services/toast-service';
import { ErrorHandlerService } from '../../core/services/error-handler-service';

@Component({
  selector: 'app-change-password-component',
  imports: [CommonModule, ButtonComponent, GenericDialogFormComponent, InputPasswordComponent],
  templateUrl: './change-password-component.html',
  styleUrl: './change-password-component.css'
})
export class ChangePasswordComponent {
  @Input() uuidUsuario!: string;
  visible = false;

  @ViewChild('inputOldPassword') inputOldPassword!: InputPasswordComponent;
  @ViewChild('inputNewPassword') inputNewPassword!: InputPasswordComponent;

  constructor(
    private usuarioService: UsuariosService,
    private toastService: ToastService,
    private errorHandlerService: ErrorHandlerService
  ){}

  open() {
    this.visible = true;
    if (this.inputOldPassword) {
      this.inputOldPassword.value = '';
      this.inputOldPassword.touched = false;
    }
    if (this.inputNewPassword) {
      this.inputNewPassword.value = '';
      this.inputNewPassword.touched = false;
    }
  }

  close() {
    this.visible = false;
  }

  save() {
    this.inputOldPassword.touched = true;
    this.inputNewPassword.touched = true;

    if (this.inputOldPassword.isInvalid() || this.inputNewPassword.isInvalid()) return;

    const peticion: CambioContraseñaDTOPeticion = {
      contraseña: this.inputOldPassword.value,
      nuevaContraseña: this.inputNewPassword.value
    };

    this.usuarioService.cambiarContraseña(this.uuidUsuario, peticion).subscribe({
      next: () => {
        this.close();
        this.toastService.showSuccess("Exitó", "La contraseña ha sido actualizada con exito.");
      },
      error: (err) => {
        this.close();
        this.errorHandlerService.handleError(err, "Error actualizando contraseña.");
      }
    });
  }
}
