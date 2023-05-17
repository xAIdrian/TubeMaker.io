import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SessionService } from 'src/app/legion/service/auth/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './lander.component.html',
  styleUrls: ['./lander.component.scss']
})
export class LanderComponent implements OnInit {
  
  errorMessage = '';
  isLoading: false;

  constructor(
    private router: Router,
    private sessionService: SessionService
  ) { 
    this.sessionService.getErrorObserver().subscribe(error => {
      this.errorMessage = error;
    });
  }

  emailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  ngOnInit() {
    this.emailForm.valueChanges.subscribe(value => {
      // console.log('Form value changed:', value);
    });
  }

  uiShownCallback() {
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
