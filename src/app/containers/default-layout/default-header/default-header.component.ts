import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Output() logoutEvent = new EventEmitter();
  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  constructor(
    private classToggler: ClassToggleService,
    private translate: TranslateService
  ) {
    super();
  }

  onUserLogout() {
    this.logoutEvent.emit();
  }

  onTranslationClick() {
    console.log("🚀 ~ file: dashboard.component.ts:132 ~ DashboardComponent ~ onTranslationClick ~ onTranslationClick:")
    this.toggleLanguage();
  }

  private switchLanguageToFrench() {
    this.translate.use('fr');
  }

  private switchLanguageToEnglish() {
    this.translate.use('en');
  }

  toggleLanguage() {
    if (this.getCurrentLanguage() === 'en') {
      console.log("🚀 ~ file: dashboard.component.ts:146 ~ DashboardComponent ~ toggleLanguage ~ getCurrentLanguage:", this.getCurrentLanguage)
      this.switchLanguageToFrench();
    } else if (this.getCurrentLanguage() === 'fr') {
      console.log("🚀 ~ file: dashboard.component.ts:149 ~ DashboardComponent ~ toggleLanguage ~ this.getCurrentLanguage():", this.getCurrentLanguage())
      this.switchLanguageToEnglish();
    } else {
      throw new Error('Language not supported')
    }
  }

  getCurrentLanguage() {
    console.log(this.translate.currentLang)
    return this.translate.currentLang;
  }
}
