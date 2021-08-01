import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-bottom-sheet-share',
  templateUrl: './bottom-sheet-share.component.html',
  styleUrls: ['./bottom-sheet-share.component.scss']
})
export class BottomSheetShareComponent implements OnInit {

  //#region Delaration & Constructor
  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetShareComponent>) { }
  //#endregion Delaration & Constructor

  //#region Control Initialization

  ngOnInit() {
  }
  //#endregion Control Initialization 

  //#region Control Events

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
  }
  //#endregion Control Events

}

