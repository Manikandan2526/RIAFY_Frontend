import { Component, OnInit, Input, EventEmitter, Output, HostListener, ElementRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { DataHelper } from 'app/shared/services/data-helper.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErrorDialogService } from 'app/shared/services/error-dialog/error-dialog.service';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'date-filter',
  templateUrl: './date-filter.template.html',
})

export class DateFilterComponent implements OnInit {
  @Input() buttons: string;
  @Input() default: string;
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  @HostListener('document:click', ['$event.path'])
  public onGlobalClick(targetElementPath: Array<any>) {
    if (!this.canShowDateFilterOptions) return;
    let elementRefInPath = targetElementPath.find(e => e === this.eRef.nativeElement);
    if (!elementRefInPath) {
      let findDC = targetElementPath.find(e => (e.className === 'cdk-overlay-container'))
      if (!findDC)
        this.Close();
    }
  };

  @ViewChild('fromDate') datePickerFrom: MatDatepicker<Date>;

  //#region Delaration & Constructor

  public filterControls: FormGroup;

  public filterButtons: any = { Today: false, Tomorrow: false, Yesterday: false, Week: false, Specific: false }

  canShowDateFilterOptions: boolean = false;
  selectedDateFilterVal: string = '';
  showSpecificDate: boolean = false;
  iconFilterDate: string = "";
  dateFilterString: string = ""

  constructor(
    private dataHelper: DataHelper,
    private fb: FormBuilder,
    private errorDialogService: ErrorDialogService,
    private eRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef
  ) {

  }

  //#endregion Delaration & Constructor

  //#region Control Initialization

  ngOnInit() {

    this.filterControls = this.fb.group({
      FilterFromDate: [{ value: '', disabled: true }],
      FilterToDate: [{ value: '', disabled: true }],
    });
    this.SetFilterIcons(false);
    this.buttons.split(",").forEach(button => {
      let btnValue = button.trim();
      this.filterButtons[btnValue] = true;
      if (this.default == btnValue)
        this.SetFilterDate('btn' + this.default);
    });

  }

  //#endregion Control Initialization 

  //#region Control Events

  Close() {
    this.canShowDateFilterOptions = false;
  }

  ClearFilter() {
    this.selectedDateFilterVal = '';
    this.canShowDateFilterOptions = false;
    this.onChange.emit({ filter: "", event: "clear" });
    this.SetFilterIcons(false);
  }

  SetFilterIcons(Filter: boolean) {
    var src = Filter ? "clear" : "filter_list";
    this.iconFilterDate = src;
  }

  FilterButtonsClick() {
    if (this.canShowDateFilterOptions) {
      this.canShowDateFilterOptions = false;
      return;
    }
    this.showSpecificDate = false;
    this.canShowDateFilterOptions = true;
  }

  SetFilterDate(getSelectedButton) {
    var todayDate = new Date();
    switch (getSelectedButton) {
      case 'btnYesterday':
        this.canShowDateFilterOptions = false;
        todayDate.setDate(todayDate.getDate() - 1);
        this.selectedDateFilterVal = "Yesterday : " + this.dataHelper.DateToString(todayDate);
        this.onChange.emit({ filter: ` = "${this.dataHelper.DateFormatForBackEnd(todayDate.toString())}"`, event: "yesterday" } );
        this.SetFilterIcons(true);
        break;
      case 'btnToday':
        this.canShowDateFilterOptions = false;
        this.selectedDateFilterVal = "Today : " + this.dataHelper.DateToString(todayDate);
        this.onChange.emit({ filter: ` = "${this.dataHelper.DateFormatForBackEnd(todayDate.toString())}"`, event: "today" } );
        this.SetFilterIcons(true);
        break;
      case 'btnTomorrow':
        this.canShowDateFilterOptions = false;
        todayDate.setDate(todayDate.getDate() + 1);
        this.selectedDateFilterVal = "Tomorrow : " + this.dataHelper.DateToString(todayDate);
        this.onChange.emit({ filter: ` = "${this.dataHelper.DateFormatForBackEnd(todayDate.toString())}"`, event: "tomorrow" } );
        this.SetFilterIcons(true);
        break;
      case 'btnWeek':
        this.canShowDateFilterOptions = false;
        let weekToDate = new Date();
        todayDate.setDate(todayDate.getDate() - 7);
        var fromdate = this.dataHelper.DateToString(todayDate);
        let todate = this.dataHelper.DateToString(weekToDate);
        this.selectedDateFilterVal = fromdate + ' to ' + todate;
        this.onChange.emit({ filter: ` BETWEEN "${this.dataHelper.DateFormatForBackEnd(fromdate)}" AND "${this.dataHelper.DateFormatForBackEnd(todate)}"`, event: "week" } );
        this.SetFilterIcons(true);
        break;
      case 'btnSpecific':
        this.showSpecificDate = true;
        this.changeDetectorRef.detectChanges();
        this.filterControls.controls['FilterFromDate'].setValue('');
        this.filterControls.controls['FilterToDate'].setValue('');
        this.datePickerFrom.open();
    }
  }

  btnSpecificDateClick(btn: string) {

    if (btn == 'btnDateSpecificOk') {
      var fromdate = this.dataHelper.DateToString(this.filterControls.controls['FilterFromDate'].value);
      var todate = this.dataHelper.DateToString(this.filterControls.controls['FilterToDate'].value);
      if (fromdate == "error") {
        this.errorDialogService.errordialog({ message: `Error: From Date is invalid.` });
        return;
      }
      if (fromdate > todate || todate == "error") {
        this.errorDialogService.errordialog({ message: `Error: To Date must be greater than From Date.` });
        return;
      }
      this.selectedDateFilterVal = fromdate + ' to ' + todate;
      this.onChange.emit({ filter: ` BETWEEN "${this.dataHelper.DateFormatForBackEnd(fromdate)}" AND "${this.dataHelper.DateFormatForBackEnd(todate)}"`, event: "specific" } );
      this.SetFilterIcons(true);
    }
    this.canShowDateFilterOptions = false;
  }

  //#endregion Control Events

}