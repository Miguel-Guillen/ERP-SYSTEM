import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'employee'
})
export class EmployeePipe implements PipeTransform {

  transform(value: any, arg: any): any {
    if(arg === undefined) return value;

    return value.filter((data: any) =>{
      return data.name.toLowerCase().includes(arg.toLowerCase())
    })
  }

}
