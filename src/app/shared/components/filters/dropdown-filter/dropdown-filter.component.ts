import { Component, OnInit, Input, EventEmitter, Output, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'dropdown-filter',
  templateUrl: './dropdown-filter.template.html',
})

export class DropdownFilterComponent implements OnInit {
  @Input() title: string;
  @Input() rows: any[];
  @Input() default: string;
  @Input() displayField: string;
  @Input() valueField: string;
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(!this.eRef.nativeElement.contains(event.target)) {
      this.Close();
    }
  };
  //#region Delaration & Constructor

  canShowFilterOptions: boolean = false;
  selectedValue: string = '';
  iconFilter: string = "";

  constructor(private eRef: ElementRef
  ) {

  }

  //#endregion Delaration & Constructor

  //#region Control Initialization

  ngOnInit() {
   
    this.SetFilterIcons(false);

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
    this.canShowFilterOptions = true;
  }

  onOptionChange(row) {
    this.selectedValue = row[this.displayField];
    this.onChange.emit({ filter: `= "${row[this.valueField]}"`, event: "change" });
    this.SetFilterIcons(true);
    this.canShowFilterOptions = false;
  }

  //#endregion Control Events

}