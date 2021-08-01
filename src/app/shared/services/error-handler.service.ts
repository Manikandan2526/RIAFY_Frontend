import { ErrorHandler, Injectable, Injector, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import * as http from 'http';
import * as url from 'url';
import 'rxjs/Rx';

//const  http = require('http');

@Injectable({
    providedIn: 'root'
})
export class ErrorHandlerService extends ErrorHandler {

    errorCount = 0;
    errorMessage = '';
    constructor(protected injector: Injector) {
        super();
    }
    // https://github.com/angular/angular/issues/17010
    handleError(error: any) {
        let increment = 5;
        let max = 50;

        // Prevents change detection
        let debugCtx = error['ngDebugContext'];
        let changeDetectorRef = debugCtx && debugCtx.injector.get(ChangeDetectorRef);
        if (changeDetectorRef) changeDetectorRef.detach();

        this.errorCount = this.errorCount + 1;
        if (this.errorCount % increment === 0) {
            console.log(' ');
            console.log(`errorHandler() was called ${this.errorCount} times.`);
            console.log(' ');
            super.handleError(error);

            if (this.errorCount === max) {
                console.log(' ');
                console.log(`Preventing recursive error after ${this.errorCount} recursive errors.`);
                console.log(' ');

                let appRef = this.injector.get(ApplicationRef);
                appRef.tick();
            }
        }
        else if (this.errorCount === 1) {
            super.handleError(error);
        }
    }
}

@Injectable({
    providedIn: 'root'
})
export class DataServiceErrorHandler {

    public handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            let message: any = '';
            if (error.message)
                message = error.message;
            if (error.status === 401)
                message = error.error.message;
            if (message.toLowerCase().indexOf("http failure response") >= 0)
                message = 'Application failed to connect data service';

            message = message + ' { at ' + error.url + ' }';
            return of(message as T);
        };
    }

    // public checkAPIAvailable(): Promise<any> {
    //     return new Promise(function (resolve, reject) {
    //         if (navigator.onLine) {

    //             fetch(environment.apiURL, { method: 'HEAD' })
    //                 .then(res => {
    //                     if (res.ok) {
    //                         console.log('exist.');
    //                         resolve("valid");
    //                     } else {
    //                         console.log('does not exist.');
    //                         reject("invalid");
    //                     }
    //                 })
    //                 .catch(err => {
    //                     console.log('error');
    //                     reject("invalid.");
    //                 })
    //         }
    //         else {
    //             console.log('offline.');
    //             reject("invalid");
    //         }
    //     })

    // }

    // public checkAPIAvailable(): Promise<any> {
    //     return new Promise(function (resolve, reject) {
    //         try {
    //             const url = new URL(environment.apiURL);

    //             var options = {
    //                 method: 'HEAD',
    //                 hostname: url.hostname, //environment.apiURL.substring(environment.apiURL.indexOf("//")+2, environment.apiURL.lastIndexOf(":")) ,
    //                 port: url.port,  //environment.apiURL.substring(environment.apiURL.lastIndexOf(":")+1),
    //                 path: '/'
    //               };
    //             var req = http.request(options, function (res) {
    //                 console.log(options, res);
    //                 resolve(res.statusCode == 200);
    //             });
    //             req.end();
    //         } catch (ex) {
    //             reject(ex);
    //         }
    //     })
    // }

}