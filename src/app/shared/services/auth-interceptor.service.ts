import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError, filter, take, switchMap } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {


  intercept(req: any, next: HttpHandler) {
    const token: string = (localStorage.getItem('token') || '');
    req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
    req = req.clone({ headers: req.headers.set('Accept', 'application/json') });
    if (req.body) req.body.Ref = localStorage.getItem('Ref');
    return next.handle(req);
  }
  // }  
}


