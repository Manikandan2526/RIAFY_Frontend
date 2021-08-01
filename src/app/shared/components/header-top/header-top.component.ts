import { Component, OnInit, Input, OnDestroy, Renderer2, ElementRef, EventEmitter, Output } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationService } from "../../../shared/services/navigation.service";
import { Subscription, interval } from 'rxjs';
import { ThemeService } from '../../../shared/services/theme.service';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from '../../services/layout.service';

import { UserService } from '../../../views/user-management/user/user.service';
import { ErrorDialogService } from '../../../shared/services/error-dialog/error-dialog.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { NotificationService } from "../../services/notification.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { LanguageService } from "../../services/language.services";
import { WarehouseService} from "../../services/warehouse.services";
import { Router } from '@angular/router';
@Component({
  selector: 'app-header-top',
  templateUrl: './header-top.component.html'
})

export class HeaderTopComponent implements OnInit, OnDestroy {

  //#region Delaration & Constructor
  layoutConf: any;
  menuItems: any;
  menuItemSub: Subscription;
  egretThemes: any[] = [];
  public IsEnableDisableNotification:string;
  availableLangs = [{
    name: 'EN',
    code: 'en',
    flag: 'flag-icon-us'
  }, {
    name: 'ES',
    code: 'es',
    flag: 'flag-icon-es'
  }]
  currentLang;

  // notification
  @Input() notificPanel;
  @Output() onFilter: EventEmitter<any> = new EventEmitter<any>();
  notificationsubscription: Subscription;
  notificationautorefresh = interval(30000);
  notificationsCount: string;
  public IsNotificationsActive: string = localStorage.getItem('IsNotificationsActive')
  isNotificationIconVisible = true;
  DefaultLanguageIndex: any;
  public displayPicturePath: string = localStorage.getItem('DisplayPicturePath');
  public Language: string = localStorage.getItem('DefaultLanguage');
  public warehouseList:any[]=[];
  public selectedWHName:string='';
  public selectedWH:number;
  constructor(
    private el: ElementRef,
    private layout: LayoutService,
    private navService: NavigationService,
    public themeService: ThemeService,
    public translate: TranslateService,
    private loader: AppLoaderService,
    private service: UserService,
    private dialog: MatDialog,
    private errorDialogService: ErrorDialogService,
    private notificationService: NotificationService,
    private snack: MatSnackBar,
    private languageService: LanguageService,
    private warehouseService:WarehouseService,
    private router:Router
  ) { }
  //#endregion Delaration & Constructor
  //#region Control Initialization

  ngOnInit() {
    
    this.layoutConf = this.layout.layoutConf;
    this.egretThemes = this.themeService.egretThemes;
    // this.menuItemSub = this.navService.getMenus()
    //   .subscribe(res => {
    //     if (res) {
    //       res = res.Data;
    //       res = res.filter(item => item.type !== 'icon' && item.type !== 'separator');
    //       let limit = 10
    //       let mainItems: any[] = res.slice(0, limit)
    //       if (res.length <= limit) {
    //         return this.menuItems = mainItems
    //       }
    //       let subItems: any[] = res.slice(limit, res.length - 1)
    //       mainItems.push({
    //         name: 'More',
    //         type: 'dropDown',
    //         tooltip: 'More',
    //         icon: 'more_horiz',
    //         sub: subItems
    //       })
    //       this.menuItems = mainItems
    //     }
    //   })

    
        this.DefaultLanguageIndex = this.availableLangs.findIndex(d => d.code == this.Language);
    this.currentLang = this.availableLangs[this.DefaultLanguageIndex];
    this.translate.use(this.currentLang.code);
  }
  ngOnDestroy() {
    this.menuItemSub.unsubscribe()
  }
  //#endregion Control Initialization 

  //#region Control Events

  setLang(lng) {
    this.currentLang = lng;
    this.translate.use(lng.code);
    this.updateDefaultLanguage(this.currentLang);
  }

  changeTheme(theme) {
    this.layout.publishLayoutChange({ matTheme: theme.name })
  }

  toggleNotific() {
    this.notificPanel.toggle();
    this.notificationService.getnotificationsonclick();
    this.updateNotificationStatus(this.IsNotificationsActive, 1)
  }

