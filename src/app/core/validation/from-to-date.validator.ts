import { FormGroup } from '@angular/forms';


export function FromToDate(fromDate: string, toDate: string){
    return (formGroup: FormGroup) => {
        const tDate = formGroup.controls[fromDate];
        const fDate = formGroup.controls[toDate];
        if (fDate.errors && fDate.errors) {
            return;
        }
        if (new Date(tDate.value) > new Date(fDate.value)) {
            fDate.setErrors({ FromToDate: true });
        } else {
            fDate.setErrors(null);
        }
    }
}
