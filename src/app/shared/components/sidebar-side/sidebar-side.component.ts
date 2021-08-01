import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { ThemeService } from "../../services/theme.service";
import { Subscription } from "rxjs";
import { ILayoutConf, LayoutService } from "app/shared/services/layout.service";

@Component({
  selector: "app-sidebar-side",
  templateUrl: "./sidebar-side.component.html"
})
export class SidebarSideComponent implements OnInit, OnDestroy, AfterViewInit {

  //#region Delaration & Constructor
  public menuItems: any[];
  public hasIconTypeMenuItem: boolean;
  public iconTypeMenuTitle: string;
  private menuItemsSub: Subscription;
  public layoutConf: ILayoutConf;

  constructor(
    private navService: NavigationService,
    public themeService: ThemeService,
    private layout: LayoutService
  ) {}
  //#endregion Delaration & Constructor

  //#region Control Initialization

  ngOnInit() {
    this.iconTypeMenuTitle = this.navService.iconTypeMenuTitle;
    // this.menuItemsSub = this.navService.getMenus().subscribe(menuItem => {
    //   if (menuItem)
    //   {
    //     this.menuItems = menuItem.Data;
    //     //Checks item list has any icon type.
    //     this.hasIconTypeMenuItem = !!this.menuItems.filter(
    //       item => item.type === "icon"
    //     ).length;
    //     }
    // });
    this.layoutConf = this.layout.layoutConf;
  }
  ngAfterViewInit() {}
  ngOnDestroy() {
    if (this.menuItemsSub) {
      this.menuItemsSub.unsubscribe();
    }
  }
  //#endregion Control Initialization 

  //#region Control Events

  toggleCollapse() {
    if (
      this.layoutConf.sidebarCompactToggle
    ) {
        this.layout.publishLayoutChange({
        sidebarCompactToggle: false
      });
    } else {
        this.layout.publishLayoutChange({
            // sidebarStyle: "compact",
            sidebarCompactToggle: true
          });
    }
  }

  //#endregion Control Events

}
