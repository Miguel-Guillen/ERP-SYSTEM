import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Auth } from '../models/auth';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private firestore: AngularFirestore) { }

  login(data: Auth): Observable<any>{
    return this.firestore.collection('empleados', ref => ref
    .where('email','==', data.email).where('password', '==', data.password)).snapshotChanges();
  }

}
