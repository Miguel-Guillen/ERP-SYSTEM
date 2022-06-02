import { TypeEstatus, TypePriority } from '../enums/task.enum';
import { TypeStatus } from '../enums/employee.enum';

export class Task {
    id?: string;
    title: string;
    description: string;
    requeriments: string;
    priority: TypePriority;
    estatus: TypeEstatus;
    dueDate: Date;
    idProject: string;
    responsable: string;
    commentary?: string;
    info: string;
    // evidence?: string;
    createdDate?: Date;
    blnActivo?: TypeStatus;

    constructor(){
        this.title = '';
        this.description = '';
        this.requeriments = '';
        this.priority = TypePriority.Select;
        this.estatus = TypeEstatus.Select;
        this.dueDate = new Date();
        this.idProject = '';
        this.responsable = '';
        this.commentary = '';
        this.info = '';
        this.createdDate = new Date();
        this.blnActivo = TypeStatus.Active;
    }
}