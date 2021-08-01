import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { truncate } from 'fs';

@Injectable({
  providedIn: 'root'
})

export class CustomValidators extends Validators {

  static password(required: boolean): ValidatorFn {
    return (fControl: FormControl): ValidationErrors | null => {
      const password = fControl.value;
      if (!required && password == '') return null;
      let pattern = /^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[!@#$%^&*]).{8,}$/;
      var regExp = new RegExp(pattern);
      if (!regExp.test(password))
        return { password: true };
      else
        return null;
    }
  }

  static emailid(required: boolean): ValidatorFn {
    return (fControl: FormControl): ValidationErrors | null => {
      const emailid = fControl.value;
      if (!required && emailid == '') return null;
      let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      var regExp = new RegExp(pattern);
      if (!regExp.test(emailid.toLowerCase()))
        return { emailid: true };
      else
        return null;
    }
  }

  static match(required: boolean): ValidatorFn {
    return (fControl: FormControl): ValidationErrors | null => {
      const selection = fControl.value;
      if (!required) return null;
      if (typeof selection === 'string') 
        return { match: true };
      else
        return null;
    }
  }

  static passwordandconfirmpasswordmatch(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors.passwordandconfirmpasswordmatch) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ passwordandconfirmpasswordmatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
  }

}