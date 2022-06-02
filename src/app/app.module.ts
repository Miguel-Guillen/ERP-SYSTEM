import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http'
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmployeesComponent } from './components/administrador/employees/employees.component';
import { ProyectComponent } from './components/administrador/proyects/proyect/proyect.component';
import { DetailsProyectComponent } from './components/administrador/proyects/details-proyect/details-proyect.component';
import { TasksComponent } from './components/administrador/proyects/tasks/tasks.component';
import { MyTasksComponent } from './components/user/tasks/my-tasks/my-tasks.component';
import { SendTaskComponent } from './components/user/tasks/send-task/send-task.component';
import { MyProyectsComponent } from './components/user/my-proyects/my-proyects.component';
import { LoginComponent } from './components/login/login.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { DetailsTaskComponent } from './components/user/tasks/details-task/details-task.component';
import { AuthGuard } from './core/guards/auth.guard';

import { ProyectsPipe } from './core/pipes/proyects.pipe';
import { EmployeePipe } from './core/pipes/employee.pipe';
import { TaskPipe } from './core/pipes/task.pipe';
import { environment } from '../environments/environment';
import { ReportsComponent } from './components/user/reports/reports.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeesComponent,
    ProyectComponent,
    DetailsProyectComponent,
    DashboardComponent,
    ProyectsPipe,
    TasksComponent,
    MyTasksComponent,
    SendTaskComponent,
    EmployeePipe,
    LoginComponent,
    MyProyectsComponent,
    SidebarComponent,
    FooterComponent,
    DetailsTaskComponent,
    TaskPipe,
    ReportsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgbModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [ AuthGuard ],
  bootstrap: [AppComponent]
})
export class AppModule { }
