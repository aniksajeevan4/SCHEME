import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerInformationRoutingModule } from './customer-information-routing.module';
// import { GoldLoanCustomerListComponent } from './gold-loan-customer-list/gold-loan-customer-list.component';
import { SharableModule } from '../sharable/sharable.module';
import { CustomerInformationComponents } from './customer-information/customer-information.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
    declarations: [
      CustomerInformationComponents
    ],
    imports: [
      CommonModule,
      CustomerInformationRoutingModule,
      SharableModule,
      MatDialogModule
    ]
  })
  export class CustomerInformationModule { }
