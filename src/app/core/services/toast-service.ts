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
    showCloseButton: true,
    closeButtonHtml: '&times;',
    timerProgressBar: true,
    customClass: {
      popup: 'my-toast-popup'
    }
  };

  showInfo(title: string, message: string) {
    Swal.fire({
      ...this.baseToastConfig,
      timer: 5000,
      background: 'linear-gradient(to right, #1D72D3 5%, #E8F1FB 5%)',
      iconColor: '#1D72D3',
      html: `
        <div style="display:flex; flex-direction:column;">
          <div style="color:#1D72D3; font-weight:bold; font-family:'Titillium Web', sans-serif; font-size:12px;">
            ${title}
          </div>
          <div style="color:#3C3B3F; font-family:'Titillium Web', sans-serif; font-size:12px;">
            ${message}
          </div>
        </div>
      `
    });
  }

  showSuccess(title: string, message: string) {
    Swal.fire({
      ...this.baseToastConfig,
      timer: 5000,
      background: 'linear-gradient(to right, #5BAE40 5%, #EFF7EC 5%)',
      iconColor: '#5BAE40',
      html: `
        <div style="display:flex; flex-direction:column;">
          <div style="color:#5BAE40; font-weight:bold; font-family:'Titillium Web', sans-serif; font-size:12px;">
            ${title}
          </div>
          <div style="color:#3C3B3F; font-family:'Titillium Web', sans-serif; font-size:12px;">
            ${message}
          </div>
        </div>
      `
    });
  }

  showError(title: string, message: string) {
    Swal.fire({
      ...this.baseToastConfig,
      timer: 8000,
      background: 'linear-gradient(to right, #ED7D31 5%, #FDF2EA 5%)',
      iconColor: '#ED7D31',
      html: `
        <div style="display:flex; flex-direction:column;">
          <div style="color:#ED7D31; font-weight:bold; font-family:'Titillium Web', sans-serif; font-size:12px;">
            ${title}
          </div>
          <div style="color:#3C3B3F; font-family:'Titillium Web', sans-serif; font-size:12px;">
            ${message}
          </div>
        </div>
      `
    });
  }
}
