// In: number
// Return: string
// Prettify nubmers by:
// 1. Adding +/- sign in front
// 2. Adding commas for thousands
// 3. Rounding if needed
// 4. Prepends an optional symbol between the +/- and number (%,$,etc.)

export function financialifyNumber(input: number, prepend = ''){
    let nombre = parseFloat(input.toFixed(2));
  
    if (input > 0){
      return `+${prepend}${nombre.toLocaleString()}`;
    }else if (nombre < 0){
      return `-${prepend}${Math.abs(nombre).toLocaleString()}`;
    }else{
      return '0';
    }
  }
