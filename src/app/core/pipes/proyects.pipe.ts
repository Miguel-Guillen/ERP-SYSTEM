import { Pipe, PipeTransform } from '@angular/core';
import { Proyect } from '../models/proyect';

@Pipe({
  name: 'proyects'
})
export class ProyectsPipe implements PipeTransform {

  transform(value: Proyect[], arg: string): Proyect[] {
    if(arg === undefined) return value;

    return value.filter((data: any) =>{
      return data.name.toLowerCase().includes(arg.toLowerCase())
    })
  }

}
