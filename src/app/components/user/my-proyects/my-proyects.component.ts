import { Component, OnInit } from '@angular/core';
import { ProyectService } from 'src/app/core/service/proyect.service';
import { UserAuth } from 'src/app/core/models/auth';
import { Proyect } from 'src/app/core/models/proyect';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-proyects',
  templateUrl: './my-proyects.component.html',
  styleUrls: ['./my-proyects.component.css']
})
export class MyProyectsComponent implements OnInit {
  listProjects: Proyect[] = [];
  search: any;
  
  user = new UserAuth();
  
  format = 'dd/MM/yyyy';

  constructor(private _service: ProyectService, private route: Router) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('data') || '{}');
    this.getProyects();
  }

  getProyects(){
    this._service.getByUser(this.user.id).subscribe((res: any) => {
      const data = res;
      this.listProjects = [];

      data.forEach((project: any) => {
        this.listProjects.push({
          id: project.payload.doc.id,
          ... project.payload.doc.data()
        });
      })
    })
  }

  searchTask(id: string){
    this.route.navigate([`/details-task/${id}`]);
  }

}
