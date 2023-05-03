import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, createUrlTreeFromSnapshot } from '@angular/router';
import { FireAuthRepository } from '../../repository/firebase/fireauth.repo';
import { map } from 'rxjs';

export const authGuard = (next: ActivatedRouteSnapshot) => {
  return inject(FireAuthRepository)
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