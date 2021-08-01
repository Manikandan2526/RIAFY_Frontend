import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { ErrorDialogService } from "./error-dialog/error-dialog.service";
import { ErrorHandlerService } from "./error-handler.service";
import { Router } from "@angular/router";

interface IMenuItem {
  type: string; // Possible values: link/dropDown/icon/separator/extLink
  name?: string; // Used as display text for item and title for separator type
  state?: string; // Router state
  icon?: string; // Material icon name
  tooltip?: string; // Tooltip text
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  sub?: IChildItem[]; // Dropdown items
  badges?: IBadge[];
}
interface IChildItem {
  type?: string;
  name: string; // Display text
  state?: string; // Router state
  icon?: string;
  sub?: IChildItem[];
}

interface IBadge {
  color: string; // primary/accent/warn/hex color codes(#fff000)
  value: string; // Display text
}

@Injectable()
export class NavigationService {

  constructor(private router: Router,
    private errorDialogService: ErrorDialogService,
    private errorHandlerService: ErrorHandlerService,
    private http: HttpClient
  ) {

  }
  //******* Implement your APIs ********
  getMenus(): Observable<any> {
    let row: any = {
    };
    return this.http.post<any>(environment.apiURL + '/GetMenus/', row)
      .pipe(
        catchError((err) => {
          var errMsg: string;
          if (err.status === 401)
            errMsg = 'Error: Session expired, login again to continue { at services/navigation/GetMenus  }';
          else
            errMsg = `Unable to validate access, please contact Administrator. Error: Database service offline { at services/navigation/GetMenus  }`;

          this.errorHandlerService.errorMessage = errMsg;
          this.errorDialogService.errordialog({ message: errMsg })
          this.router.navigate(['/sessions/error']);
          return of(false);

        })
      );
  }

  iconMenu: IMenuItem[];

  separatorMenu: IMenuItem[];

  plainMenu: IMenuItem[];

  // Icon menu TITLE at the very top of navigation.
  // This title will appear if any icon type item is present in menu.
  iconTypeMenuTitle: string = "Frequently Accessed";
  // sets iconMenu as default;
  menuItems = new BehaviorSubject<IMenuItem[]>(this.iconMenu);
  // navigation component has subscribed to this Observable
  menuItems$ = this.menuItems.asObservable();

  // Customizer component uses this method to change menu.
  // You can remove this method and customizer component.
  // Or you can customize this method to supply different menu for
  // different user type.
  publishNavigationChange(menuType: string) {
    switch (menuType) {
      case "separator-menu":
        this.menuItems.next(this.separatorMenu);
        break;
      case "icon-menu":
        this.menuItems.next(this.iconMenu);
        break;
      default:
        this.menuItems.next(this.plainMenu);
    }
  }

  // private handleError<T>(operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {
  //     console.error(error);      
  //     return of(error.message as T);
  //   };
  // }
}
