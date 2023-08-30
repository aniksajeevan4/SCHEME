import { AbstractControl, ValidatorFn } from '@angular/forms';

export function emailValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (control.value && !emailRegex.test(control.value)) {
    return { 'email': true };
  }

  return null;
}

export function numberValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value === null || value === '') {
      return null; 
    }
    const regex = /^[0-9]*$/; 
    const numberValidator = regex.test(value);
    return numberValidator ? null : { 'invalidNumber': true };
  }

  export function characterValidator(control: AbstractControl): { [key: string]: boolean } | null {

    const characterRegex = /^(?!\s+$)[a-zA-Z\s]+$/;
    if (control.value && !characterRegex.test(control.value)) {
      return { 'character': true };
    }
    return null;
  }

  export function description(control: AbstractControl): { [key: string]: boolean } | null {

    const characterRegex =/^(?!^ +$)[a-zA-Z0-9.,/() -]+$/ ;
    if (control.value && !characterRegex.test(control.value)) {
      return { 'description': true };
    }
    return null;
  }


export function minLengthValidator(length: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.length < length) {
      return { 'minlength': true };
    }
    return null;
  };
}

export function maxLengthValidator(length: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.length > length) {
      return { 'maxlength': true };
    }
    return null;
  };
}
