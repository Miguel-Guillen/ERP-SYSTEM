import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/core/service/task.service';
import { UserAuth } from 'src/app/core/models/auth';
import { Task } from 'src/app/core/models/task';
import { TypeEstatus } from 'src/app/core/enums/task.enum'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  user = new UserAuth();
  
  format = 'dd/MM/yyyy'

  constructor(private _service: TaskService, private route: Router) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('data') || '{}')
    this.getTask();
  }

  navigate(route: string){
    this.route.navigate([`/${route}`]);
  }

  getTask(){
    this._service.getByUser(this.user.id).subscribe((res: any) => {
      const data = res;
      this.tasks = [];
      
      data.forEach((task: any, index: number) => {
        const estatus = task.payload.doc.data()['estatus'];
        if(estatus != TypeEstatus.Terminado && index <= 4){
          this.tasks.push({
            id: task.payload.doc.id,
            ... task.payload.doc.data()
          });
        }
      })
    })
  }

  searchTask(id: string){
    this.route.navigate([`/sendTask/${id}`]);
  }

}
