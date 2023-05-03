import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, createUrlTreeFromSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs';

export const authGuard = (next: ActivatedRouteSnapshot) => {
  return inject(AuthService)
    .isAuthenticated()
    .pipe(
      map((isAuthenticated) => {
        if (!isAuthenticated) {
          createUrlTreeFromSnapshot(next, ['/', 'lander']);
          return false;
        } else {
          return true;
        }
      }
    ));
}