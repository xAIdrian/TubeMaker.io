import { Injectable } from '@angular/core';
import { FirestoreRepository } from '../../repository/firebase/firestore.repo';
import { NavigationService } from '../navigation.service';
import { Observable, Subject, catchError, of } from 'rxjs';
import { FirebaseUser } from '../../model/user/user.model';

const LANGUAGE_PREF = 'language'

@Injectable({
  providedIn: 'root',
})
export class SessionService {

    private errorSubject = new Subject<string>();

    constructor(
        private fireStoreRepo: FirestoreRepository,
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

    verifyPurchaseEmail(email: string) {
        this.fireStoreRepo.verifyPurchaseEmail(email).subscribe({
            next: (user: FirebaseUser | undefined) => {
                if (user) {
                    this.navService.navigateToCopyCat();
                } else {
                    this.errorSubject.next('You are not authorized to use this application. Please contact the developer.');
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
