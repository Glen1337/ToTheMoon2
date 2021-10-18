import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fiFormat'
})
export class FiFormatPipe implements PipeTransform {

  transform(input: number, prepend: string = '', append: string = '', sign: boolean = false): string {
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
      return `${prepend}0`;
    }
  }
}
