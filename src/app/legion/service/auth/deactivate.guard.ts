import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../views/common/confirmationdialog.component';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<any> {

  constructor(private dialog: MatDialog) {}

  canDeactivate(component: any): Observable<boolean> | boolean {
    if (component.hasUnsavedChanges) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: 'It is easier than ever to make money on youtube. Have you posted your content on Youtube?  You can always come back later and make changes.'
      });

      return dialogRef.afterClosed();
    }
    return true;
  }
}
