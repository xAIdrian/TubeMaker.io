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
    if (component.isCurrentVideoPresent()) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '400px'
      });

      return dialogRef.afterClosed();
    }
    return true;
  }
}
