import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseUser } from '../../model/user/user.model';

const PURCHASED_USERS = 'purchased_users';

@Injectable({
  providedIn: 'root',
})
export class FirestoreRepository { 

  constructor(
    private angularFirestore: AngularFirestore
  ) {
  }
  
  verifyPurchaseEmail(email: string) {
    return this.angularFirestore.doc<FirebaseUser>(`${PURCHASED_USERS}/${email}`).valueChanges()
  }
}
  
