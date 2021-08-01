import { Component, OnInit, Inject, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';

@Component({
  selector: 'app-filterlist-popup',
  templateUrl: './filterlist-popup.component.html'
})

export class FilterListPopupComponent implements OnInit, AfterViewInit {
  //#region Delaration & Constructor

  public listItems: any[];
  public SelectedItemsList: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FilterListPopupComponent>,
    private loader: AppLoaderService,
    private cdr: ChangeDetectorRef
  ) { }
  //#endregion Delaration & Constructor

  //#region Control Initialization

  ngOnInit() {
    this.generateFilterListButtons();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  generateFilterListButtons() {
    this.loader.open();
    var tmpitems = this.data.payload;
    this.listItems = [];
      tmpitems.forEach(element => {
        this.listItems.push({
          SelectedBtnId: element[this.data.valueField],
          SelectedBtnItemValue: element[this.data.displayField],
          SelectedBtnItem: element[this.data.searchField],
          Selected: false
        })
      });
    

    if (this.data.DefaultSelectedListValues || '' != '') {
      var listOfItems = (this.data.DefaultSelectedListValues || '').split(',')
      for (var i = 0; i < listOfItems.length; i++) {
        {
          let item: any = this.listItems.find(x => x.SelectedBtnItemValue === listOfItems[i]);
          if (item) {
            item.Selected = !item.Selected;
          }
        }
      }
    }
    this.SelectedItemsList = this.listItems.filter(item => item.Selected).map(x => x.SelectedBtnItemValue).join(',');
    this.listItems = this.listItems;
    this.loader.close();

  }

  //#endregion Control Initialization 

  //#region Control Events

  listBtnClick(event) {
    let selectedItemValue = event.target['id'];
    let item: any = this.listItems.find(x => x.SelectedBtnItemValue === selectedItemValue);
    if (item) {
      item.Selected = !item.Selected;
      this.SelectedItemsList = this.listItems.filter(item => item.Selected).map(x => x.SelectedBtnItemValue).join(',');
    }
  }

  submit() {
    let selectedIds = this.listItems.filter(item => item.Selected).map(x => x.SelectedBtnId).join(',');
    let selectedItems = this.listItems.filter(item => item.Selected).map(x => x.SelectedBtnItemValue).join(',');
    var data = {
      dialogclose: true,
      SelecedItems: selectedItems,
      SelecedItemsIds: selectedIds
    }
    this.dialogRef.close({ res: data });
  }

  selectAll() {
    for (var i = 0; i < this.listItems.length; i++) {
      this.listItems[i].Selected = true;
    }
    this.SelectedItemsList = this.listItems.filter(item => item.Selected).map(x => x.SelectedBtnItemValue).join(',');
  }

  selectNone() {
    for (var i = 0; i < this.listItems.length; i++) {
      this.listItems[i].Selected = false;
    }
    this.SelectedItemsList = '';
  }

  //#endregion Control Events

}