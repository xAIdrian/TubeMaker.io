import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanDeactivate } from '@angular/router';
import { stat } from 'fs';
import { Observable } from 'rxjs';
import { HomeComponent } from '../../views/home/home.component';

@Injectable({
  providedIn: 'root'
})
 export class CanNavigateForwardGuard implements CanDeactivate<HomeComponent> {

  constructor(private router: Router) {}

  canDeactivate(component: any): Observable<boolean> | boolean {
    console.log("🚀 ~ file: navforward.guard.ts:15 ~ canDeactivate ~ component:", component.clickAwayVideo)
    //if the condition is met to move them away from the page, then DO NOT deactivate guard
    if (!component.clickAwayVideo) {
      return false;
    }
    return true;
  }
}
