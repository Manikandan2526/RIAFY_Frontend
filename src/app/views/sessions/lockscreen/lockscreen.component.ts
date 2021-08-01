import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-lockscreen',
  templateUrl: './lockscreen.component.html',
  styleUrls: ['./lockscreen.component.css']
})
export class LockscreenComponent implements OnInit {

  //#region Delaration & Constructor
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;

  lockscreenData = {
    password: ''
  }

  constructor() { }
  //#endregion Delaration & Constructor

  //#region Control Initialization
  ngOnInit() {
  }
  //#endregion Control Initialization 

  //#region Control Events
  unlock() {
    console.log(this.lockscreenData);

    this.submitButton.disabled = true;
    this.progressBar.mode = 'indeterminate';
  }
  //#endregion Control Events
}
