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

  transform(input: number | bigint, prepend: string = '', append: string = '', sign: boolean = false): string {

    if (typeof input === 'bigint'){
      input = Number(input);
    }

    if (input === undefined || input === null){
      return '';
    }

    let nombre: number = parseFloat(input.toFixed(2));

    if (nombre > 0) {
      return `${(sign ? '+' : '')}${prepend}${nombre.toLocaleString('en-US')}${append}`;
    }
    if (nombre < 0) {
      return `${(sign ? '-' : '')}${prepend}${Math.abs(nombre).toLocaleString('en-US')}${append}`;
    } else {
      return `${prepend}0${append}`;
    }
  }
}
