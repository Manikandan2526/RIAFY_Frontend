import { Routes } from "@angular/router";


import { LockscreenComponent } from "./lockscreen/lockscreen.component";
import { SigninComponent } from "./signin/signin.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { ErrorComponent } from "./error/error.component";


export const SessionsRoutes: Routes = [
  {
    path: "",
    redirectTo: 'signin', 
    pathMatch: 'full'    
  },
  {    
    path: "",
    children: [
      {
        path: "signin",
        component: SigninComponent,
        data: { title: "Signin" }
      },
     
      {
        path: "lockscreen",
        component: LockscreenComponent,
        data: { title: "Lockscreen" }
      },
      {
        path: "404",
        component: NotFoundComponent,
        data: { title: "Not Found" }
      },
      {
        path: "error",
        component: ErrorComponent,
        data: { title: "Error" }
      },
      
    ]
  }
];
