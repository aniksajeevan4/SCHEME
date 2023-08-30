import { FormGroup, ValidationErrors } from '@angular/forms';

export function MinMaxNumber(minControlName: string, maxControlName: string){
    console.log("inControlName,maxControlName");

    return (formGroup: FormGroup) => {

        const maxControl = formGroup.controls[maxControlName];
        const minControl = formGroup.controls[minControlName];


        if (minControl.errors && maxControl.errors) {
            return;
        }
        if (Number(minControl.value) > Number(maxControl.value)) {
            maxControl.setErrors({ minmax: true });
        }
        else if (maxControl.errors && maxControl.errors['minmax']) {
            const errors: ValidationErrors = { ...maxControl.errors };
            delete errors['minmax'];
            maxControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
          }
    }
}
