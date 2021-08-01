import { Injectable } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";
import { catchError } from 'rxjs/operators';
import { LayoutService } from "./layout.service";
import { Observable, of } from 'rxjs';
import { environment } from "environments/environment";
import { HttpClient } from "@angular/common/http";
import { DataServiceErrorHandler } from "./error-handler.service";

@Injectable({
  providedIn: "root"
})
export class CustomizerService {


  colors = [
    {
      class: "black",
      active: false
    },
    {
      class: "white",
      active: false
    },
    {
      class: "dark-blue",
      active: false
    },
    {
      class: "grey",
      active: false
    },
    {
      class: "brown",
      active: false
    },
    {
      class: "gray",
      active: false
    },
    {
      class: "purple",
      active: false
    },
    {
      class: "blue",
      active: false
    },

    {
      class: "indigo",
      active: false
    },
    {
      class: "yellow",
      active: false
    },
    {
      class: "green",
      active: false
    },
    {
      class: "pink",
      active: false
    },
    {
      class: "red",
      active: false
    },
    {
      class: "slate",
      active: false
    },
    {
      class: "light-blue",
      active: false
    },
    {
      class: "light-purple",
      active: false
    },
  ];

  topbarColors: any[];
  sidebarColors: any[];
  footerColors: any[];

  constructor(
    private router: Router,
    private layout: LayoutService,
    private http: HttpClient,
    private errorHandler: DataServiceErrorHandler
  ) {
    this.topbarColors = this.getTopbarColors();
    this.sidebarColors = this.getSidebarColors();
    this.footerColors = this.getFooterColors();
  }

  getSidebarColors() {
    let sidebarColors = ['black', 'slate', 'white', 'dark-gray', 'purple', 'dark-blue', 'indigo', 'pink', 'red', 'yellow', 'green', "light-blue"];
    return this.colors.filter(color => {
      return sidebarColors.includes(color.class);
    })
      .map(c => {
        c.active = c.class === this.layout.layoutConf.sidebarColor;
        return { ...c };
      });
  }

  getTopbarColors() {
    let topbarColors = ['black', 'slate', 'white', 'dark-gray', 'purple', 'dark-blue', 'indigo', 'pink', 'red', 'yellow', 'green', "light-blue"];
    return this.colors.filter(color => {
      return topbarColors.includes(color.class);
    })
      .map(c => {
        c.active = c.class === this.layout.layoutConf.topbarColor;
        return { ...c };
      });
  }

  getFooterColors() {
    let footerColors = ['black', 'slate', 'white', 'dark-gray', 'purple', 'dark-blue', 'indigo', 'pink', 'red', 'yellow', 'green', "light-blue"];
    return this.colors.filter(color => {
      return footerColors.includes(color.class);
    })
      .map(c => {
        c.active = c.class === this.layout.layoutConf.footerColor;
        return { ...c };
      });
  }


  changeSidebarColor(color) {
    this.layout.publishLayoutChange({ sidebarColor: color.class });
    this.sidebarColors = this.getSidebarColors();

    //save changes
    this.layout.layoutConf.sidebarColor = color.class;
    localStorage.setItem('theme', JSON.stringify(this.layout.layoutConf));

  }

  changeTopbarColor(color) {
    this.layout.publishLayoutChange({ topbarColor: color.class });
    this.topbarColors = this.getTopbarColors();

    //save changes
    this.layout.layoutConf.topbarColor = color.class;
    localStorage.setItem('theme', JSON.stringify(this.layout.layoutConf));
  }

  changeFooterColor(color) {
    this.layout.publishLayoutChange({ footerColor: color.class });
    this.footerColors = this.getFooterColors();

    //save changes
    this.layout.layoutConf.footerColor = color.class;
    localStorage.setItem('theme', JSON.stringify(this.layout.layoutConf));

  }

  removeClass(el, className) {
    if (!el || el.length === 0) return;
    if (!el.length) {
      el.classList.remove(className);
    } else {
      for (var i = 0; i < el.length; i++) {
        el[i].classList.remove(className);
      }
    }
  }

  addClass(el, className) {
    if (!el) return;
    if (!el.length) {
      el.classList.add(className);
    } else {
      for (var i = 0; i < el.length; i++) {
        el[i].classList.add(className);
      }
    }
  }

  findClosest(el, className) {
    if (!el) return;
    while (el) {
      var parent = el.parentElement;
      if (parent && this.hasClass(parent, className)) {
        return parent;
      }
      el = parent;
    }
  }

  hasClass(el, className) {
    if (!el) return;
    return (
      ` ${el.className} `.replace(/[\n\t]/g, " ").indexOf(` ${className} `) > -1
    );
  }

  toggleClass(el, className) {
    if (!el) return;
    if (this.hasClass(el, className)) {
      this.removeClass(el, className);
    } else {
      this.addClass(el, className);
    }
  }

  updateTheme(): Observable<any> {
    var item = { Theme: localStorage.getItem('theme') };
    return this.http.put<any>(environment.apiURL + '/UpdateTheme', item)
      .pipe(
        catchError(this.errorHandler.handleError('updateUserStatus'))
      );
  }

}