import { Component, NgModule, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonService } from 'src/app/core/env/common-services/common.service';
import { EnvFunction } from 'src/app/core/env/function/env-function';


@Component({
  selector: 'app-scheme-limit',
  templateUrl: './scheme-limit.component.html',
  styleUrls: ['./scheme-limit.component.scss'],
})


export class SchemeLimitComponent implements OnInit {

  //variables
  public getSchemeFormOnSaveData: any;
  public isTran: boolean;
  public schemeDetails: any;
  public fetchSchemeDetails: any;
  public submitted:boolean=false

  //forms------------------
  public formSchemeLimit: FormGroup;

  constructor(
    private envFn: EnvFunction,
    private fb: FormBuilder,
   private commonServices: CommonService,
  ) { }

  ngOnInit(): void {
    this.createSchemeLimitForm();
    // this.getSchemLimitDetails();
  }



  private createSchemeLimitForm(): void {
    this.formSchemeLimit = this.fb.group({
      minTerm: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]*'),
      ]),
      maxTerm: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]*'),
      ]),
      minAmount: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]*'),
      ]),
      maxAmount: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]*'),
      ]),
    });
  }


  // private getSchemLimitDetails() {
  //   this.appStore.select(fetchFetchedSchemeFormState_Limit).subscribe((data) => {
  //     this.fetchSchemeDetails = data.fetchSchemeDetails,
  //     this.schemeDetails = data.schemeDetails
  //     this.isTran = data.isTran

  //     if(this.schemeDetails) this.patchData(this.schemeDetails)
  //     else if(this.fetchSchemeDetails) this.patchData(this.fetchSchemeDetails)
  //     else  console.log("create mode");

  //   });
  //   this.appStore.select(getSchemeFormOnSaveData).subscribe((data) => {
  //     if (data.schemeId>0) {
  //       if(this.schemeDetails)
  //       this.patchData(this.schemeDetails)
  //     } else if (data.fetchId>0) {
  //       if(this.fetchSchemeDetails)
  //       this.patchData(this.fetchSchemeDetails)
  //     }
  //   });
  // }

  public patchData(data: any) {
    this.formSchemeLimit.patchValue({
      minTerm: data.schemeMinTerm,
      maxTerm: data.schemeMaxTerm,
      minAmount: data.schemeMinAmount,
      maxAmount: data.schemeMaxAmount,
    })
  }

  public saveLimitOverride() {
    this.submitted=true
    if (this.formSchemeLimit.valid) {
      this.commonServices.override.schemeLimitDefDetails=this.formSchemeLimit.value
    }

  }

  //validation>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public getErrorMessage(controlName: string): string {
    return this.envFn.getFormError(this.formSchemeLimit, controlName);
  }
}
