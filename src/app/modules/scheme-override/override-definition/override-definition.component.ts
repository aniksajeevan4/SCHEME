import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonService } from '../../../core/env/common-services/common.service';
import { EnvFunction } from 'src/app/core/env/function/env-function';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-override-definition',
  templateUrl: './override-definition.component.html',
  styleUrls: ['./override-definition.component.scss'],
})
export class OverrideDefinitionComponent implements OnInit {
  @Output('parentFun') parentFun: EventEmitter<any> = new EventEmitter();
  public formOverrideDetails: FormGroup;
  buttonLabel: String;
  valueList: any = [];
  schemes: any = [];
  zones: any = [];
  regions: any = [];
  branches: any = [];
  submitted: boolean = false;
  overrideFlag = 0;
  checkBoxVal: any = [];
  viewDetails:boolean=false
  constructor(
    private fb: FormBuilder,
    private commonServices: CommonService,
    private envFn: EnvFunction,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.valueChanges()
    this.getSchemeDetails();
    this.getZones();
    this.getRegions();
    this.getBranches();
    this.urlChecking();
  }

  private createForm(): void {
    this.formOverrideDetails = this.fb.group({
      interestOverride: new FormControl(false),
      chargeOverride: new FormControl(false),
      limitOverride: new FormControl(false),
      schemeName: new FormControl('', [Validators.required]),
      hideCheckbox: new FormControl('', [Validators.required]),
      schemeOverrideApplicable: new FormControl('', [Validators.required]),
      zone: new FormControl('', [Validators.required]),
      region: new FormControl('', [Validators.required]),
      branch: new FormControl('', [Validators.required]),
    });
  }

  public urlChecking() {
    if (this.route.snapshot.params['editTran']) {
      this.getData();
    } else if (this.route.snapshot.params['overRideViewTran']) {
      this.getData();
      this.formOverrideDetails.disable()
      this.viewDetails=true
    } else {
      // alert(2)
    }
  }

  public getData() {
    this.formOverrideDetails
      .get('schemeName')
      ?.setValue(this.commonServices.override.schemeId);
    this.formOverrideDetails
      .get('schemeOverrideApplicable')
      ?.setValue(this.commonServices.override.groupTypeId);

    // this.formOverrideDetails.get('schemeOverrideApplicable')?.setValue(this.commonServices.override.groupTypeId)
    // alert(this.commonServices.override.groupTypeId)
    // alert('def')
    if (this.commonServices.override.schemeInterestDefinition.length > 0) {
      this.formOverrideDetails.get('interestOverride')?.setValue(true);
      this.checkBoxVal.push({
        name: 'Interest',
        val: true,
      });
    }
    if (this.commonServices.override.schemeCharges.length > 0) {
      this.formOverrideDetails.get('chargeOverride')?.setValue(true);
      this.checkBoxVal.push({
        name: 'Charge',
        val: true,
      });
    }

    if (this.commonServices.override.schemeLimitDefDetails) {
      this.formOverrideDetails.get('limitOverride')?.setValue(true);
      this.checkBoxVal.push({
        name: 'Limit',
        val: true,
      });
    }

    this.valueList = this.commonServices.override.branchDetails;
    // alert(this.commonServices.override.groupTypeId)
    if (this.commonServices.override.groupTypeId == 4) {
      
      console.log(this.formOverrideDetails.get('schemeOverrideApplicable')?.valid,"nnnnnnnnnnnnn")
      console.log(this.formOverrideDetails.get('hideCheckbox')?.valid,"nnnnnnnnnnnnn")

      
      this.buttonLabel = 'Add Branches';
      this.formOverrideDetails.get('branch')?.setValue(null)
      this.formOverrideDetails.get('branch')?.clearValidators();
      this.formOverrideDetails.get('branch')?.updateValueAndValidity();
      this.formOverrideDetails.get('region')?.clearValidators();
      this.formOverrideDetails.get('region')?.updateValueAndValidity();
      this.formOverrideDetails.get('zone')?.clearValidators();
      this.formOverrideDetails.get('zone')?.updateValueAndValidity();
      // this.formOverrideDetails
      //   .get('branch')
      //   ?.setValidators([Validators.required]);
      // this.formOverrideDetails.get('branch')?.updateValueAndValidity();
      // this.formOverrideDetails.get('branch')?.setValue(this.commonServices.override.branchDetails)
    }
    if (this.commonServices.override.groupTypeId == 3) {
      console.log(this.formOverrideDetails.get('schemeName')?.valid,"nnnnnnnnnnnnn")
      console.log(this.formOverrideDetails.get('hideCheckbox')?.valid,"nnnnnnnnnnnnn")

      this.buttonLabel = 'Add Zones';
      this.formOverrideDetails.get('branch')?.clearValidators();
      this.formOverrideDetails.get('branch')?.updateValueAndValidity();
      this.formOverrideDetails.get('region')?.clearValidators();
      this.formOverrideDetails.get('region')?.updateValueAndValidity();
      this.formOverrideDetails.get('zone')?.clearValidators();
      this.formOverrideDetails.get('zone')?.updateValueAndValidity();
      // this.formOverrideDetails
      //   .get('region')
      //   ?.setValidators([Validators.required]);
      // this.formOverrideDetails.get('branch')?.updateValueAndValidity();
    }
    if (this.commonServices.override.groupTypeId == 2) {
      this.buttonLabel = 'Add Regions';
      this.formOverrideDetails.get('branch')?.clearValidators();
      this.formOverrideDetails.get('branch')?.updateValueAndValidity();
      this.formOverrideDetails.get('region')?.clearValidators();
      this.formOverrideDetails.get('region')?.updateValueAndValidity();
      this.formOverrideDetails.get('zone')?.clearValidators();
      this.formOverrideDetails.get('zone')?.updateValueAndValidity();
    }
    if (this.commonServices.override.groupTypeId) {
      // this.formOverrideDetails.valid
      this.formOverrideDetails.get('hideCheckbox')?.clearValidators();
      this.formOverrideDetails.get('hideCheckbox')?.updateValueAndValidity();
    }
  }

