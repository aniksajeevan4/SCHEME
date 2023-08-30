import { FormGroup } from '@angular/forms';
    

export function maxMinAmount(maxAmount: string, minAmount: string) {
  return (formGroup: FormGroup) => {
    const maxAmnt = formGroup.controls[maxAmount];
    const minAmnt = formGroup.controls[minAmount];

    if (maxAmnt.errors || minAmnt.errors) {
      return;
    }

    const maxAmntValue = maxAmnt.value;
    const minAmntValue = minAmnt.value;
    if (maxAmntValue <= minAmntValue) {
      maxAmnt.setErrors({ maxMinAmnt: true });
    } else {
      maxAmnt.setErrors(null);
    }
  };
}
