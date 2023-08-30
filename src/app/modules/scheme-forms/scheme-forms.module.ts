import { CUSTOM_ELEMENTS_SCHEMA, NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchemeFormsRoutingModule } from './scheme-forms-routing.module';
import { SharableModule } from '../sharable/sharable.module';
import { SchemeFormDetailsComponent } from './scheme-form-details/scheme-form-details.component';
import { SchemeLimitComponent } from './scheme-limit/scheme-limit.component';
import { SchemeFormContainerComponent } from './scheme-form-container/scheme-form-container.component';
import { MaterialModule } from '../material/material.module';
import { SCHEME_STATE_NAME } from 'src/app/core/store/schemeStore/scheme.state';
import { schemeReducer } from 'src/app/core/store/schemeStore/scheme.reducer';
import { MasterModule } from '../master/master.module';
import { InterestConfigurationComponent } from './interest-configuration/interest-configuration.component';
import { StoreModule } from '@ngrx/store';
import { SCHEME_FORM_STATE_NAME } from 'src/app/core/store/schemeFormStore/schemeform.state';
import { schemeFormReducer } from 'src/app/core/store/schemeFormStore/schemeform.reducer';
import { SchemeFormDocDetailsComponent } from './scheme-form-doc-details/scheme-form-doc-details.component';
import { PendingSchemeDetailsComponent } from './pending-scheme-details/pending-scheme-details.component';
import { BranchSelectionComponent } from './branch-selection/branch-selection.component';
import { SchemeFormMainDetailsComponent } from './scheme-form-main-details/scheme-form-main-details.component';
import { SchemeFormSubDetailsComponent } from './scheme-form-sub-details/scheme-form-sub-details.component';
import { SchemeFormContainer2Component } from './scheme-form-container2/scheme-form-container2.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { OfficeAccountFormComponent } from './office-account-form/office-account-form.component';
import { SchemeFormInfoComponent } from './scheme-form-info/scheme-form-info.component';
import { SchemeFormAdditionalDetailsComponent } from './scheme-Applicable-To/scheme-form-additional-details.component';
import { AdditionalDetailsComponent } from './additional-details/additional-details.component';
import { ContainerOfficeAccountComponent } from './container-office-account/container-office-account.component';
// import { AutoCapsDirective } from '../../core/validation/auto-caps.directive';
// const matFormFieldDefaultOptions: MatFormFieldDefaultOptions = {
//   hideRequiredMarker: true
// };
@NgModule({
  declarations: [
    SchemeFormContainerComponent,
    SchemeFormDetailsComponent,
    SchemeFormAdditionalDetailsComponent,
    InterestConfigurationComponent,
    SchemeFormDocDetailsComponent,
    PendingSchemeDetailsComponent,
    BranchSelectionComponent,
    SchemeFormMainDetailsComponent,
    SchemeFormSubDetailsComponent,
    SchemeFormContainer2Component,
    SchemeLimitComponent,
    OfficeAccountFormComponent,
    SchemeFormInfoComponent,
    AdditionalDetailsComponent,
    ContainerOfficeAccountComponent,
    
    // AutoCapsDirective
  ],
  imports: [
    CommonModule,
    SchemeFormsRoutingModule,
    SharableModule,
    MaterialModule,
    StoreModule.forFeature(SCHEME_STATE_NAME, schemeReducer),
    StoreModule.forFeature(SCHEME_FORM_STATE_NAME, schemeFormReducer),
    MasterModule,
    StoreModule.forFeature(SCHEME_FORM_STATE_NAME, schemeFormReducer),
  ],
  exports:[SchemeLimitComponent],
  // providers: [
  //   {
  //     provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
  //     useValue: matFormFieldDefaultOptions
  //   }
  // ]
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SchemeFormsModule {
  public getSchemeFormDetailsComponent(){
    return SchemeFormDetailsComponent;
  }

  public getSchemeFormAdditionalDetailsComponent(){
    return SchemeFormAdditionalDetailsComponent;
  }

 }
