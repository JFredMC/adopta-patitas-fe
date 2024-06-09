import { Injectable } from '@angular/core';
import Swal, { SweetAlertCustomClass } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  private customClasses: SweetAlertCustomClass = {
    popup: 'customPopup',
    confirmButton: 'btn btn-primary'
  }

  constructor() { }

  alert(
    type: 'success' | 'info' | 'warning' | 'error' | 'question',
    title: string,
    message?: string,
    html?: string,
  ) {
  
    Swal.fire({
      icon: type,
      title: title,
      text: message,
      html,
      confirmButtonText: 'Aceptar',
      showCloseButton: true,
      customClass: this.customClasses,
      heightAuto: false,
    });
  }

  confirm(
    type: 'success' | 'info' | 'warning' | 'error' | 'question',
    title: string,
    message: string
  ): Promise<boolean> {
    const translateTitle = title;
    const translateMessage = message;

    return Swal.fire({
      icon: type,
      title: translateTitle,
      text: translateMessage,
      heightAuto: false,
      showCancelButton: true,
      customClass: this.customClasses,
      confirmButtonText: 'Aceptar',
      denyButtonText: 'Cancelar',
    }).then((result) => result.isConfirmed);
  }

  toast(
    type: 'success' | 'info' | 'warning' | 'error' | 'question',
    title: string,
    message?: string
  ) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      background: this.getColor(type),
      iconColor: '#fff',
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });

    Toast.fire({
      icon: type,
      title: title,
      text: message
    });
  }

  getColor(type: string) {
    switch (type) {
      case 'success': return '#51A65E';
      case 'info': return '#0477BF';
      case 'warning': return '#F2B705';
      case 'error': return '#F20530';
      case 'question': return '#0477BF';
      default: return '#ffffff';
    }
  }
}
