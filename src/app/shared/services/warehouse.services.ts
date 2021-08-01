import { Injectable, ErrorHandler } from '@angular/core';
import * as moment from 'moment';
import { environment } from 'environments/environment';
import { DataServiceErrorHandler } from 'app/shared/services/error-handler.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  constructor(
    private http: HttpClient,
    private errorHandler: DataServiceErrorHandler
  ) { }


  updateWarehouseForLogin(row): Observable<any> {
    return this.http.put<any>(environment.apiURL + '/UpdateWarehouseForLogin', row)
      .pipe
      (
        catchError(this.errorHandler.handleError('UpdateWarehouseForLogin'))
      )
  }
  getWarehouseList():Observable<any>{
      return this.http.post<any>(environment.apiURL+'/GetActiveWarehouses',{})
      .pipe
      (
          catchError(this.errorHandler.handleError('GetActiveWarehouses'))
      )
  }
}

