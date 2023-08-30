import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterRoutingModule } from './master-routing.module';
import { InterestDefinitionComponent } from './interest-definition/interest-definition.component';
import { InterestViewComponent } from './interest-view/interest-view.component';
import { SharableModule } from '../sharable/sharable.module';
import { ChargeMasterComponent } from './charge-definition/charge-master/charge-master.component';
import { ChargeTypeComponent } from './charge-definition/charge-type/charge-type.component';
import { masterReducer } from 'src/app/core/store/master/master.reducer';
import { SCHEME_STATE_NAME } from 'src/app/core/store/schemeStore/scheme.state';
import { schemeReducer } from 'src/app/core/store/schemeStore/scheme.reducer';
import { StoreModule } from '@ngrx/store';
import { SCHEME_FORM_STATE_NAME } from 'src/app/core/store/schemeFormStore/schemeform.state';
import { schemeFormReducer } from 'src/app/core/store/schemeFormStore/schemeform.reducer';
import { SchemeBranchLimitComponent } from './scheme-branch/scheme-branch-limit/scheme-branch-limit.component';
import { EditModalComponent } from './scheme-branch/edit-modal/edit-modal.component';
import { LimitViewComponent } from './limit-definition/limit-view/limit-view.component';
import { LimitDefinitionComponent } from './limit-definition/limit-definition/limit-definition.component';
@NgModule({
  declarations: [
    InterestDefinitionComponent,
    ChargeTypeComponent,ChargeMasterComponent,
    InterestViewComponent,
    SchemeBranchLimitComponent,
    EditModalComponent,
    LimitViewComponent,
    LimitDefinitionComponent,
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    SharableModule,
    StoreModule.forFeature('master',masterReducer),
    StoreModule.forFeature(SCHEME_STATE_NAME, schemeReducer),
    StoreModule.forFeature(SCHEME_FORM_STATE_NAME, schemeFormReducer),

  ],
  exports:[InterestViewComponent,ChargeMasterComponent,LimitViewComponent]
})
export class MasterModule { }
