// export function MinMaxNumber(minControlName: string, middleControlName:string,maxControlName: string){
//     console.log("inControlName,maxControlName");
    
//     return (formGroup: FormGroup) => {
        
//         const maxControl = formGroup.controls[maxControlName];
//         const minControl = formGroup.controls[minControlName];
//         const middleControl = formGroup.controls[middleControlName];
   

//         if (minControl.errors && maxControl.errors&&middleControl) {
//             return;
//         }
//         if (Number(minControl.value) > Number(middleControl.value)<Number(maxControl.value)) {
//             maxControl.setErrors({ minmax: true });
//         }
//         //  else {
//         //     maxControl.setErrors(null);
//         // }
//     }
// }


import { FormGroup, ValidationErrors } from '@angular/forms';
export function MiddleNumVal(minValue: string, maxValue: string, controlName: string) {
  // console.log("minValue, maxValue, controlName", minValue, maxValue, controlName);

  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const maxControl = formGroup.controls[minValue];
    const minControl = formGroup.controls[maxValue];
  // console.log("minValue, maxValue, controlName", minControl, maxControl, control);

    if (control.errors) {
      return;
    }


    if (Number(control.value) > Number(minControl.value) || Number(control.value) < Number(maxControl.value)) {
      control.setErrors({ middleNumValidation: true });
    }
    // else if (control.errors && control.errors['middleNumValidation']) {
    //     const errors: ValidationErrors = { ...control.errors };
    //     delete errors['middleNumValidation'];
    //     control.setErrors(Object.keys(errors).length > 0 ? errors : null);
    //   }
  };
}
  export function MiddleNumValForInterest(minValue: string, maxValue: string, controlName: string) {
    // console.log("minValue, maxValue, controlName", minValue, maxValue, controlName);
  
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const maxControl = formGroup.controls[minValue];
      const minControl = formGroup.controls[maxValue];
  
      if (control.errors) {
        return;
      }
  
  
      if (Number(control.value) > Number(minControl.value) || Number(control.value) < Number(maxControl.value)) {
        control.setErrors({ middleNumValidationInterest: true });
      }
      };
  }
  // export function MiddleNumValForInterest1(minValue: string, maxValue: string, controlName: string) {
  //   return (formGroup: FormGroup) => {
  //     const control = formGroup.controls[controlName];
  //     const maxControl = formGroup.controls[maxValue];
  //     const minControl = formGroup.controls[minValue];
  
  //     if (control.errors) {
  //       return;
  //     }
  
  //     if (Number(control.value) <  Number(minControl.value) || Number(control.value) > Number(maxControl.value)) {
  //       control.setErrors({ middleNumValidationInterest: true });     
  //     } else {
  //       control.setErrors({ middleNumValidationInterest: false }); // Clear the error if validation passes
  //       minControl.setErrors({ middleNumValidationInterest: false });// Clear the error if validation passes
  //       maxControl.setErrors({ middleNumValidationInterest: false });// Clear the error if validation passes
  //       control.updateValueAndValidity({ onlySelf: true });
  //       minControl.updateValueAndValidity({ onlySelf: true });
  //       maxControl.updateValueAndValidity({ onlySelf: true });
  //     }
  //   };
  // }
  export function MiddleNumValForInterest1(minValue: number, maxValue: number, interestRate: number): boolean {
    return interestRate < minValue || interestRate > maxValue;
  }