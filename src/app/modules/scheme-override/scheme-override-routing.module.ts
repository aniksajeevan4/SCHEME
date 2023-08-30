import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchemeOverrideComponent } from './scheme-override/scheme-override.component';


const routes: Routes = [
  
  {path:'',redirectTo:'override',pathMatch:'full'},
  {path:'override',component:SchemeOverrideComponent},
  {path:'override/editTran/:editTran',component:SchemeOverrideComponent},

 

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchemeOverrideRoutingModule { }
