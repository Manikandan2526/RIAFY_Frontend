import { Injectable, Inject, Renderer2, RendererFactory2, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import  { getQueryParam } from '../helpers/url.helper';

export interface ITheme {
  name: string,
  topbarColor: any,
  sidebarColor: any,
  footerColor: any,
  baseColor?: string,
  isActive?: boolean
}

@Injectable()
export class ThemeService {
  public onThemeChange :EventEmitter<ITheme> = new EventEmitter();

  public egretThemes :ITheme[]  = [{
    name: "megsoft-dark-orange",
    baseColor: '#f57c00',
    topbarColor: { class: "slate" },
    sidebarColor: { class: "slate" },
    footerColor: { class: "slate" },
    isActive: false
  },{
    name: "megsoft-dark-purple",
    baseColor: "#9c27b0",
    topbarColor: { class: "slate" },
    sidebarColor: { class: "slate" },
    footerColor: { class: "slate" },
    isActive: false
  }, {
    name: "megsoft-dark-pink",
    baseColor: "#e91e63",
    topbarColor: { class: "black" },
    sidebarColor: { class: "black" },
    footerColor: { class: "black" },
    isActive: false
  },{
    name: "megsoft-dark-white",
    baseColor: "#383d40",
    topbarColor: { class: "black" },
    sidebarColor: { class: "black" },
    footerColor: { class: "black" },
    isActive: false
  }, {
    name: "megsoft-blue",
    baseColor: "#03a9f4",
    topbarColor: { class: "white" },
    sidebarColor: { class: "slate" },
    footerColor: { class: "light-blue" },
    isActive: false
  }, {
    name: "megsoft-light-purple",
    baseColor: "#7367f0",
    topbarColor: { class: "white" },
    sidebarColor: { class: "slate" },
    footerColor: { class: "light-purple" },
    isActive: false
  }, {
    name: "megsoft-navy",
    baseColor: "#10174c",
    topbarColor: { class: "white" },
    sidebarColor: { class: "slate" },
    footerColor: { class: "slate" },
    isActive: true 
  }, {
    name: "megsoft-green",
    baseColor: "#4caf50",
    topbarColor: { class: "white" },
    sidebarColor: { class: "black" },
    footerColor: { class: "green" },
    isActive: true 
  }, {
    name: "megsoft-black",
    baseColor: "#fff",
    topbarColor: { class: "white" },
    sidebarColor: { class: "white" },
    footerColor: { class: "white" },
    isActive: false 
  }];
  public activatedTheme: ITheme;
  private renderer: Renderer2;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  // Invoked in AppComponent and apply 'activatedTheme' on startup
  applyMatTheme( themeName: string) {

    this.activatedTheme = this.egretThemes.find(t => t.name === themeName); 
    
    this.flipActiveFlag(themeName);

    // *********** ONLY FOR DEMO **********
    // this.setThemeFromQuery();
    // ************************************

    this.changeTheme('megsoft-blue', themeName);
    //this.renderer.addClass(this.document.body, themeName);

  }

  changeTheme(prevTheme, themeName: string) {
    this.renderer.removeClass(this.document.body, prevTheme);
    this.renderer.addClass(this.document.body, themeName);
    this.flipActiveFlag(themeName);
    this.onThemeChange.emit(this.activatedTheme);
  }

  flipActiveFlag(themeName:string) {
    this.egretThemes.forEach((t) => {
      t.isActive = false;
      if(t.name === themeName) {
        t.isActive = true;
        this.activatedTheme = t;
      }
    });
  }

  // // *********** ONLY FOR DEMO **********
  // setThemeFromQuery() {
    
  //   let themeStr = getQueryParam('theme');
  //   try {
  //     this.activatedTheme = JSON.parse(themeStr);
      
  //     this.flipActiveFlag(this.activatedTheme.name);
  //   } catch(e) {}
  // }
}
