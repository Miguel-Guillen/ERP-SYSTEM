import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private firestore: AngularFirestore) { }
  
  get(): Observable<any>{
    return this.firestore.collection('tareas', ref => ref
    .orderBy('createdDate', 'asc')).snapshotChanges()
  }
  
  getOne(id: string): Observable<any>{
    return this.firestore.collection('tareas').doc(id).snapshotChanges()
  }
  
  getByProject(id: string): Observable<any>{
    return this.firestore.collection('tareas', ref => ref
    .where('idProject', '==', id).orderBy('createdDate', 'asc')).snapshotChanges()
  }
  
  getByUser(id: string): Observable<any>{
    return this.firestore.collection('tareas', ref => ref
    .where('responsable', '==', id).orderBy('createdDate', 'asc')).snapshotChanges()
  }

  add(task: Task): Promise<any>{
    return this.firestore.collection('tareas').add(task);
  }

  update(id: string, data: Task): Promise<any> {
    return this.firestore.collection('tareas').doc(id).update(data);
  }

  delete(id: string): Promise<any> {
    return this.firestore.collection('tareas').doc(id).delete();
  }
}
