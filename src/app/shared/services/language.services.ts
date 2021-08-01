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
export class LanguageService {

  constructor(
    private http: HttpClient,
    private errorHandler: DataServiceErrorHandler
  ) { }


  updateDefaultLanguage(row): Observable<any> {
    let LanguageItems: any = {
      DefaultLanguage: row.code
    };
    return this.http.put<any>(environment.apiURL + '/UpdateDefaultLanguage', LanguageItems)
      .pipe
      (
        catchError(this.errorHandler.handleError('updateDefaultLanguage'))
      )
  }
}

