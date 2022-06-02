import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { EmployeesComponent } from './components/administrador/employees/employees.component';
import { ProyectComponent } from './components/administrador/proyects/proyect/proyect.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TasksComponent } from './components/administrador/proyects/tasks/tasks.component'
import { MyTasksComponent } from './components/user/tasks/my-tasks/my-tasks.component'
import { SendTaskComponent } from './components/user/tasks/send-task/send-task.component';
import { DetailsProyectComponent } from './components/administrador/proyects/details-proyect/details-proyect.component';
import { LoginComponent } from './components/login/login.component';
import { MyProyectsComponent } from './components/user/my-proyects/my-proyects.component';
import { DetailsTaskComponent } from './components/user/tasks/details-task/details-task.component';
import { ReportsComponent } from './components/user/reports/reports.component'

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'employee', component: EmployeesComponent, canActivate: [AuthGuard] },
  { path: 'project', component: ProyectComponent, canActivate: [AuthGuard] },
  { path: 'details/:id', component: DetailsProyectComponent, canActivate: [AuthGuard] },
  { path: 'task', component: TasksComponent, canActivate: [AuthGuard] },
  { path: 'myTask', component: MyTasksComponent, canActivate: [AuthGuard] },
  { path: 'myProject', component: MyProyectsComponent, canActivate: [AuthGuard] },
  { path: 'details-task/:id', component: DetailsTaskComponent, canActivate: [AuthGuard] },
  { path: 'sendTask/:id', component: SendTaskComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
