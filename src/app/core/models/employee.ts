import { TypeAreas, TypeStatus, TypeUsers } from '../enums/employee.enum';

export class Employee {
    id?: string;
    name: string;
    surnames: string;
    job: string;
    area: TypeAreas;
    email: string;
    password: string;
    rol: TypeUsers;
    blnActivo?: TypeStatus;
    createdDate?: Date;

    constructor(){
        this.name = '',
        this.surnames = '',
        this.job = '',
        this.area = TypeAreas.Select,
        this.email = '',
        this.password = '',
        this.rol = TypeUsers.A0
        this.createdDate = new Date();
        this.blnActivo = TypeStatus.Active
    }
}
