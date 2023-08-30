import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchemeListComponent } from './scheme-list/scheme-list.component';
import { ContainerOfficeAccountComponent } from '../scheme-forms/container-office-account/container-office-account.component';

const routes: Routes = [
  {path:'', component:SchemeListComponent},
  {path:'schemeform', loadChildren:()=>import('../scheme-forms/scheme-forms.module').then(schemeForm=>schemeForm.SchemeFormsModule)},
{path:'schemeform/officeAccount',component:ContainerOfficeAccountComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchemeRoutingModule { }
