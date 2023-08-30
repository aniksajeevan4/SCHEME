import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrnamentsMasterComponent } from './ornaments-master/ornaments-master.component';
import { SharableModule } from '../sharable/sharable.module';
import { OrnamentsMasterRoutingModule } from './ornaments-master-routing.module';

@NgModule({
    declarations: [
OrnamentsMasterComponent
    ],
    imports: [
      CommonModule,  
      SharableModule,
      OrnamentsMasterRoutingModule
    ]
  })
  export class OrnamentsMasterModule { }