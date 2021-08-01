import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'error-dialog',
  template: `<h1 matDialogTitle class="mb-05">{{ data.title }}</h1>
  <div mat-dialog-content class="mb-1" style="white-space:pre-wrap;"   >{{ data.message }}</div>
  <div mat-dialog-actions>
  <button 
  type="button" 
  mat-raised-button
  color="primary" 
  style="margin-left: 260px;"
  (click)="dialogRef.close()">OK</button> 
  </div>`,
})
export class ErrorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) {}
}