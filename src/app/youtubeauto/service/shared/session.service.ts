import { Injectable } from '@angular/core';

const LANGUAGE_PREF = 'language'

@Injectable({
  providedIn: 'root',
})
export class SessionService {

    constructor( ) { /** */ }

    storeLanguagePref(lang: string): void {
        localStorage.setItem(LANGUAGE_PREF, lang);
    }

    getLanguagePref(): string | null {
        return localStorage.getItem(LANGUAGE_PREF);
    }
}
