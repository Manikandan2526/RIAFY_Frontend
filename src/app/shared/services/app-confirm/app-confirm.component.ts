import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-confirm',
  template: `<h1 matDialogTitle class="mb-05">{{ data.title }}</h1>
    <div mat-dialog-content class="mb-1" style="white-space:pre-wrap;">{{ data.message }}</div>
    <div mat-dialog-actions>
    <button style="margin-bottom: 10px;"
    type="button"
    mat-button 
    color="warn"
    (click)="dialogRef.close(false)">{{"CANCEL"|translate}}</button>
    <span fxFlex></span>
    <button style="margin-bottom: 10px;"
    type="button" 
    mat-raised-button
    color="primary" 
    (click)="dialogRef.close(true)">{{"OK"|translate}}</button>
    &nbsp;  
    </div>`,
})
export class AppComfirmComponent {
  constructor(
    public dialogRef: MatDialogRef<AppComfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) {}
}