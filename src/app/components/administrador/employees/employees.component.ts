import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeService } from 'src/app/core/service/employee.service';
import { Employee } from '../../../core/models/employee'
import { UserAuth } from 'src/app/core/models/auth';
import * as types from '../../../core/enums/employee.enum';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  employee = new Employee();
  employeeForm = new FormGroup({});
  listEmployees: Employee[] = [];
  employeeDesactivated: Employee[] = [];
  search: any;
  
  user = new UserAuth()
  show = false;
  formValid = true;
  send = false;
  isEdit = false;
  
  idEmployee = '';
  closeResult = '';
  
  filter = types.TypeAreas.Select;
  typeArea = types.areas;
  typeRol = types.users

  validation_messages = {
    name: [
      { type: 'required', message: 'Nombre requerido' }
    ],
    surnames: [
      { type: 'required', message: 'Apellidos requeridos' }
    ],
    job: [
      { type: 'required', message: 'Puesto de trabajo requerido' }
    ],
    area: [
      { type: 'required', message: 'Area de trabajo requerida' }
    ],
    email: [
      { type: 'required', message: 'Correo requerido' },
      { type: "pattern", message: 'El correo no es valido' }
    ],
    password: [
      { type: 'required', message: 'Contraseña requerida' }
    ],
    rol: [
      { type: 'required', message: 'Privilegios requeridos' }
    ]
  }

  constructor(private _service: EmployeeService, private modal: NgbModal,
    private toast: ToastrService, private formB: FormBuilder) { }

  ngOnInit(): void {
    this.getEmployees();
    this.employeeForm = this.createForm(this.employee);
    this.user = JSON.parse(localStorage.getItem('data') || '{}');
  }

  createForm(employeeForm: Employee): FormGroup {
    return this.formB.group({
      name: [employeeForm.name, Validators.required],
      surnames: [employeeForm.surnames, Validators.required],
      job: [employeeForm.job, Validators.required],
      area: [employeeForm.area, Validators.required],
      email: [
        employeeForm.email,
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9._%+-/ñ]+@[a-z0-9.-]+\\.[a-z]{2,6}$")
        ])
      ],
      password: [
        employeeForm.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(8)
        ])
      ],
      rol: [employeeForm.rol, Validators.required]
    })
  }

  filters(value: string){
    this.getEmployees(value);
  }

  getEmployees(value?: string){
    this._service.get().subscribe((res: any) => {
      const data = res;
      this.listEmployees = [];
      this.employeeDesactivated = [];

      data.forEach((employee: any) => {
        const status = employee.payload.doc.data()['blnActivo']
        if(status === types.TypeStatus.Active){
          this.listEmployees.push({
            id: employee.payload.doc.id,
            ...employee.payload.doc.data()
          });
        }else {
          this.employeeDesactivated.push({
            id: employee.payload.doc.id,
            ...employee.payload.doc.data()
          });
        }
      });

      if(value && value !== types.TypeAreas.Select){
        this.listEmployees = this.listEmployees.filter(employee => employee.area == value);
      }
    })
  }

  getOneEmployee(id: string){
    this._service.getOne(id).subscribe((res: any) => {
      const data = res;
      this.idEmployee = id;
      this.isEdit = true;

      this.employeeForm.setValue({
        name: data.payload.data()['name'],
        surnames: data.payload.data()['surnames'],
        job: data.payload.data()['job'],
        area: data.payload.data()['area'],
        email: data.payload.data()['email'],
        password: '',
        rol: data.payload.data()['rol']
      });
    })
  }

  newEmployee(values: Employee){
    if(this.employeeForm.valid && this.area?.value != 'Seleccionar'){
      this.send = true;
      this.formValid = true;
      let employee: Employee = values;
      employee.createdDate = new Date();
      employee.blnActivo = types.TypeStatus.Active
      
      this._service.add(employee).then(() => {
        this.toast.success('El empleado ha sido añadido con exito', '', 
        { positionClass: 'toast-bottom-right' })
        this.modal.dismissAll('Save click');
        this.reset();
      }).catch(err => {
        this.toast.error(`Ha ocurrido un error al agregar el empleado`, '', 
        { positionClass: 'toast-bottom-right' });
        this.send = false;
        this.formValid = true;
      })

    }else {
      this.toast.warning('Los datos invalidos o campos vacios'
      ,'', { positionClass: 'toast-bottom-right' })
      this.formValid = false;
    }
  }

  updateEmployee(values: any){
    if(this.employeeForm.valid && this.area?.value != 'Seleccionar'){
      this.send = true;
      this.formValid = true;
      const updateEmployee: Employee = values;
      
      this._service.update(this.idEmployee, updateEmployee).then(() => {
        this.toast.info('El empleado ha sido modificado con exito', '', 
        { positionClass: 'toast-bottom-right' });
        this.modal.dismissAll('Save click');
        this.reset();
      }).catch(err => {
        this.toast.error(`Ha ocurrido un error al modificar el empleado`, '', 
        { positionClass: 'toast-bottom-right' });
        this.send = false;
        this.formValid = true;
      })
    }else {
      this.toast.warning('Los datos invalidos o campos vacios'
      ,'', { positionClass: 'toast-bottom-right' })
      this.formValid = false;
    }
  }

  deleteEmployee(newStatus: string){
    if(this.user.id != this.idEmployee){
      this.send = true;

      this._service.delete(this.idEmployee, newStatus).then(() => {
        this.toast.info('El empleado ha sido modificado con exito', '', 
        { positionClass: 'toast-bottom-right' });
        this.getEmployees();
        this.reset();
      }).catch(err => {
        this.toast.error(`Ha ocurrido un error al modificar el empleado`, '', 
        { positionClass: 'toast-bottom-right' });
        console.log(err);
      }) 
    }else {
      this.toast.error(`Este usuario esta siendo usado`, 'No se puede eliminar el empleado', 
      { positionClass: 'toast-bottom-right' });
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
    return this.employeeForm.get('name');
  }

  get surnames(){
    return this.employeeForm.get('surnames');
  }
  
  get job(){
    return this.employeeForm.get('job');
  }

  get area(){
    return this.employeeForm.get('area');
  }

  get email(){
    return this.employeeForm.get('email');
  }

  get password(){
    return this.employeeForm.get('password');
  }

  get rol(){
    return this.employeeForm.get('rol');
  }

  reset(){
    this.employeeForm = this.createForm(this.employee);
    this.formValid = true;
    this.send = false;
    this.isEdit = false;
    this.idEmployee = '';
  }

}
