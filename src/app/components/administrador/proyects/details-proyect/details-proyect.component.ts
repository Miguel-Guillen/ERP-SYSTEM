import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProyectService } from 'src/app/core/service/proyect.service';
import { TaskService } from 'src/app/core/service/task.service';
import { EmployeeService } from 'src/app/core/service/employee.service';
import { Proyect } from '../../../../core/models/proyect'
import { Employee } from 'src/app/core/models/employee';
import { Task } from 'src/app/core/models/task';
import { UserAuth } from 'src/app/core/models/auth';
import { TypeStatus } from '../../../../core/enums/employee.enum'
import * as types from '../../../../core/enums/proyect.enum'
import * as typesTask from '../../../../core/enums/task.enum';

@Component({
  selector: 'app-details-proyect',
  templateUrl: './details-proyect.component.html',
  styleUrls: ['./details-proyect.component.css']
})
export class DetailsProyectComponent implements OnInit {
  employees: Employee[] = [];
  listTasks: Task[] = [];
  editForm: FormGroup;
  secondForm = new FormGroup({});
  taskForm = new FormGroup({});
  project = new Proyect();
  task = new Task();
  user = new UserAuth();

  formValid = true;
  send = false;
  edit = false;

  format = 'dd/MM/yyyy';
  id = '';
  idTask = '';
  closeResult = '';

  typeEstatus = types.estatus;
  typePriority = typesTask.priority;
  typeEstatus2 = typesTask.estatus;


  validation_messages = {
    name: [
      { type: 'required', message: 'Nombre requerido' }
    ],
    description: [
      { type: 'required', message: 'Descripcion requerida' }
    ],
    estatus: [
      { type: 'required', message: 'Estado del proyecto requerido' }
    ],
    dateStart: [
      { type: 'required', message: 'Fecha de inicio requerida' }
    ],
    dateEnd: [
      { type: 'required', message: 'Fecha de entrega requerida' }
    ]
  }

  validation_messages2 = {
    title: [
      { type: 'required', message: 'El nombre es requerido' }
    ],
    description: [
      { type: 'required', message: 'La descripcion es requerida' }
    ],
    requeriments: [
      { type: 'required', message: 'Los requisitos son requeridos' }
    ],
    estatus: [
      { type: 'required', message: 'Estado de la tarea requerido' }
    ],
    priority: [
      { type: 'required', message: 'El tipo de prioridad es requerida' }
    ],
    dueDate: [
      { type: 'required', message: 'La fecha de entrega es requerida' }
    ],
    responsable: [
      { type: 'required', message: 'El responsable es requerido' }
    ]
  }

  // validation_messages3 = {
  //   requeriments: [
  //     { type: 'required', message: 'Los requisitos son requeridos' }
  //   ]
  // }

  constructor(
    private formB: FormBuilder,
    private toast: ToastrService,
    private _service: ProyectService,
    private _taskService: TaskService,
    private _employeeService: EmployeeService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private modal: NgbModal, 
    private config: NgbModalConfig) {
      this.config.backdrop = 'static';
      this.config.keyboard = false;

      this.editForm = this.formB.group({
        name: new FormControl("", Validators.required),
        description: new FormControl("", Validators.required),
        estatus: new FormControl("", Validators.required),
        dateStart: new FormControl(new Date(), Validators.required),
        dateEnd: new FormControl(new Date(), Validators.required)
      })
      if(this.typeEstatus[0] == 'Seleccionar') this.typeEstatus.shift();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.user = JSON.parse(localStorage.getItem('data') || '{}');
    this.searchProyect(this.id);
    this.getTask();
    this.allEmployees();
    this.taskForm = this.createForm(this.task);
  }

  createForm(taskForm: Task): FormGroup {
    this.secondForm = new FormGroup({
      participants: new FormArray([])
    })

    return this.formB.group({
      title: [taskForm.title, Validators.required],
      description: [taskForm.description, Validators.required],
      requeriments: [taskForm.requeriments, Validators.required],
      priority: [taskForm.priority, Validators.required],
      estatus: [taskForm.estatus, Validators.required],
      dueDate: [taskForm.dueDate, Validators.required],
      responsable: [taskForm.responsable, Validators.required],
      commentary: [taskForm.commentary]
    })
  }

