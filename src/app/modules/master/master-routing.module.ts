import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChargeMasterComponent } from './charge-definition/charge-master/charge-master.component';
import { ChargeTypeComponent } from './charge-definition/charge-type/charge-type.component';
import { SchemeBranchLimitComponent } from './scheme-branch/scheme-branch-limit/scheme-branch-limit.component';
import { InterestViewComponent } from './interest-view/interest-view.component';
import { LimitViewComponent } from './limit-definition/limit-view/limit-view.component';
const routes: Routes = [
  {path:'',redirectTo:'charge-master',pathMatch:'full'},
  {path:'charge-master',component:ChargeMasterComponent},
  {path:'charge-type',component:ChargeTypeComponent},
  {path:'scheme-branch-limit',component:SchemeBranchLimitComponent},
  {path:'interest-master',component:InterestViewComponent},
  {path: 'charge-master/editTran/:mastereditTran', component: ChargeMasterComponent },
  {path: "scheme-branch-limit/editTran/:editTran", component: SchemeBranchLimitComponent},
  {path:'interest-view/editTran/:MastereditTran',component:InterestViewComponent},
  {path:'Limit-view/editTran/:MastereditTran',component:LimitViewComponent},
  {path:'interest-view',component:InterestViewComponent},
  {path:'Limit-view',component:LimitViewComponent},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule {}