  changeValue(event: any) {
    this.valueList = [];
    switch (event.target.value) {
      case '4': {
        this.buttonLabel = 'Add Branches';
        this.formOverrideDetails.get('region')?.clearValidators();
        this.formOverrideDetails.get('region')?.updateValueAndValidity();
        this.formOverrideDetails.get('zone')?.clearValidators();
        this.formOverrideDetails.get('zone')?.updateValueAndValidity();
        this.formOverrideDetails
          .get('branch')
          ?.setValidators([Validators.required]);
        this.formOverrideDetails.get('branch')?.updateValueAndValidity();
        break;
      }
      case '2': {
        this.buttonLabel = 'Add Regions';
        this.formOverrideDetails.get('branch')?.clearValidators();
        this.formOverrideDetails.get('branch')?.updateValueAndValidity();
        this.formOverrideDetails.get('zone')?.clearValidators();
        this.formOverrideDetails.get('zone')?.updateValueAndValidity();
        this.formOverrideDetails
          .get('region')
          ?.setValidators([Validators.required]);
        this.formOverrideDetails.get('branch')?.updateValueAndValidity();
        break;
      }
      case '3': {
        this.buttonLabel = 'Add Zones';
        this.formOverrideDetails.get('branch')?.clearValidators();
        this.formOverrideDetails.get('branch')?.updateValueAndValidity();
        this.formOverrideDetails.get('region')?.clearValidators();
        this.formOverrideDetails.get('region')?.updateValueAndValidity();
        this.formOverrideDetails
          .get('zone')
          ?.setValidators([Validators.required]);
        this.formOverrideDetails.get('zone')?.updateValueAndValidity();

        break;
      }
    }
  }

  addValues() {
    this.submitted = true;
    if (
      this.formOverrideDetails.value.interestOverride == true ||
      this.formOverrideDetails.value.chargeOverride == true ||
      this.formOverrideDetails.value.limitOverride == true
    ) {
      this.overrideFlag = 0;
      this.formOverrideDetails.get('hideCheckbox')?.clearValidators();
      this.formOverrideDetails.get('hideCheckbox')?.updateValueAndValidity();
    } else {
      this.overrideFlag = 1;
      this.formOverrideDetails
        .get('hideCheckbox')
        ?.setValidators([Validators.required]);
      this.formOverrideDetails.get('schemeName')?.updateValueAndValidity();
      alert('select atleast  one override');
    }

      if (this.formOverrideDetails.value.schemeOverrideApplicable == 4) {
        if(this.formOverrideDetails.get('branch')?.value){
          let foundBranch = this.branches.find((branch:any) => branch.branchId == this.formOverrideDetails.value.branch)
          if (!this.valueList.some((branchObj: any) => branchObj.id == foundBranch.branchId)) {
            // Map the properties of the foundBranch object to new keys id and name
            let mappedBranch = {
              id: foundBranch.branchId,
              name: foundBranch.branchName
            };
            this.valueList.push(mappedBranch);
            this.formOverrideDetails.get('branch')?.reset()
            this.formOverrideDetails.get('branch')?.clearValidators();
             this.formOverrideDetails.get('branch')?.updateValueAndValidity();
            this.submitted=false
        }else{
          Swal.fire( {  toast: true,position: 'top-end',showConfirmButton: false,timer: 3000,
            timerProgressBar: true,
            title: "Duplicate Branch",
            icon: 'error',
            showCloseButton: true,
          });
        }
        }
       
    }

      if (this.formOverrideDetails.value.schemeOverrideApplicable == 2) {
        if(this.formOverrideDetails.get('region')?.value){
           if (!this.valueList.includes(this.formOverrideDetails.value.region)) {
          this.valueList.push(this.formOverrideDetails.value.region);
          this.formOverrideDetails.get('region')?.reset()
          this.formOverrideDetails.get('region')?.clearValidators();
           this.formOverrideDetails.get('region')?.updateValueAndValidity();
          this.submitted=false
        }
        else{
          Swal.fire( {  toast: true,position: 'top-end',showConfirmButton: false,timer: 3000,
            timerProgressBar: true,
            title: "Duplicate Region",
            icon: 'error',
            showCloseButton: true,
          });
        }
        }
       
      }
      if (this.formOverrideDetails.value.schemeOverrideApplicable == 3) {
        if(this.formOverrideDetails.get('zone')?.value){
        if (!this.valueList.includes(this.formOverrideDetails.value.zone)) {
          this.valueList.push(this.formOverrideDetails.value.zone);
          this.formOverrideDetails.get('zone')?.reset()
          this.formOverrideDetails.get('zone')?.clearValidators();
           this.formOverrideDetails.get('zone')?.updateValueAndValidity();
          this.submitted=false
        }else{
          Swal.fire( {  toast: true,position: 'top-end',showConfirmButton: false,timer: 3000,
            timerProgressBar: true,
            title: "Duplicate Zone",
            icon: 'error',
            showCloseButton: true,
          });
        }
      }
      }
  }

