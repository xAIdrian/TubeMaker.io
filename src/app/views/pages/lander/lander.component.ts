import { AfterContentInit, Component, OnInit } from '@angular/core';
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
export class LanderComponent implements OnInit, AfterContentInit {
  
  errorMessage = '';
  hasError = false;
  isLoading: false;
  
  constructor(
    private sessionService: SessionService
    ) { /** */ }
    
    
    ngOnInit() {
      this.sessionService.getErrorObserver().subscribe(error => {
        alert(error);
      });
    }
    
    ngAfterContentInit(): void {
      this.sessionService.checkForAuthLoginRedirect();
    }
    
    goToHome() {
      this.sessionService.checkForAuthLoginRedirect();
    }

    uiShownCallback() {
    /** */
  }

  errorCallback(errorData: FirebaseUISignInFailure) {
    alert(errorData);
  }

  successCallback(signinSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    this.sessionService.verifyEmail(signinSuccessData)
  }
}
