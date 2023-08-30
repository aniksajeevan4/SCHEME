import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from './base/base.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { ContentAnimateDirective } from 'src/app/core/content-animate/content-animate.directive';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbCollapseModule, NgbAccordionModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { CountdownModule } from 'ngx-countdown';
import { MaterialModule } from '../material/material.module';
import { NoDataComponent } from './no-data/no-data.component';
import { LoaderComponent } from './loader/loader.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReviewComponent } from './review/review.component';
import {NgxMaskModule} from 'ngx-mask';
import { StoreModule } from '@ngrx/store';
import { SCHEME_STATE_NAME } from 'src/app/core/store/schemeStore/scheme.state';
import { schemeReducer } from 'src/app/core/store/schemeStore/scheme.reducer';
import { SCHEME_FORM_STATE_NAME } from 'src/app/core/store/schemeFormStore/schemeform.state';
import { schemeFormReducer } from 'src/app/core/store/schemeFormStore/schemeform.reducer';
import { AutoCapsDirective } from '../../core/validation/auto-caps.directive';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { IndianRupeePipe } from 'src/app/core/pipes/indian-rupee/indian-rupee.pipe';
@NgModule({
  declarations: [
    AutoCapsDirective,BaseComponent, NavbarComponent, SidebarComponent, FooterComponent, ContentAnimateDirective, NoDataComponent, LoaderComponent, ReviewComponent, IndianRupeePipe],
  imports: [

    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbAccordionModule,
    NgbAlertModule,
    NgSelectModule,
    NgxPaginationModule,
    CountdownModule,
    NgxMaskModule.forRoot({
      showMaskTyped : false,
    }),
    StoreModule.forFeature(SCHEME_STATE_NAME, schemeReducer),
    StoreModule.forFeature(SCHEME_FORM_STATE_NAME, schemeFormReducer),
  ],
  exports:[
    NoDataComponent,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbAccordionModule,
    NgbCollapseModule,
    NgbAlertModule,
    NgSelectModule,
    NgxPaginationModule,
    NgxMaskModule,
    AutoCapsDirective,
    IndianRupeePipe
  ],
  providers: [
      { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    ],
})
export class SharableModule { }
