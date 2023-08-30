import { AbstractControl } from '@angular/forms';


export function MinMaxDate(minDate: string, maxdate: string) {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    let errorString = null;
    if (new Date(maxdate) < new Date(value)) errorString = { maxDate: true };
    else if (new Date(value) < new Date(minDate)) errorString = { minDate: true };
    else errorString = null;
    return errorString;
  }
}
