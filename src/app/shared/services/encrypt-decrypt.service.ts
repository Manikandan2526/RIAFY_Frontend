import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
 
export class EncrDecrService {
  constructor() { }
  //The set method is use for encrypt the value.
  encrypt(value: string){     
    if (value == '' || value == undefined ) return '';
    let content = CryptoJS.enc.Utf8.parse(value);
    
    let key = CryptoJS.enc.Utf8.parse(environment.EnDe_Key.Key);
    let iv = CryptoJS.enc.Utf8.parse(environment.EnDe_Key.IV);
    let options = {
      iv: iv
    };
    let encrypted = CryptoJS.AES.encrypt(content, key, options);
    //console.log(encrypted.toString());
    //console.log(this.decrypt(encrypted.toString()))
    return(encrypted.toString());
  }

  //The get method is use for decrypt the value.
  decrypt(value: string){
    if (value == '' || value == undefined ) return '';
    let content = value;
    let key = CryptoJS.enc.Utf8.parse(environment.EnDe_Key.Key);
    let iv = CryptoJS.enc.Utf8.parse(environment.EnDe_Key.IV);
    var options = {
      iv: iv
    };
    var result = CryptoJS.AES.decrypt(content, key, options);
    return result.toString(CryptoJS.enc.Utf8);
  }
}