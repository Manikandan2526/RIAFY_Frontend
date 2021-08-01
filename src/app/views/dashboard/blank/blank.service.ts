import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { DataServiceErrorHandler } from 'app/shared/services/error-handler.service';
import { EncrDecrService} from 'app/shared/services/encrypt-decrypt.service';
@Injectable()
export class DashboardService {
  items: any[];
  constructor(
    private http: HttpClient,
    private errorHandler: DataServiceErrorHandler,
    private encryptdecrypt:EncrDecrService
  ) {
   
  }

  GetStocks(): Observable<any> {
      return this.http.post<any>(environment.apiURL+'/GetStocks/',{})
      .pipe(
        catchError(this.errorHandler.handleError('GetStocks'))
      );    
    }

 
// End Region Profile Overview

}