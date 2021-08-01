import { Injectable } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { ErrorDialogComponent } from './error-dialog.component';

interface confirmData {
  title?: string,
  message?: string
}

@Injectable()
export class ErrorDialogService {

  constructor(private dialog: MatDialog) { }

  public errordialog(data:confirmData = {}) {
    data.title = data.title || 'Error';
    data.message = data.message || '';
    let dialogRef: MatDialogRef<ErrorDialogComponent>;
    dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '380px',
      disableClose: true,
      data: {title: data.title, message: data.message}
    });   
  }
}