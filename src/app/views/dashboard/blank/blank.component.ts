import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDialogService } from '../../../shared/services/error-dialog/error-dialog.service';
import { HttpClient, HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
import { DashboardService } from './blank.service';
import { Observable } from 'rxjs';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { map, startWith } from 'rxjs/operators';

import { egretAnimations } from "../../../shared/animations/egret-animations";
import { DataHelper } from '../../../shared/services/data-helper.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { environment } from '../../../../environments/environment';

import { TranslateService } from '@ngx-translate/core';

import { CustomValidators } from "../../../shared/services/custom-validation"
@Component({
  selector: 'dashboard-blank',
  templateUrl: './blank.component.html',
  animations: egretAnimations
})
export class DashboardBlankComponent implements OnInit {

  //#region Delaration & Constructor
  public items: any[]; 
  public temp: any[];   
 // public getItemSub: Subscription;
  public url: string;
  public StockForm: FormGroup;
  public stockList: any[];
  public filteredStocks: Observable<any[]>;
  public toHighlightStock: string = '';
  public StockName: string="";
  public MarketCap: string="";
  public DividendYield: string="";
  public DebttoEquity: string="";
  public CurrentMarketPrice: string="";
  public MarROCEketCap  : string="";
  public MarkeEPStCap: string="";
  public StockPE: string="";
   public ROE  : string="";
  public Reserves: string="";
  public Debt: string="";


  public ShowDetails: boolean =false;

  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private fb: FormBuilder,
    private service: DashboardService,
    private confirmService: AppConfirmService,
    private errorDialogService: ErrorDialogService,
    private loader: AppLoaderService,
    private http: HttpClient,
   // private router: Router 
  ) { }
  //#endregion Delaration & Constructor

  //#region Control Initialization

  ngOnInit() {        
   //this.url = this.router.url;
   this.buildItemForm()
   this.loadStocks()
  }
  ngOnDestroy() {
   
  }

  //#endregion Control Initialization 

  //#region Control Events

  buildItemForm() {
    this.StockForm = this.fb.group({
      
      
      StockId: [0],
      StockName: ['', Validators.required],
      
    })
    this.StockForm.get('StockName').markAsTouched();
    

  }

  
  loadStocksInDropdown() {
 
    this.filteredStocks = this.StockForm.controls['StockName'].valueChanges
      .pipe(
        startWith(''),
        map(stock => stock.length >= 1 ? this._filterStock(stock) : [])
      );

  }

  private _filterStock(value: string): any[] {
    const filterValue = value.toLowerCase();
    this.toHighlightStock = filterValue;
    
    return this.stockList.filter(stock => stock.Name.toLowerCase().indexOf(filterValue) != -1);
  }

  refreshFilterItems() {
   
    this.filteredStocks = this.StockForm.controls['StockName'].valueChanges
      .pipe
      (
        startWith(''),
        map(ch => this._filterStock(ch))
      );

  }

  loadStocks() {
    this.service.GetStocks()
      .subscribe(data => {
        if (data.Status == 'valid') {
          this.stockList = [];
          this.stockList = data.Data;
          
        }
        else if (data.Status == 'invalid') {
          this.loader.close();
          this.errorDialogService.errordialog({ message: `Unable to load data, please contact administrator. Error: ` + data.Data })
        }
        else {
          this.loader.close();
          this.errorDialogService.errordialog({ message: `Unable to load data, please contact administrator. Error: ` + data })
        }
      }
      );
  }

  setSelectedStock(value: string) {
    this.ShowDetails =true;
    var tmpStock = this.stockList.filter(stock => stock.Name.indexOf(value) === 0);
    if (tmpStock.length > 0) {
        this.ShowDetails =true;
      this.StockName= tmpStock[0]['Name'];
      this.MarketCap= tmpStock[0]['Market_Cap'];
      this.DividendYield= tmpStock[0]['Dividend_Yield'];
      this.DebttoEquity= tmpStock[0]['Debt_to_Equity'];
      this.CurrentMarketPrice= tmpStock[0]['Current_Market_Price'];
      this.MarROCEketCap= tmpStock[0]['ROCE_'];
      this.MarkeEPStCap= tmpStock[0]['EPS'];
      this.StockPE= tmpStock[0]['Stock_PE'];
      this.ROE= tmpStock[0]['ROE_Previous_Annum'];
      this.Reserves= tmpStock[0]['Reserves'];
      this.Debt= tmpStock[0]['Debt'];
    }
    else {
        this.ShowDetails =false;
     this.StockName= "";
      this.MarketCap= "";
      this.DividendYield= "";
      this.DebttoEquity= "";
      this.CurrentMarketPrice= "";
      this.MarROCEketCap= "";
      this.MarkeEPStCap= "";
      this.StockPE= "";
      this.ROE= "";
      this.Reserves= "";
      this.Debt="";
    }
  }


  //#endregion Control Events
  
}