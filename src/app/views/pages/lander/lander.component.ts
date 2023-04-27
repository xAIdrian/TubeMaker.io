import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import  { UserAuthService } from '../../../youtubeauto/service/auth/userauth.service';

@Component({
  selector: 'app-login',
  templateUrl: './lander.component.html',
  styleUrls: ['./lander.component.scss']
})
export class LanderComponent {

  constructor(
    private router: Router,
    private authService: UserAuthService
  ) { }

  uiShownCallback() {
    console.log('UI shown');
  }

  errorCallback(errorData: FirebaseUISignInFailure) {
    console.log("🔥 ~ file: login.component.ts:18 ~ LoginComponent ~ errorCallback ~ $event:", errorData)
    
  }

  successCallback(signinSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    console.log("🚀 ~ file: login.component.ts:23 ~ LoginComponent ~ successCallback ~ signinSuccessData:", signinSuccessData)
    this.router.navigate(['dashboard']);
  }
}
