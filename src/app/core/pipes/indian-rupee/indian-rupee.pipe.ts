import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indianRupee'
})
export class IndianRupeePipe implements PipeTransform {
  transform(value: any): string {
    if (isNaN(value) || value === null) return '';

    const formattedValue = Number(value).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return formattedValue;
  }
}
