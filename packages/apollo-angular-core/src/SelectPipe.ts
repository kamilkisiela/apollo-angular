import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'select',
})
export class SelectPipe implements PipeTransform {
  public transform(obj: any, name: string = '') {
    if (name !== '') {
      return obj && obj.data && obj.data[name];
    }
  }
}
