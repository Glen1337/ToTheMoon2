// In: number
// Return: string
// Prettify nubmers by:
// 1. Adding +/- sign in front
// 2. Adding commas for thousands
// 3. Rounding if needed
// 4. Prepends an optional symbol between the +/- and number (%,$,etc.)

export function financialifyNumber(input: number, prependSymbol: string = '', addSign: boolean = false): string{
  let nombre: number = parseFloat(input.toFixed(2));
  if (nombre > 0) {
    return `${(addSign ? '+' : '')}${prependSymbol}${nombre.toLocaleString()}`;
  }
  if (nombre < 0) {
    return `${(addSign ? '-' : '')}${prependSymbol}${Math.abs(nombre).toLocaleString()}`;
  } else {
    return `${prependSymbol}0`;
  }
}
