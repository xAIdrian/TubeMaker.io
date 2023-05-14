import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../views/dialogs/confirmationdialog.component';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<any> {

  constructor(private dialog: MatDialog) {}

  canDeactivate(component: any): Observable<boolean> | boolean {
    if (component.isCurrentVideoPresent()) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: 'It is easier than ever to make money on youtube. Have you posted your content on Youtube?  You can always come back later and make changes.'
      });

      return dialogRef.afterClosed();
    }
    return true;
  }
}
