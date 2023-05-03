import { Injectable } from '@angular/core';
import {
  getAuth,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root',
})
export class FireAuthRepository {
  private userAuthObservable: any;

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
    private angularFireAuth: AngularFireAuth
  ) {
    this.userAuthObservable = this.angularFireAuth.authState;
  }

  isAuthenticated(): Observable<boolean> {
    return of(true);
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
}
