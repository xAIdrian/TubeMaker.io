import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { navItems } from './_nav';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default.component.html',
})
export class DefaultComponent implements OnInit, OnDestroy {

  public navItems = navItems;
  isLoggedIn: boolean = false;
  private subscription!: Subscription;
  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };

  constructor(
    private router: Router,
    private angularFireAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.subscription = this.angularFireAuth.authState.subscribe((user) => {
      //So if the value is truthy (non-undefined/null), !! will convert it to true, and if it's falsy, it will convert it to false
      this.isLoggedIn = !!user;
    });
  }

  onLogoutEvent() {
    if (this.isLoggedIn) {
      console.log("🚀 ~ LOGGEDIN: default.component.ts:34 ~ DefaultComponent ~ onLogoutEvent ~ onLogoutEvent:")
      this.angularFireAuth.signOut()
      this.router.navigate(['']);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
