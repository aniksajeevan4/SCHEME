import { AbstractControl } from "@angular/forms";
  // Custom validator function for future date checking
  export function  validateFromDate(control: AbstractControl) {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time of today's date to 00:00:00
  
    if (selectedDate.getTime() < today.getTime()) {
      return { futureDateSelected: true };
    }
  
    return null;
  }