import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  QueryFn,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FireAuthRepository } from './fireauth.repo';
import { USERS_COL } from './firebase.constants';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FirestoreRepository {
  constructor(
    private firestore: AngularFirestore,
    private fireAuthRepository: FireAuthRepository
  ) {}

  // Create a single data object under a user ID
  async createUsersDocument<T>(
    collectionPath: string,
    documentKey: string,
    data: T,
    userId: string = this.fireAuthRepository.sessionUser?.uid || ''
  ): Promise<T> {
    console.log('createUsersDocument', collectionPath, documentKey, data, userId)
    const docRef = this.firestore
      .collection(USERS_COL)
      .doc(userId)
      .collection(collectionPath)
      .doc<T>(documentKey);
    await docRef.set(data as any);
    if (!environment.production) {
      console.groupCollapsed(
        `❤️‍🔥 Firestore Service [${collectionPath}] [createUserDocument]`
      );
      console.log(`❤️‍🔥 [${userId}]`, data);
      console.groupEnd();
    }
    return data;
  }

  // Fetch a single data object under a user ID
  getUsersDocument<T>(
    collectionPath: string,
    documentKey: string,
    userId: string = this.fireAuthRepository.sessionUser?.uid || ''
  ): Observable<T> {
    const docRef = this.firestore
      .collection(USERS_COL)
      .doc(userId)
      .collection(collectionPath)
      .doc<T>(documentKey);
    return docRef.valueChanges().pipe(
      tap((data) => {
        if (!environment.production) {
          console.groupCollapsed(
            `❤️‍🔥 Firestore Streaming [${collectionPath}] [getUserDocument] [${userId}]`
          );
          console.log(data);
          console.groupEnd();
        }
      }),
      //filiering for undefined
      filter((data) => !!data),
      map((data) => data as T)
    );
  }

  getUsersDocumentAsMap(
    collectionPath: string,
    documentKey: string,
    userId: string = this.fireAuthRepository.sessionUser?.uid || ''
  ): Observable<Map<string, string>> {
    const docRef = this.firestore
      .collection(USERS_COL)
      .doc(userId)
      .collection(collectionPath)
      .doc(documentKey);
  
    return docRef.get().pipe(
      map((doc) => {
        if (doc.exists) {
          const data = doc.data() as { [key: string]: string };
          return new Map(Object.entries(data));
        } else {
          throw new Error("Document does not exist");
        }
      }),
      tap((data) => {
        if (!environment.production) {
          console.groupCollapsed(
            `❤️‍🔥 Firestore Streaming [${collectionPath}] [getUserDocumentMap] [${userId}]`
          );
          console.log(data);
          console.groupEnd();
        }
      })
    );
  }

  // Patch specific properties and objects as children of the single data object
  async updateUsersDocument<T>(
    collectionPath: string,
    documentKey: string,
    data: Partial<T>,
    userId: string = this.fireAuthRepository.sessionUser?.uid || ''
  ): Promise<void> {
    const docRef = this.firestore
      .collection(USERS_COL)
      .doc(userId)
      .collection(collectionPath)
      .doc<T>(documentKey);
    await docRef.update(data as any);
    if (!environment.production) {
      console.groupCollapsed(
        `❤️‍🔥 Firestore Service [${collectionPath}] [updateUserDocument]`
      );
      console.log(`❤️‍🔥 [${userId}]`, data);
      console.groupEnd();
    }
  }

  async updateUsersDocumentMap(
    collectionPath: string,
    documentKey: string,
    data: Map<string, string>,
    userId: string = this.fireAuthRepository.sessionUser?.uid || ''
  ): Promise<void> {
    const docRef = this.firestore
      .collection(USERS_COL)
      .doc(userId)
      .collection(collectionPath)
      .doc(documentKey);
  
    const dataObject = Object.fromEntries(data);
  
    await docRef.update(dataObject);
  
    if (!environment.production) {
      console.groupCollapsed(
        `❤️‍🔥 Firestore Service [${collectionPath}] [updateUserDocument]`
      );
      console.log(`❤️‍🔥 [${userId}]`, dataObject);
      console.groupEnd();
    }
  }
  

  // Observes a single Firestore document
  observeSpecificDocument<T>(
    collectionName: string,
    documentId: string
  ): Observable<T> {
    const document: AngularFirestoreDocument<T> = this.firestore
      .collection<T>(collectionName)
      .doc<T>(documentId);
    return document.snapshotChanges().pipe(
      map((a) => {
        const data = a.payload.data() as T;
        const id = a.payload.id;
        return { id, ...data };
      })
    );
  }

  // Observe a collection of documents
  observeSpecificCollection<T>(
    collectionPath: string,
    queryFn?: QueryFn
  ): Observable<T[]> {
    return this.firestore
      .collection<T>(collectionPath, queryFn)
      .valueChanges()
      .pipe(
        tap((data) => {
          if (!environment.production) {
            console.groupCollapsed(
              `❤️‍🔥 Firestore Streaming [${collectionPath}] [observeCollection]`
            );
            console.table(data);
            console.groupEnd();
          }
        })
      );
  }

  // Creates a new Firestore document using the full path
  createSpecificDocument<T>(collectionName: string, data: T): Promise<any> {
    const collection: AngularFirestoreCollection<T> =
      this.firestore.collection<T>(collectionName);
    return collection.add(data);
  }

  // Updates a Firestore document
  updateSpecificDocument<T>(
    collectionName: string,
    documentId: string,
    data: Partial<T>
  ): Promise<void> {
    const document: AngularFirestoreDocument<T> = this.firestore
      .collection<T>(collectionName)
      .doc<T>(documentId);
    return document.update(data);
  }
}
