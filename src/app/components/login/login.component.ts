import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/service/auth.service';
import { Auth } from 'src/app/core/models/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup

  loginInvalid = false;
  send = false;

  validation_messages = {
    email: [
      { type: 'required', message: 'Ingrese su correo' },
      { type: "pattern", message: "Su correo no es valido"}
    ],
    password: [
      { type: 'required', message: 'Ingrese su contraseña' }
    ]
  }

  constructor(private formB: FormBuilder, private _service: AuthService,
    private route: Router, private toast: ToastrService) {
      this.loginForm = this.formB.group({
        email: new FormControl ("", Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9._%+-/ñ]+@[a-z0-9.-]+\\.[a-z]{2,6}$")
        ])),
        password: new FormControl ("", Validators.compose([
          Validators.required,
          Validators.minLength(8)
        ]))
      })
    }

  ngOnInit(): void {
  }

  login(values: Auth){
    if(this.loginForm.valid){
      const credentials = values;
      this.send = true;
      this.loginInvalid = false;

      this._service.login(credentials).subscribe((res: any) => {
        if(res == undefined || res == ''){
          this.loginInvalid = true;
          this.send = false;
          return this.toast.error(`Correo o contraseña incorrectos`, '', 
          { positionClass: 'toast-bottom-right' });
        }else {
          const data = res[0].payload;
          const token = {
            id: data.doc.id,
            rol: data.doc.data()['rol'],
          };
          this.reset();
          localStorage.setItem('data', JSON.stringify(token));
          return this.route.navigate(['dashboard']);
        }
      })
        // this.toast.error(`Correo o contraseña incorrectos`, '', 
        // { positionClass: 'toast-bottom-right' });
        // this.loginInvalid = true;
        // this.send = false;
    }else {
      this.loginInvalid = true;
      this.toast.warning('Campos vacios o incorrectos', '', 
      { positionClass: 'toast-bottom-right' })
    }
  }

  get email(){
    return this.loginForm.get('email');
  }

  get password(){
    return this.loginForm.get('password');
  }

  reset(){
    this.loginForm.reset();
    this.send = false;
    this.loginInvalid = false;
  }

}
