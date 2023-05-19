import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SessionService } from 'src/app/legion/service/auth/session.service';
import { TranslateService } from '@ngx-translate/core';
import { NavigationService } from 'src/app/legion/service/navigation.service';

@Component({
  selector: 'app-login',
  templateUrl: './lander.component.html',
  styleUrls: ['./lander.component.scss']
})
export class LanderComponent implements OnInit {
  
  errorMessage = '';
  hasError = false;
  isLoading: false;

  constructor(
    private navigationService: NavigationService,
    private sessionService: SessionService
  ) { /** */ }


  ngOnInit() {
    this.sessionService.getErrorObserver().subscribe(error => {
      this.hasError = true;
      this.errorMessage = error;
    });
  }

  goHome() {
    console.log("🚀 ~ file: lander.component.ts:34 ~ LanderComponent ~ goHome ~ goHome:")
    this.navigationService.navigateToList();
  }

  uiShownCallback() {
    this.hasError = false;
    this.isLoading = false;
    this.errorMessage = '';
  }

  errorCallback(errorData: FirebaseUISignInFailure) {
    this.errorMessage = errorData.code;
    this.isLoading = false;
  }

  successCallback(signinSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    this.sessionService.verifyEmail(signinSuccessData)
  }
}
