import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrnamentsMasterComponent } from './ornaments-master/ornaments-master.component';

const routes: Routes = [
    {path:'',redirectTo:'ornaments',pathMatch:'full'},
    {path:'ornaments-master',component:OrnamentsMasterComponent}
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class OrnamentsMasterRoutingModule {}
