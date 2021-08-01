import { Component, OnInit, Input, EventEmitter, Output, HostListener, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FilterListPopupComponent } from './filterlist-popup/filterlist-popup.component';

@Component({
  selector: 'list-filter',
  templateUrl: './list-filter.template.html',
})

export class ListFilterComponent implements OnInit {

  @Input() title: string;
  @Input() default: string;
  @Input() displayField: string;
  @Input() valueField: string;
  @Input() searchField: string;
  @Input() rows: any;
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  @HostListener('document:click', ['$event.path'])
  public onGlobalClick(targetElementPath: Array<any>) {
    if (!this.canShowFilterOptions) return;
    let elementRefInPath = targetElementPath.find(e => e === this.eRef.nativeElement);
    if (!elementRefInPath) {
      let findDC = targetElementPath.find(e => (e.className === 'cdk-overlay-container'))
      if (!findDC)
        this.Close();
    }
  };

  //#region Delaration & Constructor

  filteredRows: Observable<any[]>;
  canShowFilterOptions: boolean = false;
  selectedValue: string = '';
  showSpecific: boolean = false;
  iconFilter: string = "";
  toHighlight: string = "";
  txtSpecificFilter: FormControl = new FormControl();
  returnValue: string = '';
  specificValue: string = '';


  constructor(
    private eRef: ElementRef,
    private dialog: MatDialog,
    private translate: TranslateService

  ) {
    this.selectedValue = this.default;
  }

  //#endregion Delaration & Constructor

  //#region Control Initialization

  ngOnInit() {

    this.SetFilterIcons(false);

    this.filteredRows = this.txtSpecificFilter.valueChanges
      .pipe(
        startWith(''),
        map(value => value.length >= 1 ? this._filter(value) : [])
      );

  }

  //#endregion Control Initialization 

  //#region Control Events

  Close() {
    this.canShowFilterOptions = false;
  }

  ClearFilter() {
    this.selectedValue = '';
    this.canShowFilterOptions = false;
    this.onChange.emit({ filter: "", event: "clear" });
    this.SetFilterIcons(false);
  }

  SetFilterIcons(Filter: boolean) {
    var src = Filter ? "clear" : "filter_list";
    this.iconFilter = src;
  }

  FilterButtonsClick() {
    if (this.canShowFilterOptions) {
      this.canShowFilterOptions = false;
      return;
    }
    this.showSpecific = false;
    this.canShowFilterOptions = true;
  }

  SetFilter(btn: string) {
    switch (btn) {
      case 'btnSpecific':
        this.showSpecific = !this.showSpecific;
        if (this.showSpecific) {
          this.txtSpecificFilter.setValue('');
          setTimeout(function () { document.getElementById('txtSpecificFilter').focus(); }, 100);
        }
        break;
      case 'btnList':
        this.canShowFilterOptions = false;
        this.openPopUp(this.rows, this.selectedValue);
        break;
      case 'btnAll':
        this.selectedValue = '';
        this.canShowFilterOptions = false;
        this.SetFilterIcons(false)
        this.onChange.emit({ filter: "", event: "all" });
        break;
    }
  }

  onSelection(value) {
    this.SetFilterIcons(true);
    this.selectedValue = value[this.displayField];
    this.onChange.emit({ filter: ` = ${value[this.valueField]}`, event: "specific" });
    this.canShowFilterOptions = false;
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    this.toHighlight = filterValue;
    return this.rows.filter(row => row[this.searchField].toLowerCase().indexOf(filterValue) != -1);
  }

  openPopUp(targetList, defaultSelectedListValues) {
    let heading = this.translate.instant('SELECT') + ' ' + this.title;
    let dialogRef: MatDialogRef<any> = this.dialog.open(FilterListPopupComponent, {
      width: '1000px',
      disableClose: true,
      data: {
        title: heading,
        payload: targetList,
        DefaultSelectedListValues: defaultSelectedListValues,
        searchField: this.searchField,
        displayField: this.displayField,
        valueField: this.valueField
      }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        var result = res['res'];
        if (result) {
          if (result.SelecedItems != '') {
            this.SetFilterIcons(true);
            this.selectedValue = result.SelecedItems
            if (result.SelecedItemsIds.indexOf(",") == -1)
              this.onChange.emit({ filter: ` = ${result.SelecedItemsIds}`, event: "list" });
            else
              this.onChange.emit({ filter: ` IN (${result.SelecedItemsIds})`, event: "list" });
          }
          else
          {
            this.ClearFilter();
          }
        }
      })
  }

  //#endregion Control Events

}