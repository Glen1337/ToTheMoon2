import { Pipe, PipeTransform } from '@angular/core';

// 1. Add +/- sign in front
// 2. Add commas for thousands
// 3. Rounding if needed
// 4. Prepends an optional symbol before the number
// 5. Appends an optional symbol after the number
// 6. Specify Precision up to 2 decimal points
// 7. Converts number from bigint to number if necessary

@Pipe({
  name: 'fiFormat'
})
export class FiFormatPipe implements PipeTransform {

  transform(input: number | bigint | undefined, prepend: string = '', append: string = '', sign: boolean = false, decimals: boolean = false): string {

    if (input === undefined) {
      return '';
    }

    // Warning
    if (typeof input === 'bigint') {
      input = Number(input);
    }
    if (input === undefined || input === null) {
      return '';
    }

    let numberString = "";

    if (input > 0) {
      if (decimals) {
        numberString = Number(input).toFixed(2).toLocaleString();
      } else {
        numberString = Number(input).toLocaleString();
      }

      return `${sign ? '+' : ''}${prepend}${numberString}${append}`;
    }
    if (input < 0) {
      if (decimals) {
        numberString = Number(Math.abs(input)).toFixed(2).toLocaleString();
        return `${sign ? '-' : ''}${prepend}${numberString}${append}`;
      }
      numberString = Number(Math.abs(input)).toLocaleString();
      return `${sign ? '-' : ''}${prepend}${numberString}${append}`;

    }

    return `${prepend}0${append}`;

  }
}
