import { Injectable, ChangeDetectorRef } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  
export class ngx_datatable_paging_sorting {
  limit: number = 0;
  count: number = 0;
  totalPages: number = 0;
  offset: number = 0;
  cache: any = {};
  isLoading: number = 0;
  rows: any[];
  private cdr: ChangeDetectorRef
  private sort: { prop: string, dir: string };
  
  constructor() { }

  public alreadyLoaded(offset: number): Boolean {
    this.offset = offset;

    // if already loaded
    if (this.cache[offset]) {
      return true;
    }
    else {
      this.cache[offset] = true;
      this.isLoading++;
      return false;
    }
  }

  public setSort(sort: any):void {
    this.sort = sort;
    this.cache = {};
  }

  public clearCache():void {
    this.cache = {};
  }

  public refresh():void {
    this.rows = [...this.rows];
  }

  public getSort(): string {
    if (!this.sort) return "";
    return ` ORDER BY ${this.sort.prop} ${this.sort.dir} `;
  }

  public setData(data: any, totalRows: number, offset: number):void {
    this.count = totalRows;
    if (offset == 0) this.rows = new Array<any>(this.count);
    const start = offset * this.limit;
    const rows = [...this.rows];
    rows.splice(start, this.limit, ...data);
    this.rows = rows;
    this.isLoading--;
  }

}
