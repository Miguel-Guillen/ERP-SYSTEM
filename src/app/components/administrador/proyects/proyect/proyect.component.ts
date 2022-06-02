import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalConfig ,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ProyectService } from 'src/app/core/service/proyect.service';
import { EmployeeService } from 'src/app/core/service/employee.service';
import { Proyect } from '../../../../core/models/proyect';
import { Employee } from 'src/app/core/models/employee';
import { UserAuth } from 'src/app/core/models/auth';
import { TypeEstatus } from '../../../../core/enums/proyect.enum';
import { TypeStatus } from '../../../../core/enums/employee.enum';

@Component({
  selector: 'app-proyect',
  templateUrl: './proyect.component.html',
  styleUrls: ['./proyect.component.css']
})
export class ProyectComponent implements OnInit {
  projectsProgress: Proyect[] = [];
  projectsDone: Proyect[] = [];
  projectsDesactivated: Proyect[] = [];
  employees: Employee[] = [];
  search: any;
  
  projectForm = new FormGroup({});
  secondForm = new FormGroup({});
  user = new UserAuth();
  project = new Proyect();
  formValid = true;
  send = false;
  
  show = 0;
  closeResult = '';
  format = 'dd/MM/yyyy';

  typeEstatus = TypeEstatus;

  validation_messages = {
    name: [
      { type: 'required', message: 'Nombre requerido' }
    ],
    description: [
      { type: 'required', message: 'Descripcion requerida' }
    ],
    participants: [
      { type: 'required', message: 'Participantes requeridos' }
    ],
    dateStart: [
      { type: 'required', message: 'Fecha de inicio requerida' }
    ],
    dateEnd: [
      { type: 'required', message: 'Fecha de entrega requerida' }
    ]
  }

  constructor(
    private formB: FormBuilder, 
    private _service: ProyectService,
    private _employeeService: EmployeeService,
    private modal: NgbModal, 
    private config: NgbModalConfig,
    private toast: ToastrService, 
    private route: Router) {
      this.config.backdrop = 'static',
      this.config.keyboard = false
    }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('data') || '{}');
    this.getProyects();
    this.allEmployees();
    this.projectForm = this.createForm(this.project);
  }

  createForm(form: Proyect): FormGroup {
    this.secondForm = new FormGroup({
      participants: new FormArray([
        new FormControl('', Validators.required)
      ])
    })

    return this.formB.group({
      name: [form.name, Validators.required],
      description: [form.description, Validators.required],
      dateStart: [form.dateStart, Validators.required],
      dateEnd: [form.dateEnd, Validators.required]
    });
  }

  addRequeriment(){
    const participant = new FormControl('', Validators.required);
    this.participantes.push(participant);
  }

  remove(index: number){
    this.participantes.removeAt(index);
  }

  getProyects(){
    this._service.get().subscribe((res: any) => {
      const data = res;
      this.projectsProgress = [];
      this.projectsDone = [];
      this.projectsDesactivated = [];

      data.forEach((project: any) => {
        const status = project.payload.doc.data()['blnActivo']
        const statusProject = project.payload.doc.data()['estatus']
        if(status === TypeStatus.Active){
          if(statusProject == TypeEstatus.En_progreso || statusProject == TypeEstatus.Pausado){
            this.projectsProgress.push({
              id: project.payload.doc.id,
              ...project.payload.doc.data()
            });
          }
          if(statusProject == TypeEstatus.Cerrado){
            this.projectsDone.push({
              id: project.payload.doc.id,
              ...project.payload.doc.data()
            })
          }
        }else {
          this.projectsDesactivated.push({
            id: project.payload.doc.id,
            ...project.payload.doc.data()
          });
        }
      });
    })
  }

  searchProyect(id: string){
    this.route.navigate([`/details/${id}`]);
  }

  newProject(projectValues: Proyect, secondFormValues: any){
    if(this.projectForm.valid, this.secondForm.valid){
      this.send = true;
      this.formValid = true;
      let project = projectValues;
      project.participants = secondFormValues.participants;
      project.blnActivo = TypeStatus.Active;
      project.estatus = TypeEstatus.En_progreso;
      project.createdDate = new Date();
      
      this._service.add(project).then(() => {
        this.toast.success('El proyecto ha sido añadido con exito', '', 
        { positionClass: 'toast-bottom-right' });
        this.modal.dismissAll('Save click');
        this.reset();
      }).catch(err => {
        this.toast.error(`Ha ocurrido un error al agregar el empleado`, '', 
        { positionClass: 'toast-bottom-right' });
        this.send = false;
        this.formValid = true;
      })

    }else {
      this.toast.warning('Los datos no son validos o los campos estan vacios', '',
      { positionClass: 'toast-bottom-right' });
      this.formValid = false;
      this.send = false;
    }
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

  checkData(modal: any){
    if(this.projectForm.valid){
      this.modal.open(modal);
    }else {
      this.toast.warning('Los datos no son validos o los campos estan vacios', '', 
      { positionClass: 'toast-bottom-right' });
      this.formValid = false;
    }
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
    return this.projectForm.get('name');
  }

  get description(){
    return this.projectForm.get('description');
  }

  get participantes(): FormArray{
    return this.secondForm.get('participants') as FormArray;
  }
  
  get dateStart(){
    return this.projectForm.get('dateStart');
  }

  get dateEnd(){
    return this.projectForm.get('dateEnd');
  }

  reset(){
    this.projectForm = this.createForm(this.project);
    this.send = false;
    this.formValid = true;
  }

}
