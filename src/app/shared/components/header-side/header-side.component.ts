import { Component, OnInit, EventEmitter, Input, Output, Renderer2, ElementRef } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { LayoutService } from '../../services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

import { UserService } from '../../../views/user-management/user/user.service';
import { ErrorDialogService } from '../../../shared/services/error-dialog/error-dialog.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { NotificationService } from "../../services/notification.service";
import { Subscription, interval } from 'rxjs';
import { LanguageService} from '../../services/language.services';
import { WarehouseService} from '../../services/warehouse.services';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header-side',
  templateUrl: './header-side.template.html'
})
export class HeaderSideComponent implements OnInit {

  //#region Delaration & Constructor

  // notification
  @Input() notificPanel;
  @Output() onFilter: EventEmitter<any> = new EventEmitter<any>();
  notificationsubscription: Subscription;
  notificationautorefresh = interval(30000);
  notificationsCount: string;
  DefaultLanguageIndex:any;
  public IsNotificationsActive: string = localStorage.getItem('IsNotificationsActive');
  public IsEnableDisableNotification:string;
  isNotificationIconVisible = true;

  public displayPicturePath: string = localStorage.getItem('DisplayPicturePath');
  public Language:string=localStorage.getItem('DefaultLanguage');
  public availableLangs = [{
    name: 'EN',
    code: 'en',
    flag: 'flag-icon-us'
  }, {
    name: 'ES',
    code: 'es',
    flag: 'flag-icon-es'
  }]
  public warehouseList:any[]=[];
  public selectedWH:number;
  public selectedWHName:string='';
  currentLang;
  public egretThemes;
  public layoutConf: any;
  public sessionlogindata: any[];
  constructor(
    private el: ElementRef,
    private snack: MatSnackBar,
    private themeService: ThemeService,
    private layout: LayoutService,
    public translate: TranslateService,
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private service: UserService,
    private errorDialogService: ErrorDialogService,
    private notificationService: NotificationService,
    private warehouseService:WarehouseService,
    public languageService:LanguageService,
    private router : Router
    
  ) { }
  //#endregion Delaration & Constructor

  //#region Control Initialization
  ngOnInit() {
    //console.log(this.router.url);
    //this.selectedWH=Number(localStorage.getItem('WarehouseId'));
    //this.getWarehouseList();
    //this.getNotificationsCount();
    //this.notificationsubscription = this.notificationautorefresh.subscribe(val => this.getNotificationsCount());
    this.egretThemes = this.themeService.egretThemes;
    this.layoutConf = this.layout.layoutConf;
    this.DefaultLanguageIndex=this.availableLangs.findIndex(d=>d.code==this.Language);
    this.currentLang=this.availableLangs[this.DefaultLanguageIndex];
    // this.translate.use(this.currentLang.code);
    // if (this.IsNotificationsActive == 'true') 
    // { 
    //   this.isNotificationIconVisible = true 
    //   this.IsEnableDisableNotification='DISABLE NOTIFICATIONS';
    // }
    // else { this.isNotificationIconVisible = false 
    // this.IsEnableDisableNotification='ENABLE NOTIFICATIONS';
    // }
    //this.url = this.router.url;
  }

  //#endregion Control Initialization 

  //#region Control Events
  setLang(lng) {
    this.currentLang = lng;
    this.translate.use(lng.code);
    this.updateDefaultLanguage(this.currentLang);
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
        
        //this.router.navigate([this.router.url]);
        
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

  changeTheme(theme) {
    // this.themeService.changeTheme(theme);
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

  toggleCollapse() {
    // compact --> full
    if (this.layoutConf.sidebarStyle === 'compact') {
      return this.layout.publishLayoutChange({
        sidebarStyle: 'full',
        sidebarCompactToggle: false
      }, { transitionClass: true })
    }

    // * --> compact
    this.layout.publishLayoutChange({
      sidebarStyle: 'compact',
      sidebarCompactToggle: true
    }, { transitionClass: true })

  }

  onSearch(e) {
    //   console.log(e)
  }

 
  disableNotifications() {
    localStorage.setItem('IsNotificationsActive', this.IsNotificationsActive == 'true' ? 'false' : 'true')
    this.IsNotificationsActive = localStorage.getItem('IsNotificationsActive')
    this.updateNotificationStatus(this.IsNotificationsActive, 0)
    if (this.IsNotificationsActive == 'true') { this.isNotificationIconVisible = true 
    this.IsEnableDisableNotification='DISABLE NOTIFICATIONS';
    }
    else { this.isNotificationIconVisible = false 
    this.IsEnableDisableNotification='ENABLE NOTIFICATIONS';
    }
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
          console.error(data.Data);
        }
      })

  }
updateDefaultLanguage(currentLang)
{
  this.languageService.updateDefaultLanguage(currentLang)
  .subscribe(data=>{
    if(data.Status=='valid')
    {
      this.snack.open('Language Updated!', 'OK', { duration: 5000, horizontalPosition: "right" });
      localStorage.setItem('DefaultLanguage',currentLang.code);
      
    }
    else if(data.Status=='invalid')
    {
      this.errorDialogService.errordialog({ message: `Unable to Update Language. Error: ` + data.Data })
    }
    else
    {
      this.errorDialogService.errordialog({ message: `Unable to Update Language. Error: ` + data })
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