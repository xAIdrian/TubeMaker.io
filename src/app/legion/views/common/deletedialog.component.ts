import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-deletion-dialog',
  template: `
    <h2 mat-dialog-title>{{ 'deletion_dialog.title' | translate }}</h2>
    <mat-dialog-content>
      <p>{{ 'deletion_dialog.description' | translate }}</p>
    </mat-dialog-content>
    <mat-dialog-actions style="justify-content: flex-end;">
      <button mat-button [mat-dialog-close]="false">
        {{ 'deletion_dialog.cancel' | translate }}
      </button>
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>
        {{ 'deletion_dialog.delete' | translate }}
      </button>
    </mat-dialog-actions>
  `,
})
export class DeleteDialogComponent {
  constructor(
    private translate: TranslateService,
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}
}
