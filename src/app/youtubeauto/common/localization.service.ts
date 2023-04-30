import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
  }

  switchLanguageToFrench() {
    this.translate.use('fr');
  }

  switchLanguageToEnglish() {
    this.translate.use('en');
  }
}
