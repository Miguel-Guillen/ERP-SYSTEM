import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Proyect } from '../models/proyect';

@Injectable({
  providedIn: 'root'
})
export class ProyectService {

  constructor(private firestore: AngularFirestore) { }
  
  get(): Observable<any>{
    return this.firestore.collection('proyectos', ref => ref
    .orderBy('createdDate', 'asc')).snapshotChanges()
  }
  
  getOne(id: string): Observable<any>{
    return this.firestore.collection('proyectos').doc(id).snapshotChanges()
  }

  getByUser(id: string): Observable<any> {
    return this.firestore.collection('proyectos', ref => ref
    .where('participants', 'array-contains', id).orderBy('createdDate', 'asc')).snapshotChanges()
  }
  
  add(proyect: Proyect): Promise<any>{
    return this.firestore.collection('proyectos').add(proyect);
  }

  update(id: string, data: Proyect): Promise<any> {
    return this.firestore.collection('proyectos').doc(id).update(data);
  }

  updateParticipants(id: string, participants: any): Promise<any> {
    return this.firestore.collection('proyectos').doc(id).update({ participants })
  }

  delete(id: string, status: string): Promise<any> {
    return this.firestore.collection('proyectos').doc(id).update({ blnActivo: status })
  }

}
