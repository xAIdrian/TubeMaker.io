import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>{{ 'confirmation_dialog.title' | translate }}</h2>
    <mat-dialog-content>
      <p>{{ 'confirmation_dialog.description' | translate }}</p>
    </mat-dialog-content>
    <mat-dialog-actions style="justify-content: flex-end;">
      <button mat-button [mat-dialog-close]="false">{{ 'confirmation_dialog.stay' | translate }}</button>
      <button mat-button [mat-dialog-close]="true" style="color: red;">{{ 'confirmation_dialog.leave' | translate }}</button>
    </mat-dialog-actions>
  `
})
export class ConfirmationDialogComponent {

  constructor(
    private translate: TranslateService,
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

}
