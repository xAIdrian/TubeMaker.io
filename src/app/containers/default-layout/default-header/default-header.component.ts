import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from 'src/app/legion/service/auth/session.service';
import { NavigationService } from 'src/app/legion/service/navigation.service';
import { DeleteDialogComponent } from '../../../legion/views/common/deletedialog.component';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {
  @Output() logoutEvent = new EventEmitter();
  @Input() sidebarId: string = 'sidebar';

  public newMessages = new Array(4);
  public newTasks = new Array(5);
  public newNotifications = new Array(5);
  profilePic: string;

  constructor(
    private translate: TranslateService,
    private sessionService: SessionService,
    private navigationService: NavigationService,
    private dialog: MatDialog
  ) {
    super();
    this.profilePic = this.sessionService.getProfilePic();
  }

  onUserLogout() {
    this.logoutEvent.emit();
  }
  onTranslationClick() {
    this.toggleLanguage();
    this.navigationService.navigateToList();
  }

  getCurrentLanguage() {
    return this.translate.currentLang;
  }
  private switchLanguageToFrench() {
    this.translate.use('fr');
  }
  private switchLanguageToEnglish() {
    this.translate.use('en');
  }

  toggleLanguage() {
    if (this.getCurrentLanguage() === 'en') {
      this.switchLanguageToFrench();
    } else if (this.getCurrentLanguage() === 'fr') {
      this.switchLanguageToEnglish();
    } else {
      throw new Error('Language not supported');
    }
  }
}
