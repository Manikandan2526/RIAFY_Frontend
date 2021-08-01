import { Component, OnInit } from "@angular/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { LayoutService, ILayoutConf } from "../../../shared/services/layout.service";
import PerfectScrollbar from "perfect-scrollbar";
import { CustomizerService } from "app/shared/services/customizer.service";
import { ThemeService, ITheme } from "app/shared/services/theme.service";
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { ErrorDialogService } from 'app/shared/services/error-dialog/error-dialog.service';

@Component({
  selector: "app-customizer",
  templateUrl: "./customizer.component.html",
  styleUrls: ["./customizer.component.scss"]
})

export class CustomizerComponent implements OnInit {

  //#region Delaration & Constructor
  isCustomizerOpen: boolean = false;
  viewMode: 'options' | 'json' = 'options';

  sidenavTypes = [
    {
      name: "Default Menu",
      value: "default-menu"
    },
    {
      name: "Separator Menu",
      value: "separator-menu"
    },
    {
      name: "Icon Menu",
      value: "icon-menu"
    }
  ];
  sidebarColors: any[];
  topbarColors: any[];

  layoutConf: ILayoutConf;
  selectedMenu: string = "icon-menu";
  selectedLayout: string;
  isTopbarFixed = false;
  isFooterFixed = false;
  isRTL = false;
  egretThemes: ITheme[];
  perfectScrollbarEnabled: boolean = true;

  constructor(
    private navService: NavigationService,
    public layout: LayoutService,
    private themeService: ThemeService,
    public customizer: CustomizerService,
    private loader: AppLoaderService,
    private errorDialogService: ErrorDialogService,
    //private service: SessionsService

  ) {}
  //#endregion Delaration & Constructor

  //#region Control Initialization

    ngOnInit() {
      this.layoutConf = this.layout.layoutConf;
      this.selectedLayout = this.layoutConf.navigationPos;
      this.isTopbarFixed = this.layoutConf.topbarFixed;
      this.isRTL = this.layoutConf.dir === "rtl";
      this.egretThemes = this.themeService.egretThemes;
      this.isFooterFixed = this.layoutConf.footerFixed;
    }
    //#endregion Control Initialization 

  //#region Control Events

  changeTheme(theme) {
    //this.themeService.changeTheme(theme);
    this.layout.publishLayoutChange({matTheme: theme.name});
    
    this.customizer.changeTopbarColor(theme.topbarColor);
    this.customizer.changeSidebarColor(theme.sidebarColor);
    this.customizer.changeFooterColor(theme.footerColor);

    // Save Changes
    this.layoutConf.matTheme = theme.name;
    localStorage.setItem('theme', JSON.stringify(this.layoutConf));
   
  }

  changeLayoutStyle(data) {
    this.layout.publishLayoutChange({ sidebarCompactToggle: (data.value == "top") });
    this.layout.publishLayoutChange({ navigationPos: this.selectedLayout });

     // Save Changes
     this.layoutConf.sidebarCompactToggle = (data.value == "top");
     this.layoutConf.navigationPos = data.value;
     localStorage.setItem('theme', JSON.stringify(this.layoutConf));
     this.saveLayout();
  }

  toggleBreadcrumb(data) {
    this.layout.publishLayoutChange({ useBreadcrumb: data.checked });
    // Save Changes
    this.layoutConf.useBreadcrumb = data.checked;
    localStorage.setItem('theme', JSON.stringify(this.layoutConf));
  }

  changeBreadcrumb(data) {
    //this.layout.publishLayoutChange({ sidebarCompactToggle: (data.value == "top") });
    
     // Save Changes
     this.layoutConf.breadcrumb = data.value;
     localStorage.setItem('theme', JSON.stringify(this.layoutConf));
  }

  //not used in this project
  toggleFooterFixed(data) {
    this.layout.publishLayoutChange({ footerFixed: data.checked });
    // Save Changes
    this.layoutConf.footerFixed = data.checked;
    localStorage.setItem('theme', JSON.stringify(this.layoutConf));
  }

  //not used in this project
  changeSidenav(data) {
    this.navService.publishNavigationChange(data.value);
    
  }

  //not used in this project
  toggleTopbarFixed(data) {
    this.layout.publishLayoutChange({ topbarFixed: data.checked });
    // Save Changes
    this.layoutConf.topbarFixed = data.checked;
    localStorage.setItem('theme', JSON.stringify(this.layoutConf));
  }

  //not used in this project
  toggleDir(data) {
    let dir = data.checked ? "rtl" : "ltr";
    this.layout.publishLayoutChange({ dir: dir });
     // Save Changes
     this.layoutConf.dir = dir;
     localStorage.setItem('theme', JSON.stringify(this.layoutConf));
  }

  //not used in this project
  tooglePerfectScrollbar(data) {
    
    this.layout.publishLayoutChange({perfectScrollbar: data.checked})
     // Save Changes
     this.layoutConf.perfectScrollbar = data.checked;
     localStorage.setItem('theme', JSON.stringify(this.layoutConf));
  }
  
  saveLayout()
  { this.isCustomizerOpen = false;
    //this.loader.open(); 
   
  }
  //#endregion Control Events
  
}
