import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { DataServiceErrorHandler } from 'app/shared/services/error-handler.service';
import { EncrDecrService} from 'app/shared/services/encrypt-decrypt.service';
@Injectable()
export class UserService {
  items: any[];
  constructor(
    private http: HttpClient,
    private errorHandler: DataServiceErrorHandler,
    private encryptdecrypt:EncrDecrService
  ) {
   
  }

    //******* Implement your APIs ********
    getItems(): Observable<any> {
        return this.http.post<any>(environment.apiURL+'/GetUsers',{})
        .pipe(
        catchError(this.errorHandler.handleError('GetUsers'))
        );    
    }

    getCountries(): Observable<any> {
      return this.http.post<any>(environment.apiURL+'/GetCountriesWithName/',{})
      .pipe(
        catchError(this.errorHandler.handleError('GetCountriesWithName'))
      );    
    }

    getUserTypesForUser(userLoginId : number): Observable<any> {
      //let userLoginId = localStorage.getItem('LoginId') 
      let row:any={
        UserLoginId:userLoginId
      }
      return this.http.post<any>(environment.apiURL+'/GetUserTypesForUser/',row)
      .pipe(
        catchError(this.errorHandler.handleError('GetUserTypes'))
      );    
    }
    getWarehouseTypes(item):Observable<any>{
      let row:any={
        LoginId:item
      }
      return this.http.post<any>(environment.apiURL+'/GetWarehouseDetail',row)
      .pipe(
        catchError(this.errorHandler.handleError('getWarehouseDetail'))
      );
    }
  addUserItem(item): Observable<any> {     
    return this.http.post<any>(environment.apiURL+'/AddUser',item)
    .pipe(
      catchError(this.errorHandler.handleError('addUserItem'))
    );    
  }

  updateUserItem(item): Observable<any> {   
      return this.http.put<any>(environment.apiURL+'/UpdateUser',item)
    .pipe(
      catchError(this.errorHandler.handleError('updateUserItem'))
    );   
  }

  removeUserItem(row,url): Observable<any> {   
    row.Source = url;
    return this.http.put<any>(environment.apiURL+'/DeleteUser', row)
    .pipe(
      catchError(this.errorHandler.handleError('removeUserItem'))
    ); 
  } 

  updateUserStatus(item, url): Observable<any> {      
    item.IsActive = item.IsActive==true?false:true;
    item.Source = url;
    return this.http.put<any>(environment.apiURL+'/UpdateUserStatus',item)
  .pipe(
    catchError(this.errorHandler.handleError('updateUserStatus'))
  );   
}

UpdateUserProfile(item): Observable<any> {   
    return this.http.put<any>(environment.apiURL+'/UpdateUserProfile',item)
  .pipe(
    catchError(this.errorHandler.handleError('UploadS3FilePath'))
  );   
}

// Region Profile Overview
getUserProfile(): Observable<any> {
 let item:any={

 }
  return this.http.post<any>(environment.apiURL+'/GetProfile',item)
  .pipe(
    catchError(this.errorHandler.handleError('getUserProfile'))
  );    
}

updateProfile(item,isFromUserProfile): Observable<any> {  
  // if(isFromUserProfile) 
  // {item.Ref = localStorage.getItem('Ref')  }
  // else {
  //   item.Ref=this.encryptdecrypt.encrypt(item.UserLoginId);
  // }
item.isFromUserProfile=isFromUserProfile;
item.Re=this.encryptdecrypt.encrypt(item.UserLoginId);
  return this.http.put<any>(environment.apiURL+'/UpdateProfile',item)
  .pipe(
    catchError(this.errorHandler.handleError('updateProfile'))
  );   
}
// End Region Profile Overview

}