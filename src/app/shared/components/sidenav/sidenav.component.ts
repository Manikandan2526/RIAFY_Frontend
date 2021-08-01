import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.template.html'
})
export class SidenavComponent {

  //#region Delaration & Constructor
  @Input('items') public menuItems: any[] = [];
  @Input('hasIconMenu') public hasIconTypeMenuItem: boolean;
  @Input('iconMenuTitle') public iconTypeMenuTitle: string;

  constructor() {}
  //#endregion Delaration & Constructor

  //#region Control Initialization

  ngOnInit() {}

  //#endregion Control Initialization 

  //#region Control Events

  //#endregion Control Events

}