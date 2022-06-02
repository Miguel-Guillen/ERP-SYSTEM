import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/core/service/task.service';
import { UserAuth } from 'src/app/core/models/auth';
import { Task } from 'src/app/core/models/task';
import { TypeEstatus } from 'src/app/core/enums/task.enum';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.css']
})
export class MyTasksComponent implements OnInit {
  listTasks: Task[] = [];
  doneTasks: any[] = [];
  search: any;

  user = new UserAuth();
  show = false;

  format = 'dd/MM/yyyy';

  constructor(private _service: TaskService, private route: Router) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('data') || '{}');
    this.getTasks();
  }

  getTasks(){
    this._service.getByUser(this.user.id).subscribe((res: any) => {
      const data = res;
      this.listTasks = [];
      this.doneTasks = [];

      data.forEach((task: any) => {
        const status = task.payload.doc.data()['estatus']
        if(status == TypeEstatus.Terminado || status == TypeEstatus.Revision){
          this.doneTasks.push({
            id: task.payload.doc.id,
            ... task.payload.doc.data()
          });
        }else {
          this.listTasks.push({
            id: task.payload.doc.id,
            ... task.payload.doc.data()
          });
        }
      })
    })
  }

  searchTask(id: string){
    this.route.navigate([`sendTask/${id}`]);
  }

}
