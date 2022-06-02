import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from 'src/app/core/service/task.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserAuth } from 'src/app/core/models/auth';
import { Task } from '../../../../core/models/task';
import * as types from '../../../../core/enums/task.enum'

@Component({
  selector: 'app-send-task',
  templateUrl: './send-task.component.html',
  styleUrls: ['./send-task.component.css']
})
export class SendTaskComponent implements OnInit {
  idTask: any;
  
  taskForm = new FormGroup({});
  task = new Task();
  user = new UserAuth();
  formValid = true;
  send = false;

  typeEstatus = types.estatus;

  format = 'dd/MM/yyyy';

  constructor(private route: ActivatedRoute, private _service: TaskService,
    private router: Router, private formB: FormBuilder, private toast: ToastrService) {
      if(this.typeEstatus[0] == 'Seleccionar') this.typeEstatus.shift();
  }

  ngOnInit(): void {
    this.idTask = this.route.snapshot.paramMap.get('id');
    this.user = JSON.parse(localStorage.getItem('data') || '{}');
    this.taskForm = this.createForm(this.task);
    this.getTask();
  }

  createForm(taskForm: Task): FormGroup {
    return this.formB.group({
      estatus: [taskForm.estatus, Validators.required],
      info: [taskForm.info]
    })
  }

  getTask(){
    this._service.getOne(this.idTask).subscribe((res: any) => {
      const data = res;
      this.task = data.payload.data()
      const info = data.payload.data()['info'];
      const taskInfo = info ? info : "";

      this.taskForm.setValue({
        estatus: data.payload.data()['estatus'],
        info: taskInfo
      })
    })
  }
        
  sendTask(values: any){
    if(this.taskForm.valid){
      this.send = true;
      let task = this.task;
      task.info = values.info;
      task.estatus = values.estatus;

      this._service.update(this.idTask, task).then(() => {
        this.toast.success('La tarea ha sido entregada correctamente', '',
        { positionClass: 'toast-bottom-right'});
        this.reset();
        this.router.navigate(['myTask']);
      }).catch(err => {
        this.toast.error(`Ha ocurrido un error al mandar la tarea`, '', 
        { positionClass: 'toast-bottom-right' });
        this.reset();
      })

    }else {
      this.toast.warning('Los valores del formulario son invalidos', '',
      { positionClass: 'toast-bottom-right' })
      this.formValid = false;
    }
  }

  reset(){
    this.taskForm.reset();
    this.formValid = true;
    this.send = false;
  }

}
