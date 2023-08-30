import { FormGroup, ValidationErrors } from '@angular/forms';

export function NotEqual(control1Name: string, control2Name: string){
    return (formGroup: FormGroup) => {
        const control1 = formGroup.controls[control1Name];
        const control2 = formGroup.controls[control2Name];

        if (control2.errors && control1.errors) {
            return;
        }
        else if (Number(control2.value) == Number(control1.value)) {
          control2.setErrors({ notEqual: true });
        }
        else if (control1.errors && control1.errors['notEqual']) {
            const errors: ValidationErrors = { ...control2.errors };
            delete errors['notEqual'];
            control2.setErrors(Object.keys(errors).length > 0 ? errors : null);
          }
    }
}
