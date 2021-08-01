import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'button-loading',
  templateUrl: './button-loading.component.html',
  styleUrls: ['./button-loading.component.scss']
})

export class ButtonLoadingComponent implements OnInit {

  //#region Delaration & Constructor
  @Input('loading') loading: boolean;
  @Input('btnClass') btnClass: string;
  @Input('raised') raised: boolean = true;
  @Input('loadingText') loadingText = 'Please wait';
  @Input('type') type: 'button' | 'submit' = 'submit';
  @Input('color') color: 'primary' | 'accent' | 'warn';

  constructor() { 
  }
  //#endregion Delaration & Constructor

  //#region Control Initialization

  ngOnInit() {
  }
  //#endregion Control Initialization 

  //#region Control Events
  //#endregion Control Events

}
