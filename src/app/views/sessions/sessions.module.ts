import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import {CookieService} from 'ngx-cookie-service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';
// import { CommonDirectivesModule } from './sdirectives/common/common-directives.module';

import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { SigninComponent } from './signin/signin.component';
import { SessionsRoutes } from "./sessions.routing";
import { NotFoundComponent } from './not-found/not-found.component';
import { ErrorComponent } from './error/error.component';
import { SessionsService} from "../sessions/sessions.service";



const components = [
  LockscreenComponent, 
  SigninComponent, 
  NotFoundComponent, 
  ErrorComponent
]
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedMaterialModule,    
    FlexLayoutModule,
    PerfectScrollbarModule,  
    ShowHidePasswordModule,  
    RouterModule.forChild(SessionsRoutes)
  ],
  declarations: [components],
  providers: [SessionsService, CookieService]  
})
export class SessionsModule { }