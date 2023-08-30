import { AbstractControl, FormControl } from '@angular/forms';

export function validationIsNumber( maxValue:number = 1000, minValue:number = 0){
  return (control: AbstractControl): { [key: string]: any } | null =>{

      const value = control.value;
      let errorString = null;
      if (value>=maxValue) {
        control.setValue(Number(String(value).substring(0, String(value).length-1)))
      }
      else if (value>maxValue) errorString = { max: true };
        else if (value<minValue) errorString = { min: true };
        return errorString;
    }
}
