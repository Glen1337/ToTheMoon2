import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fiFormat'
})
export class FiFormatPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
