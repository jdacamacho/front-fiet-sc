import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private baseToastConfig = {
    toast: true,
    position: 'top-end' as const,
    showConfirmButton: false,
    timerProgressBar: true,
    customClass: {
      popup: 'my-toast-popup'
    }
  };

  private showToast(title: string, message: string, background: string, iconColor: string, timer: number) {
    Swal.fire({
      ...this.baseToastConfig,
      timer,
      background,
      iconColor,
      html: `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; flex-direction:column; margin-right:8px;">
            <div style="color:${iconColor}; font-weight:bold; font-family:'Titillium Web', sans-serif; font-size:12px;">
              ${title}
            </div>
            <div style="color:#3C3B3F; font-family:'Titillium Web', sans-serif; font-size:12px;">
              ${message}
            </div>
          </div>
          <button id="closeBtn" style="background:none; border:none; font-size:16px; cursor:pointer;">&times;</button>
        </div>
      `,
      didOpen: (toast) => {
        toast.querySelector('#closeBtn')?.addEventListener('click', () => {
          Swal.close();
        });
      }
    });
  }

  showInfo(title: string, message: string) {
    this.showToast(title, message, 'linear-gradient(to right, #1D72D3 5%, #E8F1FB 5%)', '#1D72D3', 3000);
  }

  showSuccess(title: string, message: string) {
    this.showToast(title, message, 'linear-gradient(to right, #5BAE40 5%, #EFF7EC 5%)', '#5BAE40', 3000);
  }

  showError(title: string, message: string) {
    this.showToast(title, message, 'linear-gradient(to right, #ED7D31 5%, #FDF2EA 5%)', '#ED7D31', 5000);
  }
}
