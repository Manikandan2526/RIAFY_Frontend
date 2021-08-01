import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { NavigationService } from "../../../shared/services/navigation.service";
import { Subscription } from "rxjs";
import PerfectScrollbar from 'perfect-scrollbar';

@Component({
  selector: 'app-sidebar-top',
  templateUrl: './sidebar-top.component.html'
})
export class SidebarTopComponent implements OnInit, OnDestroy, AfterViewInit {

  //#region Delaration & Constructor
  private sidebarPS: PerfectScrollbar;
  public menuItems: any[];
  public hasIconTypeMenuItem: boolean;
  public iconTypeMenuTitle: string;
  private menuItemsSub: Subscription;
  constructor(
    private navService: NavigationService
  ) { }
  //#endregion Delaration & Constructor

  //#region Control Initialization

  ngOnInit() {
    this.iconTypeMenuTitle = this.navService.iconTypeMenuTitle;
    this.menuItemsSub = this.navService.getMenus().subscribe(menuItem => {
      if (menuItem)
      {
        this.menuItems = menuItem.Data;
        //Checks item list has any icon type.
        this.hasIconTypeMenuItem = !!this.menuItems.filter(
          item => item.type === "icon"
        ).length;
        }
    });
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.sidebarPS = new PerfectScrollbar('#sidebar-top-scroll-area', {
        suppressScrollX: true
      })
    })
  }
  ngOnDestroy() {
    if(this.sidebarPS) {
      this.sidebarPS.destroy();
    }
    if( this.menuItemsSub ) {
      this.menuItemsSub.unsubscribe()
    }
  }

  //#endregion Control Initialization 

  //#region Control Events
  //#endregion Control Events

}
