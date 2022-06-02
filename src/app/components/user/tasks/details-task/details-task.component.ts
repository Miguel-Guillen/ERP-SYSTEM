import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from 'src/app/core/service/task.service';
import { ProyectService } from 'src/app/core/service/proyect.service';
import { UserAuth } from 'src/app/core/models/auth';
import { Proyect } from 'src/app/core/models/proyect';
import { Task } from 'src/app/core/models/task';

@Component({
  selector: 'app-details-task',
  templateUrl: './details-task.component.html',
  styleUrls: ['./details-task.component.css']
})
export class DetailsTaskComponent implements OnInit {
  listTasks: Task[] = [];
  user = new UserAuth();
  proyect = new Proyect();

  id = '';
  format = 'dd/MM/yyyy';

  constructor(private _service: TaskService, private _projectService: ProyectService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('data') || '{}');
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.getTask();
    this.getProject();
  }

  getTask(){
    this._service.getByUser(this.user.id).subscribe((res: any) => {
      const data = res;
      this.listTasks = [];

      data.forEach((task: any) => {
        const idProject = task.payload.doc.data()['idProject'];
        if(idProject === this.id){
          this.listTasks.push({
            id: task.payload.doc.id,
            ... task.payload.doc.data()
          });
        }
      })
    })
  }
  
  getProject(){
    this._projectService.getOne(this.id).subscribe((res: any) => {
      const data = res;
      this.proyect.id = data.payload.id;
      this.proyect = data.payload.data();
    })
  }

  searchTask(id: string){
    this.router.navigate([`/sendTask/${id}`]);
  }

}
