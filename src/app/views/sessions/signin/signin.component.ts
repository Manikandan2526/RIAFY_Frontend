import { Component, OnInit, ViewChild, OnDestroy, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { SessionsService } from '../sessions.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDialogService } from '../../../shared/services/error-dialog/error-dialog.service';
import { CookieService } from 'ngx-cookie-service';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { MatInput } from '@angular/material/input';
import { EncrDecrService } from '../../../shared/services/encrypt-decrypt.service';
import { environment } from 'environments/environment';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit, OnDestroy {

  //#region Delaration & Constructor
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;
  @ViewChild('#inputEmail') inputEmail: MatInput;

  public getItemSub: Subscription;
  signinForm: FormGroup;
  public mainVersion;
  public greetingMsg: string = "Hi";
  public selectedLoginEmail: any = { IsValidLoginEmail: false, DisplayName: "", DisplayPicturePath: "", LoginEmail: "" }
  public displayPicturePath: string;
  public cookieLogins: any[] = [];
  public versions: any[] = [
    {
      name: 'Dark sidebar',
      photo: 'assets/images/screenshots/black_sidebar.png',
      dest: 'dashboard/blank',
      conf: `{
        "navigationPos": "side",
        "sidebarStyle": "full",
        "sidebarColor": "slate",
        "topbarColor": "white",
        "footerColor": "slate",
        "dir": "ltr",
        "useBreadcrumb": true,
        "topbarFixed": false,
        "breadcrumb": "simple",
        "matTheme": "megsoft-blue"
      }`
    }
  ]
  constructor(
    @Inject(DOCUMENT) public document: any,
    private service: SessionsService,
    private errorDialogService: ErrorDialogService,
    private cookieService: CookieService,
    private loader: AppLoaderService,
    private confirmService: AppConfirmService,
    private encrDecrService: EncrDecrService
  ) { }
  //#endregion Delaration & Constructor

  //#region Control Initialization

  ngOnInit() {
    this.mainVersion = this.versions[0];

    if (localStorage.getItem('Ref') != undefined && localStorage.getItem('Ref').length > 0) {
      this.getItemSub = this.service.ValidateToken({ token: localStorage.getItem('token')})
        .subscribe(data => {
          if (data == "valid") {
            let origin = window.location.origin;
            window.location.href = `${origin}/${this.mainVersion.dest}`
          }
        });
    }

    this.signinForm = new FormGroup({
      LoginEmail: new FormControl('', Validators.required),
      LoginPassword: new FormControl('', Validators.required)
    })

    var cookiesExist: boolean = this.cookieService.check("AppData");
    if (cookiesExist) {
      var cookies = this.encrDecrService.decrypt(this.cookieService.get("AppData"));
      this.cookieLogins = JSON.parse(cookies).LoginData;
      var lastLogin = JSON.parse(cookies).LastLogin;

      var lastLoginData = this.cookieLogins.find(item => item.LoginEmail == lastLogin);
      if (lastLoginData) {
        this.cookieLoginClick(lastLoginData);
        this.greetingMsg = "Welcome back";
      }
    }
    else {
      var appData = { LastLogin: "", LoginData: [] }
      this.cookieService.set("AppData", this.encrDecrService.encrypt(JSON.stringify(appData)), null, "/");;
    }
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe()
    }
  }

  //#endregion Control Initialization 

  //#region Control Events

  signin() {
    this.progressBar.mode = 'indeterminate';
    this.submitButton.disabled = true;

    this.signinForm.value.LoginEmail = this.selectedLoginEmail.LoginEmail;

    var LoginData = {
      LoginUserName: this.selectedLoginEmail.LoginEmail,
      LoginPassword: this.encrDecrService.encrypt(this.signinForm.value.LoginPassword)
    }


    this.getItemSub = this.service.getLoginDetail(LoginData)
      .subscribe(data => {
        if (data.Status == 'valid') {

          var defaultTheme = '{"navigationPos":"side","sidebarStyle":"full","sidebarColor":"slate","sidebarCompactToggle":false,"dir":"ltr","useBreadcrumb":true,"topbarFixed":false,"footerFixed":true,"topbarColor":"white","footerColor":"light-blue","matTheme":"megsoft-blue","breadcrumb":"simple","perfectScrollbar":true}';

          this.displayPicturePath = ""
          localStorage.setItem('Ref', data.Data.Ref);
          localStorage.setItem('DisplayPicturePath', "");
          localStorage.setItem('DisplayName', data.Data.Name);
          localStorage.setItem('theme', defaultTheme);
          localStorage.setItem('token', data.Token);
          localStorage.setItem('IsNotificationsActive', "true");
          localStorage.setItem('DefaultLanguage',"EN");
          localStorage.setItem('WarehouseId',"0");
          var cookies = this.encrDecrService.decrypt(this.cookieService.get("AppData"));
          this.cookieLogins = JSON.parse(cookies).LoginData;
          this.cookieLogins = this.cookieLogins.filter(item => item.LoginEmail !== this.selectedLoginEmail.LoginEmail);

          this.cookieLogins.push({
            IsValidLoginEmail: this.selectedLoginEmail.IsValidLoginEmail,
            DisplayName: data.Data.Name,
            LoginEmail: this.selectedLoginEmail.LoginEmail,
            DisplayPicturePath: ""
          });

          this.cookieService.delete("AppData");
          var appData = { LastLogin: this.selectedLoginEmail.LoginEmail, LoginData: this.cookieLogins }
          this.cookieService.set("AppData", this.encrDecrService.encrypt(JSON.stringify(appData)), null, "/");;

          let origin = window.location.origin;
          this.progressBar.mode = 'determinate';
          window.location.href = `${origin}/${this.mainVersion.dest}`
        }
        else if (data.Status == 'invalid') {
          this.progressBar.mode = 'determinate';
          this.submitButton.disabled = false;
          this.errorDialogService.errordialog({ message: `Login failed. Error: ` + data.Data })
        }
        else {
          this.progressBar.mode = 'determinate';
          this.submitButton.disabled = false;
          this.errorDialogService.errordialog({ message: `Unable to load data, please contact administrator. Error: ` + data })
        }
      })
  }

  validateLoginEmail() {
    this.progressBar.mode = 'indeterminate';

    let obj: any = {
      LoginUserName: this.signinForm.value.LoginEmail,
      Source: "App"
    };

    this.getItemSub = this.service.validateLoginEmail(obj)
      .subscribe(data => {
        if (data.Status == 'valid') {

          this.progressBar.mode = 'determinate';

          if (data.Data.UserNameExist) {
            this.selectedLoginEmail.LoginEmail = this.signinForm.value.LoginEmail;
            this.selectedLoginEmail.DisplayName = data.Data.Name;
            this.selectedLoginEmail.DisplayPicturePath = ""
            this.selectedLoginEmail.IsValidLoginEmail = data.Data.UserNameExist;
            this.greetingMsg = "Hi"

            setTimeout(function () { document.getElementById('txtPassword').focus(); }, 100);
            this.signinForm.controls['LoginPassword'].reset();
            this.signinForm.controls['LoginPassword'].markAsUntouched();
          }
          else {
            this.errorDialogService.errordialog({ message: `Could not find your login account. Please contact administrator.` });
          }
        }
        else if (data.Status == 'invalid') {
          this.progressBar.mode = 'determinate';
          this.errorDialogService.errordialog({ message: `Could not find your login account. Please contact administrator Error: ` + data.Data });
        }
        else {
          this.progressBar.mode = 'determinate';
          this.errorDialogService.errordialog({ message: `Unable to load data, please contact administrator. Error: ` + data })
        }
      });
  }

  openAnotherAccount() {
    this.cookieLogins = [];
    this.signinForm.controls['LoginEmail'].setValue('');
    setTimeout(function () { document.getElementById('txtEmail').focus(); }, 100);
  }

  cookieLoginClick(item) {
    this.selectedLoginEmail.DisplayPicturePath = item.DisplayPicturePath;
    this.selectedLoginEmail.IsValidLoginEmail = item.IsValidLoginEmail;
    this.selectedLoginEmail.DisplayName = item.DisplayName;
    this.selectedLoginEmail.LoginEmail = item.LoginEmail;
    this.greetingMsg = "Hi";

    this.signinForm.controls['LoginEmail'].setValue(this.selectedLoginEmail.LoginEmail);

    this.signinForm.controls['LoginPassword'].reset();
    this.signinForm.controls['LoginPassword'].markAsUntouched();
    setTimeout(function () { document.getElementById('txtPassword').focus(); }, 100);
  }

  accLoginClick() {
    this.selectedLoginEmail.IsValidLoginEmail = false;
    this.selectedLoginEmail.DisplayPicturePath = "";
    this.selectedLoginEmail.DisplayName = "";
    this.selectedLoginEmail.LoginEmail = "";

    var cookies = this.encrDecrService.decrypt(this.cookieService.get("AppData"));
    this.cookieLogins = JSON.parse(cookies).LoginData;

  }

  deleteCookieLogin(delItem) {
    this.confirmService.confirm({ message: `Delete ${delItem.LoginEmail}?` })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.cookieLogins = this.cookieLogins.filter(item => item !== delItem)

          this.cookieService.delete("AppData");
          var appData = { LastLogin: this.selectedLoginEmail.LoginEmail, LoginData: this.cookieLogins }
          this.cookieService.set("AppData", this.encrDecrService.encrypt(JSON.stringify(appData)), null, "/");;

          this.loader.close();
        }
      });
  }
  //#endregion Control Events

}
