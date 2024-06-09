import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  constructor() { }

  isValidField(form: FormGroup, field: string): boolean | null {
    return form.controls[field].errors && form.controls[field].touched;
  }

  getFieldError(form: FormGroup, field: string): string | null {
    if (!form.controls[field]) return null;

    const errors = form.controls[field].errors || {};

    for (const key of Object.keys( errors )) {
      switch ( key ) {
        case 'required':
          // return 'Campo requerido';
          return 'Campo requerido';
        case 'minlength':
          // return `Debe tener mínimo ${ errors['minlength'].requiredLength } caracteres`;
          const minlength = errors['minlength'].requiredLength;
          return minlength;
        case 'maxlength':
          // return `Debe tener maximo ${ errors['maxlength'].requiredLength } caracteres`;
          const maxlength = errors['maxlength'].requiredLength;
          return maxlength;
        case 'min':
          // return `El valor debe ser mayor o igual a ${ errors['min'].min }`;
          const min = errors['min'].min;
          return min;
        case 'max':
          // return `El valor debe ser menor o igual a ${ errors['max'].max }`;
          const max = errors['max'].max;
          return max;
        case 'email':
          // return `Debe ingresar un email válido`;
          return 'Debe ingresar un email válido';
        case 'pattern':
          // return `Campo no válido`;
          return 'Campo no válido';
      }
    }

    return null;
  }
}
