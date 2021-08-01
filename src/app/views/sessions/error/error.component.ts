import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  //#region Delaration & Constructor
  constructor(
    public errorHandlerService: ErrorHandlerService
    ) { }
  //#endregion Delaration & Constructor

  //#region Control Initialization
  ngOnInit() {
  }
  //#endregion Control Initialization 
  
  //#region Control Events

  //#endregion Control Events

}