  getSchemeDetails() {
    this.commonServices.getSchemeList(false,1).subscribe((res) => {
      this.schemes = res.result;
      console.log(this.schemes);
    });
  }


  getZones() {
    this.commonServices.getZoneList().subscribe((res) => (this.zones = res));
  }

  getRegions() {
    this.commonServices.getRegionList().subscribe((res) => {
      this.regions = res;
    });
  }

  getBranches() {
    // this.commonServices.BranchList('m', false).subscribe((res:any) => {
    //   this.branches = res.result;
    // });
  }

   keyup(event: any) {
  // this.schemeBranch.get('branch')?.setValue(null)
  const searchTerm = event.target.value.trim();
  if (searchTerm.length >= 3) {
    this.commonServices.BranchList(searchTerm, false).subscribe((res:any) => {
      this.branches = res.result;
    });
  }
   }

  public valueChanges(){
    this.formOverrideDetails.get('branch')?.valueChanges.subscribe((value) => {
    console.log(value);
    
    })



  }

  public getErrorMessage(controlName: string): string {
    return this.envFn.getFormError(this.formOverrideDetails, controlName);
  }

  setValue(obj: any, event: any) {
    console.log(this.checkBoxVal, 'uuuuuuuuuuuuuuuuuVal');

    const found = this.checkBoxVal.find((element: any) => {
      return element.name === obj.name;
    });
    if (event.target.checked == true && !found) {
      this.overrideFlag = 0;
      {
        this.checkBoxVal.push({
          name: obj.name,
          val: event.target.checked,
        });
      }
    } else {
      if (event.target.checked == false && found) {
        for (let item of this.checkBoxVal) {
          if (obj.name === item.name) {
            this.checkBoxVal.splice(this.checkBoxVal.indexOf(item), 1);
            break;
          }
        }
      }
    }

    if (event.target.checked == false) {
      if (obj.name == 'Interest')
        this.commonServices.override.schemeInterestDefinition = '';
      if (obj.name == 'Charge') this.commonServices.override.schemeCharges = '';
      if (obj.name == 'Limit') this.commonServices.override.schemeLimitDefDetails = '';
    }
    console.log(this.checkBoxVal, 'this.checkBoxValthis.checkBoxVal');

    this.parentFun.emit(this.checkBoxVal);
  }

  saveValue() {
    console.log(this.formOverrideDetails.value, '2121212');
    if (
      this.formOverrideDetails.value.interestOverride == true ||
      this.formOverrideDetails.value.chargeOverride == true ||
      this.formOverrideDetails.value.limitOverride == true
    ) {
      this.overrideFlag = 0;
      this.formOverrideDetails.get('hideCheckbox')?.clearValidators();
      this.formOverrideDetails.get('hideCheckbox')?.updateValueAndValidity();
    } else {
      this.overrideFlag = 1;
      this.formOverrideDetails
        .get('hideCheckbox')
        ?.setValidators([Validators.required]);
      this.formOverrideDetails.get('hideCheckbox')?.updateValueAndValidity();
    }

    if (!this.formOverrideDetails.valid) {
      return;
    } else {
      this.commonServices.override.schemeId =
        this.formOverrideDetails.value.schemeName;
      this.commonServices.override.groupTypeId =
        this.formOverrideDetails.value.schemeOverrideApplicable;
      console.log(this.valueList, 'this.commonServices.override.branchDetails');
      this.commonServices.override.branchDetails = this.valueList;

      // this.valueList.forEach((element:any) => this.commonServices.override.branchDetails.push( {"branchGroupId": element.id}));
    }
    console.log(this.commonServices.override, 'opoop');
  }
  public deleteChargeCode(index: number): void {
    this.envFn.showSwalConfirm('', 'Are you sure you want to delete ?', 'warning', "Delete", "Cancel", true).then((res) => {
      if (res) {
        this.valueList.splice(index, 1);
        this.envFn.showSwalToast('Deleted Successfully', '', 'success', 1000)
      }

    })
}

}
