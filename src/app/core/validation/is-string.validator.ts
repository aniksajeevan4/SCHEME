import { AbstractControl, FormControl } from '@angular/forms';

export function validationIsString(maxValue:number=1000, minValue:number=0){
  return (control: AbstractControl): { [key: string]: any } | null =>{
    const value = control.value
      let errorString=null;
        if (String(value).trim().length==maxValue) control.setValue(String(value).substring(0, String(value).length-1))
        else if (String(value).trim().length>maxValue) errorString = { maxlength: true };
        else if (String(control.value).trim().length<minValue) errorString = { minlength: true };
        // else if (regex.test(control.value)) errorString = { pattern: true };
        // if(errorString) control.setValue('');
        return errorString;
    }
}
