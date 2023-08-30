import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductMasterRoutingModule } from './product-master-routing.module';
import { ProductMasterComponent } from './product-master/product-master.component';
import { Product1Component } from './product1/product1.component';
import { Product2Component } from './product2/product2.component';
import { SharableModule } from '../sharable/sharable.module';
import { StoreModule } from '@ngrx/store';
import { SCHEME_STATE_NAME } from 'src/app/core/store/schemeStore/scheme.state';
import { schemeReducer } from 'src/app/core/store/schemeStore/scheme.reducer';
import { schemeFormReducer } from 'src/app/core/store/schemeFormStore/schemeform.reducer';
import { SCHEME_FORM_STATE_NAME } from 'src/app/core/store/schemeFormStore/schemeform.state';


@NgModule({
  declarations: [
    ProductMasterComponent,
    Product1Component,
    Product2Component
  ],
  imports: [
    CommonModule,
    ProductMasterRoutingModule,
    SharableModule,
    StoreModule.forFeature(SCHEME_STATE_NAME, schemeReducer),
    StoreModule.forFeature(SCHEME_FORM_STATE_NAME, schemeFormReducer),
  ]
})
export class ProductMasterModule { }
