import { TypeEstatus } from "../enums/proyect.enum";
import { TypeStatus } from '../enums/employee.enum'

export class Proyect {
    id?: string;
    name: string;
    description: string;
    estatus: TypeEstatus;
    participants: Array<string>;
    dateStart: Date;
    dateEnd: Date;
    blnActivo?: TypeStatus;
    createdDate?: Date;

    constructor(){
        this.name = '';
        this.description = '';
        this.estatus = TypeEstatus.En_progreso;
        this.participants = [];
        this.dateStart = new Date();
        this.dateEnd = new Date();
        this.blnActivo = TypeStatus.Active
        this.createdDate = new Date();
    }
}
