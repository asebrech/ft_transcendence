import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskInput'
})
export class MaskInputPipe implements PipeTransform {
  transform(value: string, maskChar: string = '*'): string {
    if (!value) {
      return '';
    }
    let maskedValue = '';
    for (let i = 0; i < value.length; i++) {
      maskedValue += maskChar;
    }
    return maskedValue;
  }
}