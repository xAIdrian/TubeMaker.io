import { Injectable } from '@angular/core';
import {
  getAuth,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
} from 'firebase/auth';
import { Observable, Subject, from, map, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { FirebaseUser } from '../../model/user/user.model';
import { PURCHASED_USERS_COL, USERS_COL } from './firebase.constants';

@Injectable({
  providedIn: 'root',
})
export class FireAuthRepository {

  public sessionUser?: FirebaseUser;
  private userSubject: Subject<FirebaseUser> = new Subject<FirebaseUser>();

  private actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'https://www.example.com/finishSignUp?cartId=1234',
    // This must be true.
    handleCodeInApp: true,
    iOS: {
      bundleId: 'com.example.ios',
    },
    android: {
      packageName: 'com.example.android',
      installApp: true,
      minimumVersion: '12',
    },
    dynamicLinkDomain: 'example.page.link',
  };

  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore
  ) {
    this.angularFireAuth.authState.subscribe((user: any) => {
      console.log("🚀 ~ file: fireauth.repo.ts:52 ~ FireAuthRepository ~ this.userAuthObservable.subscribe ~ user:", user)
      if (user) {
        this.sessionUser = user;
        this.setUserData(user);
        this.userSubject.next(user);
      } else {
        this.sessionUser = undefined;
      }
    });
  }

  getUserAuthObservable(): Observable<FirebaseUser> {
    return this.userSubject.asObservable();
  }

  isAuthenticated(): Observable<boolean> {
    return of(true);
    // return of(this.sessionUser === undefined ? false : true);
  }

  verifyPurchaseEmail(email: string): Observable<boolean> {
    const docRef = this.angularFirestore.collection(PURCHASED_USERS_COL).doc(email).ref;
    return from(docRef.get()).pipe(
      map((doc) => {
        return doc.exists;
      })
    );
  }

  /* Setting up user data when sign in with username/password, 
   * sign up with username/password and sign in with social auth  
   * provider in Firestore database using AngularFirestore + AngularFirestoreDocument service 
   */
  async setUserData(user: any) {
    const existingUserRef = this.angularFirestore.doc(`${USERS_COL}/${user.uid}`);
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      isVirgin: true
    };
  
    // Check if the user document exists
    const snapshot = await existingUserRef.get().toPromise();
    if (snapshot?.exists) {
      // User exists, update the existing user data
      userData['isVirgin'] = false;
      return existingUserRef.set(this.removeUndefinedProperties(userData), { merge: true });
    } else {
      userData['isVirgin'] = true;
      // User doesn't exist, create a new user document
      return existingUserRef.set(this.removeUndefinedProperties(userData));
    }
  }
  

  // Sign out
  async signOut() {
    await this.angularFireAuth.signOut();
    localStorage.removeItem('user');
  }

  sendSignInLinkToEmail(email: string) {
    const auth = getAuth();
    sendSignInLinkToEmail(auth, email, this.actionCodeSettings)
      .then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem('emailForSignIn', email);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
      });
  }

  confirmSignInLink(email: string, windowLocationHref: string) {
    // Confirm the link is a sign-in with email link.
    const auth = getAuth();
    if (isSignInWithEmailLink(auth, windowLocationHref)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt('Please provide your email for confirmation');
      }
      // The client SDK will parse the code from the link for you.
      // signInWithEmailLink(auth, email, windowLocationHref)
      //     .then((result) => {
      //     // Clear email from storage.
      //     window.localStorage.removeItem('emailForSignIn');
      //     // You can access the new user via result.user
      //     // Additional user info profile not available via:
      //     // result.additionalUserInfo.profile == null
      //     // You can check if the user is new or existing:
      //     // result.additionalUserInfo.isNewUser
      //     })
      //     .catch((error) => {
      //     // Some error occurred, you can inspect the code: error.code
      //     // Common errors could be invalid email and invalid or expired OTPs.
      //     });
    }
  }

  async logout() {
    this.angularFireAuth.signOut();
  }

  private removeUndefinedProperties(obj: any): any {
    return JSON.parse(JSON.stringify(obj, (key, value) => {
      if (typeof value === 'undefined') {
        return undefined; // Remove the property
      }
      return value;
    }));
  }
}
