import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { DataServiceErrorHandler } from 'app/shared/services/error-handler.service';

@Injectable()
export class SessionsService {
  constructor(
    private http: HttpClient,
    private errorHandler: DataServiceErrorHandler
  ) {

  }

  //******* Implement your APIs ********  
  getLoginDetail(item): Observable<any> {
    return this.http.post<any>(environment.apiURL + '/GetLoginDetail', item)
      .pipe(
        catchError(this.errorHandler.handleError('GetLoginDetail'))
      );
  }

  validateLoginEmail(item): Observable<any> {
    return this.http.post<any>(environment.apiURL + '/ValidateLoginUserName', item)
      .pipe(
        catchError(this.errorHandler.handleError('ValidateLoginUserName'))
      );
  }

  ////#region "Forgot/Reset Password"
  checkIsEmailExistToResetPwd(item): Observable<any> {
    return this.http.post<any>(environment.apiURL + '/CheckIsEmailExistToResetPwd', item)
      .pipe(
        catchError(this.errorHandler.handleError('checkIsEmailExistToResetPwd'))
      );
  }

  updateResetPasswordToken(item): Observable<any> {
    return this.http.put<any>(environment.apiURL + '/UpdateResetPasswordToken', item)
      .pipe(
        catchError(this.errorHandler.handleError('updateResetPasswordToken'))
      );
  }

  scheduleEmail(item): Observable<any> {
    return this.http.post<any>(environment.apiURL + '/ScheduleEmail', item)
      .pipe(
        catchError(this.errorHandler.handleError('ScheduleEmail'))
      );
  }


  validateResetPasswordToken(item): Observable<any> {
    return this.http.post<any>(environment.apiURL + '/ValidateResetPasswordToken', item)
      .pipe(
        catchError(this.errorHandler.handleError('validateResetPasswordToken'))
      );
  }

  updateResetPassword(item): Observable<any> {
    return this.http.put<any>(environment.apiURL + '/UpdateResetPassword', item)
      .pipe(
        catchError(this.errorHandler.handleError('updateResetPassword'))
      );
  }

  ValidateToken(token): Observable<any> {
    return this.http.post<any>(environment.apiURL + '/ValidateToken', token)
      .pipe(
        catchError(this.errorHandler.handleError('ValidateToken'))
      );
  }

  //////#endregion "Forgot/Reset Password"
}