  addRequeriment(){
    const participant = new FormControl('', Validators.required);
    this.participantes.push(participant);
  }

  remove(index: number){
    this.participantes.removeAt(index);
  }

  searchProyect(id: string){
    this._service.getOne(id).subscribe((res: any) => {
      const data = res;
      this.project = data.payload.data();
      const dateS = data.payload.data()['dateStart'].slice(0, 10);
      const dateE = data.payload.data()['dateEnd'].slice(0, 10);
      
      this.editForm.setValue({
        name: data.payload.data()['name'],
        description: data.payload.data()['description'],
        estatus: data.payload.data()['estatus'],
        dateStart: dateS,
        dateEnd: dateE
      })

      this.secondForm = new FormGroup({
        participants: new FormArray([])
      })
      const participants = data.payload.data()['participants'];
      for(const participant of participants){
        this.participantes.push(new FormControl(participant, Validators.required));
      }
    })

  }

  editProyect(values: Proyect){
    if(this.editForm.valid){
      this.send = true;
      const proyect = values;

      this._service.update(this.id, proyect).then(() => {
        this.toast.success('El proyecto ha sido modificado con exito', '', 
        { positionClass: 'toast-bottom-right' });
        this.modal.dismissAll('Save click');
        this.reset();
      }).catch(err => {
        this.toast.error(`Ha ocurrido un error al modificar el proyecto`, '', 
        { positionClass: 'toast-bottom-right' });
        this.send = false;
        this.formValid = true;
      })

    }else {
      this.toast.warning('Los datos no son validos o los campos estan vacios', '', 
      { positionClass: 'toast-bottom-right' });
      this.formValid = false;
    }
  }

  editParticipant(values: any){
    if(this.secondForm.valid){
      this.send = true;
      const participants = values.participants;

      this._service.updateParticipants(this.id, participants).then(() => {
        this.toast.success('El proyecto ha sido modificado con exito', '', 
        { positionClass: 'toast-bottom-right' });
        this.modal.dismissAll('Save click');
      }).catch(err => {
        this.toast.error(`Ha ocurrido un error al modificar el proyecto`, '', 
        { positionClass: 'toast-bottom-right' });
        this.send = false;
        this.formValid = true;
      })

    }else {
      this.toast.warning('Los datos no son validos o los campos estan vacios', '', 
      { positionClass: 'toast-bottom-right' });
      this.formValid = false;
    }
  }

  deleteProyect(newStatus: string){
    this._service.delete(this.id, newStatus).then(() => {
      this.toast.info('El proyecto ha sido modificado con exito', '', 
      { positionClass: 'toast-bottom-right' })
      this.router.navigate(['/project'])
    }).catch(err => {
      this.toast.error(`Ha ocurrido un error al modificar el proyecto`, '', 
      { positionClass: 'toast-bottom-right' });
    })
  }

  // Functions task

  searchTask(id: string){
    this._taskService.getOne(id).subscribe((res: any) => {
      const data = res;
      this.edit = true;
      this.idTask = id;
      const dueDate = res.payload.data()['dueDate'].slice(0, 10);
      
      this.taskForm.setValue({
        title: data.payload.data()['title'],
        description: data.payload.data()['description'],
        requeriments: data.payload.data()['requeriments'],
        priority: data.payload.data()['priority'],
        estatus: data.payload.data()['estatus'],
        dueDate: dueDate,
        responsable: data.payload.data()['responsable'],
        commentary: data.payload.data()['commentary']
      })
    })
  }

  getTask(){
    this._taskService.getByProject(this.id).subscribe((res: any) => {
      const data = res;
      this.listTasks = [];

      data.forEach((task: any) => {
        this.listTasks.push({
          id: task.payload.doc.id,
          ... task.payload.doc.data()
        });
      })
    })
  }