  toggleSidenav() {
    if (this.layoutConf.sidebarStyle === 'closed') {
      return this.layout.publishLayoutChange({
        sidebarStyle: 'full'
      })
    }
    this.layout.publishLayoutChange({
      sidebarStyle: 'closed'
    })
  }

 
  disableNotifications() {
    localStorage.setItem('IsNotificationsActive', this.IsNotificationsActive == 'true' ? 'false' : 'true')
    this.IsNotificationsActive = localStorage.getItem('IsNotificationsActive')
    this.updateNotificationStatus(this.IsNotificationsActive, 0)
    if (this.IsNotificationsActive == 'true') { this.isNotificationIconVisible = true 
    this.IsEnableDisableNotification='DISABLE NOTIFICATIONS'}
    else { this.isNotificationIconVisible = false 
      this.IsEnableDisableNotification='ENABLE NOTIFICATIONS'}
  }
  updateDefaultLanguage(currentLang) {
    this.languageService.updateDefaultLanguage(currentLang)
      .subscribe(data => {
        if (data.Status == 'valid') {
          this.snack.open('Language Updated!', 'OK', { duration: 5000, horizontalPosition: "right" });
          localStorage.setItem('DefaultLanguage', currentLang.code);
        }
        else if (data.Status == 'invalid') {
          this.errorDialogService.errordialog({ message: `Unable to Update Language. Error: ` + data.Data })
        }
        else {
          this.errorDialogService.errordialog({ message: `Unable to Update Language. Error: ` + data })
        }
      })
  }
  getNotificationsCount() {
    if (navigator.onLine) {
      let Ref = localStorage.getItem('Ref')
      if (Ref != null && this.IsNotificationsActive == 'true') {
        this.notificationService.getNotificationsCount()
          .subscribe(data => {
            if (data.Status == 'valid') {
              this.notificationsCount = data.Data;
              if (this.notificationsCount == '0') {
                this.el.nativeElement.querySelector("#NotificationToggle span span").classList.remove('mat-bg-warn');
              }
              else {
                this.el.nativeElement.querySelector("#NotificationToggle span span").classList.add('mat-bg-warn');
              }
            }
            //not doing else part on purpose
          })
      }
    }
  }

  updateNotificationStatus(notificationAlerts, notificationCount) {
    this.notificationService.updateNotificationStatus(notificationAlerts)
      .subscribe(data => {
        if (data.Status == 'valid') {
          if (notificationCount == 1) {
            this.getNotificationsCount()
          }
        }
        else if (data.Status == 'invalid') {
          console.error(data.Data);
        }
        else {
          console.error(data);
        }
      })

  }
  getWarehouseList() {

    this.warehouseService.getWarehouseList()
    .subscribe(data=>{
      if(data.Status=='valid')
      {
         this.warehouseList=data.Data;
         this.selectedWHName=this.warehouseList.find(x=>x.WarehouseId==this.selectedWH).WarehouseShortName;
         
      }
      else if(data.Status=='valid')
      {
        this.errorDialogService.errordialog({ message: `Unable to Load Data. Error: ` + data.Data })
      }
      else
      {
        this.errorDialogService.errordialog({ message: `Unable to Load Data. Error: ` + data.Data })
      }
    })

  }
  onWarehouseChange(warehouse)
  {
    //console.log(event);
    //alert(event.value);
    let obj={
      WarehouseId:warehouse.WarehouseId,
      Source:'/Warehouse'
    }
    this.warehouseService.updateWarehouseForLogin(obj)
    .subscribe(data=>{
      if(data.Status=='valid')
      {
        this.snack.open('Warehouse Updated!', 'OK', { duration: 5000, horizontalPosition: "right" });
        localStorage.setItem('WarehouseId',warehouse.WarehouseId);
        this.selectedWHName=warehouse.WarehouseShortName;
        this.selectedWH=Number(localStorage.getItem('WarehouseId'));
        if(this.router.url!='/dashboard/blank')
        {
          window.location.reload();
        }
        

       
        
      }
      else if(data.Status=='invalid')
      {
        this.errorDialogService.errordialog({ message: `Unable to Update Warehouse. Error: ` + data.Data })
      }
      else
      {
        this.errorDialogService.errordialog({ message: `Unable to Update Warehouse. Error: ` + data })
      }
    })
  }
  signOut() {
    localStorage.clear();
    let origin = window.location.origin;
    window.location.href = `${origin}/sessions/signin`
  }

  //End Region Profile 

  //#endregion Control Events

}
