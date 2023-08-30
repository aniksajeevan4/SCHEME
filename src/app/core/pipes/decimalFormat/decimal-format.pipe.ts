import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalFormat'
})
export class DecimalFormatPipe implements PipeTransform {

  transform(value: number | string): string {
    const parsedValue = parseFloat(value.toString());
    return isNaN(parsedValue) ? '0.00' : parsedValue.toFixed(2);
  }

}
