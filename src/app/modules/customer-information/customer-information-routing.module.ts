import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerInformationComponents } from './customer-information/customer-information.component';

const routes: Routes = [
    { path: '', component: CustomerInformationComponents },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerInformationRoutingModule { }
