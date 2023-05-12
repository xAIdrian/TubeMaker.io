import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>Are You Sure?</h2>
    <mat-dialog-content>
      <p>{{ data }}</p>
    </mat-dialog-content>
    <mat-dialog-actions style="justify-content: flex-end;">
      <button mat-button [mat-dialog-close]="false">Stay Here</button>
      <button mat-button [mat-dialog-close]="true" style="color: red;">Leave Editing</button>
    </mat-dialog-actions>
  `
})
export class ConfirmationDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

}
