import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private firestore: AngularFirestore) { }

  get(): Observable<any>{
    return this.firestore.collection('empleados', ref => ref
    .orderBy('createdDate', 'asc')).snapshotChanges()
  }

  getOne(id: string): Observable<any>{
    return this.firestore.collection('empleados').doc(id).snapshotChanges()
  }

  add(empleado: Employee): Promise<any>{
    return this.firestore.collection('empleados').add(empleado);
  }

  update(id: string, data: Employee): Promise<any> {
    return this.firestore.collection('empleados').doc(id).update(data);
  }

  delete(id: string, status: string): Promise<any> {
    return this.firestore.collection('empleados').doc(id).update({ blnActivo: status })
  }

  // delete(id: string): Promise<any> {
  //   return this.firestore.collection('empleados').doc(id).delete()
  // }

}
