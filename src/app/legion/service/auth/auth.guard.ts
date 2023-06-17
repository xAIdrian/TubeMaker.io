import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  createUrlTreeFromSnapshot,
} from '@angular/router';
import { FireAuthRepository } from '../../repository/firebase/fireauth.repo';
import { map } from 'rxjs';

export const authGuard = (next: ActivatedRouteSnapshot) => {
  const sessionUserPresent =
    inject(FireAuthRepository).sessionUser !== undefined &&
    inject(FireAuthRepository).sessionUser !== null;
  if (sessionUserPresent) {
    return true;
  } else {
    return inject(FireAuthRepository)
      .getUserAuthObservable()
      .pipe(
        map((user) => {
          if (!user) {
            inject(Router).navigate(['/lander']);
            return false;
          } else {
            return true;
          }
        })
      );
  }
};
