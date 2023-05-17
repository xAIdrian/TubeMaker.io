import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, createUrlTreeFromSnapshot } from '@angular/router';
import { FireAuthRepository } from '../../repository/firebase/fireauth.repo';
import { map } from 'rxjs';

export const authGuard = (next: ActivatedRouteSnapshot) => {
  return inject(FireAuthRepository).getUserAuthObservable()
    .pipe(
      map((user) => {
        if (!user) {
          console.log("🚀 ~ file: auth.guard.ts:11 ~ map ~ user:", user)
          createUrlTreeFromSnapshot(next, ['/', 'lander']);
          return false;
        } else {
          console.log("🚀 ~ file: auth.guard.ts:11 ~ map ~ user:", user)
          return true;
        }
      }
    ));
}
