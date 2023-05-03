import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/legion/service/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './lander.component.html',
  styleUrls: ['./lander.component.scss']
})
export class LanderComponent implements OnInit{

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  emailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  ngOnInit() {
    this.emailForm.valueChanges.subscribe(value => {
      console.log('Form value changed:', value);
    });
  }

  submitForm() {
    // Use the email value to submit the form
    console.log('Submitted email:', this.emailForm.value.email);
    // Here you can send the email value to your backend API or perform any other actions
  }

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
