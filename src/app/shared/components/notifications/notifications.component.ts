import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, NavigationEnd } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit {

  //#region Delaration & Constructor
  @Input() notificPanel;

  isLoading = true;
  divHeight = window.innerHeight - 100;

  public notifications: any[];
  constructor(
    private service: NotificationService,
    private router: Router,
  ) {
    this.service.notificationlisten().subscribe((m: any) => {
      this.GetNotifications();
    })
  }
  //#endregion Delaration & Constructor

  //#region Control Initialization

  ngOnInit() {
    this.router.events.subscribe((routeChange) => {
      if (routeChange instanceof NavigationEnd) {
        this.notificPanel.close();
      }
    });
  }

  GetNotifications() {
    this.service.getNotifications()
      .subscribe(data => {
        if (data.Status == 'valid') {
          this.notifications = [];
          this.notifications = data.Data;
        }
        else if (data.Status == 'invalid') {
          this.notifications = [];
        }
        else {
          this.notifications = [];
        }
        this.isLoading = false;
      })
  }
  //#endregion Control Initialization 

  //#region Control Events

  clearAll(e) {
    e.preventDefault();
    this.ClearNotifications()
  }

  // NotificationRead(n) {
  //   n.BackgroundColour = "white";
  // }

  ClearNotifications() {
    this.service.clearNotifications()
      .subscribe(data => {
        if (data.Status == 'valid') {
          this.notifications = [];
        }
        else if (data.Status == 'invalid') {
          console.log(data.Data)
        }
        else {
          console.log(data.Data)
        }
      })
  }
  //#endregion Control Events  
}
