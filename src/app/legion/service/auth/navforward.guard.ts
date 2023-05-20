import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { HomeComponent } from '../../views/home/home.component';
import { FireAuthRepository } from '../../repository/firebase/fireauth.repo';

@Injectable({
  providedIn: 'root'
})
 export class CanNavigateForwardGuard implements CanDeactivate<HomeComponent> {

  constructor(
    private authRepo: FireAuthRepository
  ) { /** */ }

  canDeactivate(component: any): Observable<boolean> | boolean {
    console.log("🚀 ~ file: navforward.guard.ts:17 ~ CanNavigateForwardGuard ~ canDeactivate ~ component:", component)
    //if the condition is met to move them away from the page, then DO NOT deactivate guard
    if (!component.clickAwayVideo && this.authRepo.isAuthenticated()) {
      return false;
    }
    return true;
  }
}
