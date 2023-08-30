import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchwizardModule } from 'angular-archwizard';
import { SharableModule } from '../sharable/sharable.module';
import { SchemeOverrideRoutingModule } from './scheme-override-routing.module';
import { SchemeOverrideComponent } from './scheme-override/scheme-override.component';
import { OverrideDefinitionComponent } from './override-definition/override-definition.component';
import { MasterModule } from '../master/master.module';
import { SchemeFormsModule } from '../scheme-forms/scheme-forms.module';



@NgModule({
  declarations: [
    SchemeOverrideComponent,
    OverrideDefinitionComponent
  ],
  imports: [
    CommonModule,
    ArchwizardModule,
    SchemeOverrideRoutingModule,
    SharableModule,
    MasterModule,
    SchemeFormsModule
  ],
   
  
})

export class SchemeOverrideModule { 

}
