import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ErrorDialogService } from '../../../shared/services/error-dialog/error-dialog.service';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
    private errorDialogService: ErrorDialogService,
    private errorHandlerService: ErrorHandlerService,
    private http: HttpClient) { }
    
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    var pagePath: string = state.url;
    pagePath = pagePath.substring(pagePath.lastIndexOf("/") + 1, pagePath.length)
    return this.http.post<any>(environment.apiURL + '/ValidateMenuAccess', { Path: pagePath })
      .pipe(
        map(res => {
          if (res.Status == 'valid' && res.Data.IsValid) {
            return true;
          }
          else if (res.Status == 'valid' && !res.Data.IsValid) {
            this.errorHandlerService.errorMessage = "You don't have access to this page { " + pagePath + " }. Please contact Administrator.";
            this.errorDialogService.errordialog({ message: "You don't have access to this page { " + pagePath + " }. Please contact Administrator." });
            this.router.navigate(['/sessions/error']);
            return false;
          }
          else if (res.Status == 'invalid') {
            this.errorHandlerService.errorMessage = res.Data;
            this.errorDialogService.errordialog({ message: res.Data })
            this.router.navigate(['/sessions/error']);
            return false;
          }
        }),
        catchError((err) => {
          var errMsg: string;
          if (err.status === 401)
            errMsg = 'Error: Session expired, login again to continue { at services/auth/canActivate }';
          else
            errMsg = `Unable to validate access, please contact Administrator. Error: Database service offline { at services/auth/canActivate }`;

          this.errorHandlerService.errorMessage = errMsg;
          this.errorDialogService.errordialog({ message: errMsg })
          this.router.navigate(['/sessions/error']);
          return of(false);
        })
      );
  }

}