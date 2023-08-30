import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchemeRoutingModule } from './scheme-routing.module';
import { SchemeListComponent } from './scheme-list/scheme-list.component';
import { SharableModule } from '../sharable/sharable.module';
import { StoreModule } from '@ngrx/store';
import { SCHEME_STATE_NAME } from 'src/app/core/store/schemeStore/scheme.state';
import { schemeReducer } from 'src/app/core/store/schemeStore/scheme.reducer';
import { EffectsModule } from '@ngrx/effects';
import { SchemeEffect } from 'src/app/core/store/schemeStore/scheme.effect';
import { SCHEME_FORM_STATE_NAME } from 'src/app/core/store/schemeFormStore/schemeform.state';
import { schemeFormReducer } from 'src/app/core/store/schemeFormStore/schemeform.reducer';
import { SchemeInfoComponent } from './scheme-info/scheme-info.component';


@NgModule({
  declarations: [
    SchemeListComponent,
    SchemeInfoComponent
  ],
  imports: [
    CommonModule,
    SchemeRoutingModule,
    SharableModule,
    StoreModule.forFeature(SCHEME_STATE_NAME, schemeReducer),
    StoreModule.forFeature(SCHEME_FORM_STATE_NAME, schemeFormReducer),
    EffectsModule.forFeature([SchemeEffect]),
  ],
  exports:[
    SchemeInfoComponent
  ]
})
export class SchemeModule { }
