import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
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

import { Observable, from, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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
      console.log(
        '🚀 ~ LOGGEDOUT: firebaseAuth.service.ts:42 ~ AuthService ~ onAuthStateChanged ~ user:',
        user
      );
      // User is signed out
    }
  });

  constructor(private angularFireAuth: AngularFireAuth) {
    this.userObservable = this.angularFireAuth.authState
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
    return false
  }

  setUserEmail(email: string) {
    return new Promise((resolve, reject) => {
        let currentUser = this.getCurrentUser();
        if (currentUser !== null) {
            resolve(updateEmail(currentUser, email))
        } else {
            reject('no current user')
        }
    });
  }

  sendEmailVerification() {
    return new Promise((resolve, reject) => {
        let currentUser = this.getCurrentUser();
        if (currentUser !== null) {
            resolve(sendEmailVerification(currentUser))
        } else {
            reject('no current user')
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

//here's what we get from Firebase Complete Singin
/**
 * "Object
authResult":"additionalUserInfo":"GoogleAdditionalUserInfo
isNewUser":"false
profile":"email":"amohnacs@gmail.com""family_name":"Mohnacs""given_name":"Adrian""granted_scopes":"openid https://www.googleapis.com/firebaseAuth/userinfo.profile https://www.googleapis.com/firebaseAuth/userinfo.email""id":"109494647011748400470""locale":"en""name":"Adrian Mohnacs""picture":"https://lh3.googleusercontent.com/a/AGNmyxYXnCKTMb7ewkebsIT46vC4ee2Ms2kWEwnyYFm6RA=s96-c""verified_email":true[
   [
      "Prototype"
   ]
]:"Object
providerId":"google.com"[
   [
      "Prototype"
   ]
]:"GenericAdditionalUserInfo
credential":"OAuthCredential
accessToken":"ya29.a0Ael9sCPdH009WKF17jUByCLZwnTv3akgsm0mlU0gy_jJ0GCx80vTPIcYERlOViVkr5dzX4kab9ej59AH8aCBNee1jWHZCZYs0lAcm3u2BPEe8-J_cwamdPpom7pVZER7U-t7vXBHEEQAmlS98twDi-e-Ha00CQaCgYKAfYSARISFQF4udJhrzU6cVSQe54nb2QBrV5tfg0165""idToken":"eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg2OTY5YWVjMzdhNzc4MGYxODgwNzg3NzU5M2JiYmY4Y2Y1ZGU1Y2UiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNzQ3NDY3Mjc4MTI1LTN0dWE0bm1nZmZrYW1xbG9kbDJjYnQxMzVmaGtoNmk0LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNzQ3NDY3Mjc4MTI1LTN0dWE0bm1nZmZrYW1xbG9kbDJjYnQxMzVmaGtoNmk0LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA5NDk0NjQ3MDExNzQ4NDAwNDcwIiwiZW1haWwiOiJhbW9obmFjc0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IjlOYzZWdzk4dm5oT3lYS2g2d1RFOUEiLCJpYXQiOjE2ODI0NzIzMjksImV4cCI6MTY4MjQ3NTkyOX0.fqwyD9kBN5lee37wEY80NKoN_xLKzCOmxAKK5za9Qaup3bAudN1OB-ypvAGwx9zUZ3yufRI63KP_shDBZ-9XNAqMLwcHhdkhvY3u7U6HyrVSfX9ebHwYHKoligMpecJO6XDcQKXDmXbCAly2GHvEJAyttTIEKY2kHTL8ojz2aVoiNHG_FVEwbBENGQWTp5bT6mFXOPK3het1uLSYJqII7UVe5HaVbpSdYOX2Bgyl1PD3Pxm00p1orCYoNijz9luktGRDMl-mja83F2rD72m5bf4G8PjW3m1zckfe1iFug1Muv_Y-CgMurzstqyLeLDsTZWiD2l8SHz5AhhyR8nGuyw""pendingToken":"null
providerId":"google.com""signInMethod":"google.com"[
   [
      "Prototype"
   ]
]:"AuthCredential
operationType":"signIn""user":"User"{
   "_delegate":"UserImpl",
   "multiFactor":"MultiFactorUserImpl"
}[
   [
      "Prototype"
   ]
]:"Object
redirectUrl":"undefined"
 */