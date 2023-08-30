import { InterestConfigurationComponent } from './interest-configuration/interest-configuration.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchemeFormContainerComponent } from './scheme-form-container/scheme-form-container.component';
import { SchemeLimitComponent } from './scheme-limit/scheme-limit.component';
import { SchemeFormContainer2Component } from './scheme-form-container2/scheme-form-container2.component';
import { SchemeFormDocDetailsComponent } from './scheme-form-doc-details/scheme-form-doc-details.component';
import { OfficeAccountFormComponent } from './office-account-form/office-account-form.component';
import { ContainerOfficeAccountComponent } from './container-office-account/container-office-account.component';

const routes: Routes = [
  {path:'', component:SchemeFormContainer2Component},
 {path:'OfficeAccount', component:OfficeAccountFormComponent},
  {path:'interestconfiguration',component:InterestConfigurationComponent},
  // { path: 'viewTran/:viewTran', component: SchemeFormContainerComponent },
  { path: 'editTran/:editTran', component: SchemeFormContainer2Component },
  {path:'officeAccount/editTran/:OfficeeditTran',component:ContainerOfficeAccountComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchemeFormsRoutingModule { }
