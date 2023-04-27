import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  User,
  updateProfile,
  updateEmail,
  sendEmailVerification,
  updatePassword,
  sendPasswordResetEmail,
  deleteUser,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService { 

  private app = initializeApp(environment.firebaseConfig);
  private firebaseAuth = getAuth();
  private userObservable: any;

  authObservable = onAuthStateChanged(this.firebaseAuth, (user) => {
    if (user) {
      console.log(
        '🚀 ~ LOGGEDIN: firebaseAuth.service.ts:35 ~ AuthService ~ onAuthStateChanged ~ user:',
        user
      );
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
    } else {
      console.log('firebaseAuth.service.ts:42 ~ AuthService ~ onAuthStateChanged ~ user logged out:');
      // User is signed out
    }
  });

  constructor(
    private angularFireAuth: AngularFireAuth,
    private http: HttpClient
  ) {
    this.userObservable = this.angularFireAuth.authState;
    // this.initializeGoogleAuth();
  }

  async logout() {
    this.angularFireAuth.signOut();
  }

  observeCurrentUser(): Observable<User | null> {
    return of(this.getCurrentUser());
  }

  getCurrentUser(): User | null {
    let user = this.firebaseAuth.currentUser;

    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      // The user object has basic properties such as display name, email, etc.
      const displayName = user.displayName;
      const email = user.email;
      const photoURL = user.photoURL;
      const emailVerified = user.emailVerified;

      // The user's ID, unique to the Firebase project. Do NOT use
      // this value to authenticate with your backend server, if
      // you have one. Use User.getToken() instead.
      const uid = user.uid;

      user.providerData.forEach((profile) => {
        console.log('Sign-in provider: ' + profile.providerId);
        console.log('  Provider-specific UID: ' + profile.uid);
        console.log('  Name: ' + profile.displayName);
        console.log('  Email: ' + profile.email);
        console.log('  Photo URL: ' + profile.photoURL);
      });

      return user;
    } else {
      // No user is signed in.
      return null;
    }
  }

  updateUserData(): boolean {
    let currentUser = this.getCurrentUser();
    if (currentUser !== null) {
      updateProfile(currentUser, {
        //or whatever else this is an example
        displayName: 'Jane Q. User',
        photoURL: 'https://example.com/jane-q-user/profile.jpg',
      })
        .then(() => {
          // Profile updated!
          // ...
          return true;
        })
        .catch((error) => {
          // An error occurred
          // ...
          return false;
        });
    } else {
      return false;
    }
    return false;
  }

  setUserEmail(email: string) {
    return new Promise((resolve, reject) => {
      let currentUser = this.getCurrentUser();
      if (currentUser !== null) {
        resolve(updateEmail(currentUser, email));
      } else {
        reject('no current user');
      }
    });
  }

  sendEmailVerification() {
    return new Promise((resolve, reject) => {
      let currentUser = this.getCurrentUser();
      if (currentUser !== null) {
        resolve(sendEmailVerification(currentUser));
      } else {
        reject('no current user');
      }
    });
  }
}
//   setUserPassword(newPassword: string) {
//     let currentUser = this.getCurrentUser();
//     if (currentUser !== null) {
//       return updatePassword(currentUser, newPassword);
//     }
//   }

//   sendPasswordResetEmail(email: string) {
//     let currentUser = this.getCurrentUser();
//     if (currentUser !== null) {
//       return sendPasswordResetEmail(this.firebaseAuth, email);
//     }
//   }

//   deleteUserAccount() {
//     let currentUser = this.getCurrentUser();
//     if (currentUser !== null) {
//       return deleteUser(currentUser);
//     }
//   }

//   reauthenticateWithCredentials(credential: any) {
//     let currentUser = this.getCurrentUser();
//     if (currentUser !== null) {
//       return reauthenticateWithCredential(currentUser, credential);
//     }
//   }
