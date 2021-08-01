import { Injectable, ReflectiveInjector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { DataServiceErrorHandler } from 'app/shared/services/error-handler.service';

@Injectable()
export class NotificationService {
  items: any[];
  private _getnotifications = new Subject<any>();
  notificationlisten(): Observable<any> {
    return this._getnotifications.asObservable();
  }

  getnotificationsonclick() {
    this._getnotifications.next();
  }

  constructor(
    private http: HttpClient,
    private errorHandler: DataServiceErrorHandler
  ) {

  }
  //******* Implement your APIs ********
  getNotificationsCount(): Observable<any> {
    let item:any={

    }
    return this.http.post<any>(environment.apiURL + '/GetNotificationsCount/',item)
      .pipe(
        catchError(this.errorHandler.handleError('getNotificationsCount'))
      );
  }

  getNotifications(): Observable<any> {
    let item:any={

    }
    return this.http.post<any>(environment.apiURL + '/GetNotifications/',item)
      .pipe(
        catchError(this.errorHandler.handleError('getNotifications'))
      );
  }

  clearNotifications(): Observable<any> {
    let Ref: any = {
    };
    return this.http.put<any>(environment.apiURL + '/ClearNotifications', Ref)
      .pipe(
        catchError(this.errorHandler.handleError('clearNotifications'))
      );
  }

  updateNotificationStatus(row): Observable<any> {
    let NotificationItems: any = {
      NotificationAlert: JSON.parse(row)
    };
    return this.http.put<any>(environment.apiURL + '/UpdateNotificationStatus', NotificationItems)
      .pipe(
        catchError(this.errorHandler.handleError('updateNotificationStatus'))
      );
  }
}