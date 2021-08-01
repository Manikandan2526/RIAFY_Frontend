import { Injectable, ErrorHandler } from '@angular/core';
import * as moment from 'moment';
import { environment } from 'environments/environment';
import { DataServiceErrorHandler } from 'app/shared/services/error-handler.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataHelper {

  constructor(
    private http: HttpClient,
    private errorHandler: DataServiceErrorHandler
  ) { }


  DateFormatForBackEnd(value: string): string {
    let returnVal: string = "1900-01-01";
    if (Date.parse(value)) {
      let dateObj = new Date(value);
      returnVal = moment(dateObj).format('YYYY-MM-DD');
    }
    return returnVal;
  }

  DateTimeFormatForBackEnd(value: string): string {
    let returnVal: string = "1900-01-01 00:00:00";
    if (Date.parse(value)) {
      let dateObj = new Date(value);
      returnVal = moment(dateObj).format('YYYY-MM-DD HH:mm:ss');
    }
    return returnVal;
  }

  DateFormatForFrontEnd(value: string): Date {
    let returnVal: Date = null;
    if (Date.parse(value)) {
      let dateObj = new Date(value);
      if (moment(dateObj).format('MM/DD/YYYY') != '01/01/1900')
        returnVal = dateObj;
    }
    return returnVal;
  }

  DateTimeFormatForFrontEnd(value: string): Date {
    let returnVal: Date = null;
    if (Date.parse(value)) {
      let dateObj = new Date(value);
      if (moment(dateObj).format('MM/DD/YYYY HH:mm:ss') != '01/01/1900 00:00:00')
        returnVal = dateObj;
    }
    return returnVal;
  }

  DateToString(value: Date): string {
    let returnVal: string = '';
    if (value)
      returnVal = moment(value).format('MM/DD/YYYY');
    else
      returnVal = "error";
    return returnVal;
  }

  FormatFilter(filterValues: string[]): string {
    let returnVal: string = '';
    filterValues.forEach(filter => {
      if (filter.trim() != '') {
        returnVal += (((returnVal == '') ? '' : " AND ") + `(${filter.trim()})`);
      }
    });
    return returnVal;
  }

  async ValidateAWBNo(value: string): Promise<any> {
    let root = this;
    return new Promise(function (resolve, reject) {
      let returnVal = {
        Valid: false,
        ErrorMsg: '',
        Airline: {
          AirlineId: 0,
          AirlineName: '',
          PaymentMethod: 0
        }
      }
      let awbNo = value.replace(/\D/g, "");
      if (awbNo.length != 11) {
        returnVal.ErrorMsg = 'AWB# should be 11 characters.'
        resolve(returnVal);
      }
      else {
        root.getAirline(awbNo.substring(0, 3))
          .subscribe(data => {
            if (data.Status == 'valid') {
              let airline = data.Data;
              if (airline.AirlineId) {
                returnVal.Valid = true;
                returnVal.Airline = {
                  AirlineId: airline.AirlineId,
                  AirlineName: airline.AirlineName,
                  PaymentMethod: airline.PaymentMethod
                };
              }
            }
            else if (data.Status == 'invalid') {
              returnVal.ErrorMsg = data.Data;
            }
            else {
              returnVal.ErrorMsg = data;
            }
            resolve(returnVal);
          });
      }
    })
  }

  private getAirline(PrefixCode: string): any {
    let row: any = {
      PrefixCode: PrefixCode
    }
    return this.http.post<any>(environment.apiURL + '/GetAirlineByPrefixCode/', row)
      .pipe(
        catchError(this.errorHandler.handleError('GetAirlineByPrefixCode'))
      );
  }

}

