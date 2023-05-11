import { Injectable } from '@angular/core';
import { UserFirestore } from '../../repository/firebase/user.firestore';
import { NavigationService } from '../navigation.service';
import { Observable, Subject, catchError, of } from 'rxjs';
import { FirebaseUser } from '../../model/user/user.model';
import { FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { FireAuthRepository } from '../../repository/firebase/fireauth.repo';

const LANGUAGE_PREF = 'language'

@Injectable({
  providedIn: 'root',
})
export class SessionService {

    private errorSubject = new Subject<string>();

    constructor(
        private fireStoreRepo: UserFirestore,
        private fireAuthRepo: FireAuthRepository,
        private navService: NavigationService
    ) { /** */ }

    getErrorObserver(): Observable<string> {
        return this.errorSubject.asObservable();
    }

    storeLanguagePref(lang: string): void {
        localStorage.setItem(LANGUAGE_PREF, lang);
    }

    getLanguagePref(): string | null {
        return localStorage.getItem(LANGUAGE_PREF);
    }

    verifyEmailPurchase(signinSuccessData: FirebaseUISignInSuccessWithAuthResult) {
        const email = signinSuccessData.authResult.additionalUserInfo?.profile?['email'].toString() : '';

        if (email !== undefined && email !== '') {
            if (signinSuccessData.authResult.additionalUserInfo?.isNewUser) {
                this.verifyEmail(email);
            } else {
                this.navService.navigateToCopyCat();
            }
        } else {
            this.errorSubject.next('You are not authorized to use this application. Please contact us.');
        }
    }

    verifyEmail(email: string) {
        this.fireAuthRepo.verifyPurchaseEmail(email).subscribe({
            next: (user: FirebaseUser | undefined) => {
                if (user) {
                    this.navService.navigateToCopyCat();
                } else {
                    this.errorSubject.next('You are not authorized to use this application. Please contact us.');
                }
            },
            error: (error) => { 
                console.log(error);
              this.errorSubject.next(error);
            },
            complete: () => { 
                console.log('complete');
            }
        })
    }
}
