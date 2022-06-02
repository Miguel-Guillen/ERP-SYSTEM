import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/core/service/task.service';
import { Task } from 'src/app/core/models/task';
import { UserAuth } from 'src/app/core/models/auth';
import * as types from '../../../../core/enums/task.enum'

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  listTasks: Task[] = [];
  search: any;
  user = new UserAuth();
  
  format = 'dd/MM/yyyy';
  
  filterEstatus = types.TypeEstatus.Select;
  filterPriority = types.TypePriority.Select;
  typePriority = types.priority;
  typeEstatus = types.estatus;

  constructor(private _service: TaskService, private route: Router) {};

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('data') || '{}');
    this.getTasks();
  }

  filters(value: string){
    this.getTasks(value);
  }

  searchTask(id: string){
    this.route.navigate([`/details/${id}`]);
  }

  getTasks(value?: string){
    this._service.get().subscribe((res: any) => {
      const data = res;
      this.listTasks = [];

      data.forEach((task: any) => {
        this.listTasks.push({
          id: task.payload.doc.id,
          ... task.payload.doc.data()
        });
      })
      
      if(value && value !== types.TypePriority.Select){
        if(value == "Alto" || value == "Medio" || value == "Bajo"){
          this.listTasks = this.listTasks.filter(tarea => tarea.priority == value);
        }else {
          this.listTasks = this.listTasks.filter(tarea => tarea.estatus == value);
        }
      }
      
    })
  }

}