  // checkData(nameModal: any){
  //   if(this.taskForm.valid && this.priority?.value != 'Seleccionar' && 
  //   this.estatus2?.value != 'Seleccionar'){
  //     this.modal.open(nameModal);
  //   }else {
  //     this.toast.warning('Los datos no son validos o los campos estan vacios', '', 
  //     { positionClass: 'toast-bottom-right' });
  //     this.formValid = false;
  //   }
  // }

  newTask(taskFormValues: Task){
    if(this.taskForm.valid && this.priority?.value != 'Seleccionar'
    && this.estatus2?.value != 'Seleccionar'){
      this.send = true;
      let task = taskFormValues;
      // task.requeriments = secondFormValues.requeriments
      task.idProject = this.id;
      task.blnActivo = TypeStatus.Active;
      task.createdDate = new Date();

      this._taskService.add(task).then(() => {
        this.toast.success('La tarea ha sido agregada con exito', '', 
        { positionClass: 'toast-bottom-right' });
        this.modal.dismissAll('Save click');
        this.reset();
      }).catch(err => {
        this.toast.error(`Ha ocurrido un error al agregar la tarea`, '', 
        { positionClass: 'toast-bottom-right' });
        this.send = false;
        this.formValid = true;
      })

    }else {
      this.toast.warning('Los datos no son validos o los campos estan vacios', '', 
      { positionClass: 'toast-bottom-right' });
      this.formValid = false;
    }
  }

  editTask(taskFormValues: Task) {
    if(this.taskForm.valid && this.priority?.value != 'Seleccionar'
    && this.estatus2?.value != 'Seleccionar'){
      this.send = true;
      let task = taskFormValues;
      task.idProject = this.id;

      this._taskService.update(this.idTask ,task).then(() => {
        this.toast.success('La tarea ha sido modificada con exito', '', 
        { positionClass: 'toast-bottom-right' });
        this.reset();
        this.modal.dismissAll('Save click');
      }).catch(err => {
        this.toast.error(`Ha ocurrido un error al modificar la tarea`, '', 
        { positionClass: 'toast-bottom-right' });
        this.send = false;
        this.formValid = true;
      })

    }else {
      this.toast.warning('Los datos no son validos o los campos estan vacios', '', 
      { positionClass: 'toast-bottom-right' });
      this.formValid = false;
    }
  }

  deleteTask(){
    this._taskService.delete(this.idTask).then(() => {
      this.toast.info('La tarea ha sido borrada con exito', '', 
      { positionClass: 'toast-bottom-right' })
      this.reset();
    }).catch(err => {
      this.toast.error(`Ha ocurrido un error al borrar la tarea`, '', 
      { positionClass: 'toast-bottom-right' });
    })
  }

  allEmployees(){
    this._employeeService.get().subscribe((res: any) => {
      const data = res;

      data.forEach((employee: any) => {
        const status = employee.payload.doc.data()['blnActivo']
        if(status === TypeStatus.Active){
          this.employees.push({
            id: employee.payload.doc.id,
            ...employee.payload.doc.data()
          });
        }
      })
    });
  }

  openModal(content: any){
    this.modal.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  get name(){
    return this.editForm.get('name');
  }

  get description(){
    return this.editForm.get('description');
  }

  get estatus(){
    return this.editForm.get('estatus');
  }
  
  get participantes(): FormArray{
    return this.secondForm.get('participants') as FormArray;
  }
  
  get dateStart(){
    return this.editForm.get('dateStart');
  }

  get dateEnd(){
    return this.editForm.get('dateEnd');
  }

  get title(){
    return this.taskForm.get('title');
  }

  get description2(){
    return this.taskForm.get('description');
  }

  get requeriments(){
    return this.taskForm.get('requeriments');
  }

  // get requeriments(): FormArray {
  //   return this.secondForm.get('requeriments') as FormArray;
  // }

  get estatus2(){
    return this.taskForm.get('estatus');
  }
  
  get priority(){
    return this.taskForm.get('priority');
  }

  get dueDate(){
    return this.taskForm.get('dueDate');
  }

  get responsable(){
    return this.taskForm.get('responsable');
  }

  reset(){
    this.taskForm = this.createForm(this.task);
    this.send = false;
    this.formValid = true;
    this.edit = false;
    this.idTask = '';
  }

}
