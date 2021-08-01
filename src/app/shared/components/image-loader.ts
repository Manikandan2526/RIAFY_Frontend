import { Component, Input, NgModule } from '@angular/core';

@Component({
  selector: 'image-loader',
  template: `<div [hidden]="!imageLoader" [style.width.px]="width" [style.height.px]="width"><mat-spinner style="top:40%; left: 40%" diameter="{{width/6}}" ></mat-spinner></div>
  <img [hidden]="imageLoader" [style.width.px]="width" (load)="this.imageLoader=false;" [src]="src"/>`
})

export class ImageLoader {
  @Input() src: string;
  @Input() width: number;

  imageLoader = true;
}