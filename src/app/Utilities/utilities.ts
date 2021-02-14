// In: number
// Return: string
// Prettify nubmers by:
// 1. Adding +/- sign in front
// 2. Adding commas for thousands
// 3. Rounding if needed
// 4. Prepends an optional symbol between the +/- and number (%,$,etc.)

export function financialifyNumber(input: number, prependSymbol: string = '', addSign: boolean = false): string{
  if (input === undefined || input === null) return '';
  
  let num: number = parseFloat(input.toFixed(2));
  
  if (num > 0) {
    return `${(addSign ? '+' : '')}${prependSymbol}${num.toLocaleString()}`;
  }
  if (num < 0) {
    return `${(addSign ? '-' : '')}${prependSymbol}${Math.abs(num).toLocaleString()}`;
  } else {
    return `${prependSymbol}0`;
  }
}
