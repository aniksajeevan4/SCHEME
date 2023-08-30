import { ContainerOfficeAccountComponent } from './modules/scheme-forms/container-office-account/container-office-account.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './modules/sharable/base/base.component';
import { ReviewComponent } from './modules/sharable/review/review.component';
import { ChargeMasterComponent } from './modules/master/charge-definition/charge-master/charge-master.component';
import { SchemeFormContainer2Component } from './modules/scheme-forms/scheme-form-container2/scheme-form-container2.component';
import { SchemeBranchLimitComponent } from './modules/master/scheme-branch/scheme-branch-limit/scheme-branch-limit.component';
import { InterestViewComponent } from './modules/master/interest-view/interest-view.component';
import { SchemeOverrideComponent } from './modules/scheme-override/scheme-override/scheme-override.component';
const routes: Routes = [
  {
    path: '', component: BaseComponent, children: [
      { path: '', redirectTo: 'scheme', pathMatch: 'full' },
      { path: 'scheme', loadChildren: () => import('./modules/scheme/scheme.module').then(scheme => scheme.SchemeModule) },
      // { path: 'goldloans', loadChildren: () => import('./modules/gold-loan/gold-loan.module').then(gl => gl.GoldLoanModule) },
      { path: 'product-master', loadChildren: () => import('./modules/product-master/product-master.module').then(prodcut => prodcut.ProductMasterModule) },
      { path: 'scheme-override', loadChildren: () => import('./modules/scheme-override/scheme-override.module').then(override => override.SchemeOverrideModule) },
      { path: 'master', loadChildren: () => import('./modules/master/master.module').then(charge => charge.MasterModule) },
      { path: 'customer', loadChildren: () => import('./modules/customer-information/customer-information.module').then(customer => customer.CustomerInformationModule) }
    ]
  },
  {
    path: 'review',
    component: ReviewComponent,
    children: [
      { path: 'scheme/viewTran/:viewTran', component: SchemeFormContainer2Component },
      { path: 'charge-master/viewTran/:masterviewTran', component: ChargeMasterComponent },
      { path: "scheme-branch-limit/viewTran/:viewTran", component: SchemeBranchLimitComponent },
      { path: "Interest-view/viewTran/:MasterviewTran", component: InterestViewComponent },
      { path: 'override/viewTran/:overRideViewTran', component: SchemeOverrideComponent },
      { path: 'OfficeAccount/viewTran/:OfficeviewTran', component: ContainerOfficeAccountComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
