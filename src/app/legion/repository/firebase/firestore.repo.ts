import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { FirebaseUser } from '../../model/user/user.model';
import { USERS_DOC, PURCHASED_USERS } from './firebase.constants';

@Injectable({
  providedIn: 'root',
})
export class FirestoreRepository { 

  constructor(
    private angularFirestore: AngularFirestore
  ) { /** */ }

  /**
   * Saving user data to remote firestore under our user data collection with the unique userId being our key identifier.
   * The unique key collection is held as a reference for all other data uploads under this user.
   * 
   * @param userId
   * @param userData
   * @returns response
   */
  saveUserData(userId: string, userData: any) {
    return this.angularFirestore.collection(USERS_DOC).doc(userId).update(userData);
  }

  removeUserData(userId: string) {
    return this.angularFirestore.collection(USERS_DOC).doc(userId).delete();
  }
}
  
