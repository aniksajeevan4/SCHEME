import { max } from 'rxjs';
import { EnvVariable } from 'src/app/core/env/variables/env-variable';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EnvFunction } from 'src/app/core/env/function/env-function';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MinMaxNumber } from 'src/app/core/validation/min-max-number.validator';
import { MiddleNumValForInterest, MiddleNumValForInterest1 } from 'src/app/core/validation/middle.number.valiadation';

@Component({
  selector: 'app-interest-definition',
  templateUrl: './interest-definition.component.html',
  styleUrls: ['./interest-definition.component.scss'],
})
export class InterestDefinitionComponent implements OnInit {
  @Output() getSchemeInterestDefinition = new EventEmitter<string>();

  //objects----------------
  public thisDay = new Date();

  //froms------------------
  public InterestDefinitionForm: FormGroup;
  public schemeinterestRatebyid: any = [];
  //variables----------------
  public rowIndex: number = -1;
  public submitted: any = false;
 public index:number;
  public save: boolean=true;
  //constructor---------------
  constructor(
    private fb: FormBuilder,
    private envFn: EnvFunction,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.CreateInterestDefinitionForm();
    this.patchValue()

  }
  //form----------------------------------------------------------------------------------------------------------------

  //form declaration>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  private CreateInterestDefinitionForm(): void {
    this.InterestDefinitionForm = this.fb.group(
      {
        FromDays: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternOnlyNumbersnospace),
        ]),
        ToDays: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternNumberswithoutZero),
        ]),
        InterestRate: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternDecimalPoints),
          Validators.max(100),
        ]),
        MinInterestValue: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternDecimalPoints),
          Validators.max(100)
        ]),
        MaxInterestValue: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternNumberswithoutZero),
          Validators.max(100)
        ]),
        Rebate: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternDecimalPoints),
          Validators.max(100)
        ]),
        RebateDays: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternOnlyNumbersnospace),
        ]),
        GracePeriod: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternOnlyNumbersnospace),
        ]),
        OverdueInterest: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternDecimalPoints),
          Validators.max(100),
        ]),
        PenalInterest: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternDecimalPoints),
          Validators.max(100),
        ]),
      },
      {
        validator: [
          MinMaxNumber('FromDays', 'ToDays'),
          MinMaxNumber('MinInterestValue', 'MaxInterestValue'),
          // MiddleNumValForInterest1('MinInterestValue','MaxInterestValue','InterestRate')
        ],
      }
    );
    
  }

 public  MiddleNumValForInterest(){
      // Get the values from the form controls
      const minValue = this.InterestDefinitionForm.get('MinInterestValue')?.value;
      const maxValue = this.InterestDefinitionForm.get('MaxInterestValue')?.value;
      const interestRate = this.InterestDefinitionForm.get('InterestRate')?.value;
  
      // Call the custom validation function
      const result = MiddleNumValForInterest1(minValue, maxValue, interestRate);
  
      // Do something with the result (if needed)
      console.log('Validation result:', result);
  
      // Update the form control's validity and error message (if needed)
      // For example, you can set the error on the 'InterestRate' control:
      const control = this.InterestDefinitionForm.get('InterestRate');
      if (result) {
        control?.setErrors({ middleNumValidationInterest: true });
      } else if(this.InterestDefinitionForm.get('InterestRate')?.value>100) {
        control?.setErrors({ max: true });
      }
      else{
        control?.setErrors(null);
      }
 }
  //patch value from interest View
 public patchValue()
  {
    this.schemeinterestRatebyid = this.data?.schemeinterestRatebyid;
    this.index=this.data?.index;
    if(this.index!==-1)
    {
      this.InterestDefinitionForm.get('FromDays')?.setValue(this.schemeinterestRatebyid[this.index].fromDays)
      this.InterestDefinitionForm.get('ToDays')?.setValue(this.schemeinterestRatebyid[this.index].toDays)
      this.InterestDefinitionForm.get('ToAmount')?.setValue(this.schemeinterestRatebyid[this.index].toAmount)
      this.InterestDefinitionForm.get('InterestRate')?.setValue(this.schemeinterestRatebyid[this.index].interestRate)
      this.InterestDefinitionForm.get('MinInterestValue')?.setValue(this.schemeinterestRatebyid[this.index].minInterestValue)
      this.InterestDefinitionForm.get('MaxInterestValue')?.setValue(this.schemeinterestRatebyid[this.index].maxInterestValue)
      this.InterestDefinitionForm.get('Rebate')?.setValue(this.schemeinterestRatebyid[this.index].rebate)
      this.InterestDefinitionForm.get('RebateDays')?.setValue(this.schemeinterestRatebyid[this.index].rebateDays)
      this.InterestDefinitionForm.get('GracePeriod')?.setValue(this.schemeinterestRatebyid[this.index].gracePeriod)
      this.InterestDefinitionForm.get('OverdueInterest')?.setValue(this.schemeinterestRatebyid[this.index].overdueInterestRate)
      this.InterestDefinitionForm.get('PenalInterest')?.setValue(this.schemeinterestRatebyid[this.index].penalInterestRate)
      this.rowIndex=this.index
    }
  }
  // Add values to the table
  public AddDataToGrid() {
    this.submitted = true;
    if(this.InterestDefinitionForm.get('InterestRate')?.value && this.InterestDefinitionForm.get('MinInterestValue')?.value &&
    this.InterestDefinitionForm.get('MaxInterestValue')?.value) {
      this.InterestDefinitionForm.get('InterestRate')?.clearValidators()
    if (this.InterestDefinitionForm.get('InterestRate')?.value> this.InterestDefinitionForm.get('MinInterestValue')?.value && this.InterestDefinitionForm.get('InterestRate')?.value < this.InterestDefinitionForm.get('MaxInterestValue')?.value) {
      this.InterestDefinitionForm.get('InterestRate')?.clearValidators()
      this.InterestDefinitionForm.get('InterestRate')?.updateValueAndValidity();
      this.InterestDefinitionForm.get('MinInterestValue')?.clearValidators()
      this.InterestDefinitionForm.get('MinInterestValue')?.updateValueAndValidity();
      this.InterestDefinitionForm.get('MaxInterestValue')?.clearValidators()
      this.InterestDefinitionForm.get('MaxInterestValue')?.updateValueAndValidity();
    }
  }
    if (this.InterestDefinitionForm.valid) {
      if (this.rowIndex == -1) {
        //Add
        this.schemeinterestRatebyid.push({
          fromDays: this.InterestDefinitionForm.get('FromDays')?.value,
          toDays: this.InterestDefinitionForm.get('ToDays')?.value,
          interestRate: this.InterestDefinitionForm.get('InterestRate')?.value,
          minInterestValue:
            this.InterestDefinitionForm.get('MinInterestValue')?.value,
          maxInterestValue:
            this.InterestDefinitionForm.get('MaxInterestValue')?.value,
          rebate: this.InterestDefinitionForm.get('Rebate')?.value,
          rebateDays: this.InterestDefinitionForm.get('RebateDays')?.value,
          gracePeriod: this.InterestDefinitionForm.get('GracePeriod')?.value,
          overdueInterestRate:
            this.InterestDefinitionForm.get('OverdueInterest')?.value,
          penalInterestRate:
            this.InterestDefinitionForm.get('PenalInterest')?.value,
          status: 0,
        });
      }
      //Edit
      else {
        this.schemeinterestRatebyid[this.rowIndex].fromDays =
          this.InterestDefinitionForm.get('FromDays')?.value;
        this.schemeinterestRatebyid[this.rowIndex].toDays =
          this.InterestDefinitionForm.get('ToDays')?.value;
        this.schemeinterestRatebyid[this.rowIndex].interestRate =
          this.InterestDefinitionForm.get('InterestRate')?.value;
        this.schemeinterestRatebyid[this.rowIndex].minInterestValue =
          this.InterestDefinitionForm.get('MinInterestValue')?.value;
        this.schemeinterestRatebyid[this.rowIndex].maxInterestValue =
          this.InterestDefinitionForm.get('MaxInterestValue')?.value;
        this.schemeinterestRatebyid[this.rowIndex].rebate =
          this.InterestDefinitionForm.get('Rebate')?.value;
        this.schemeinterestRatebyid[this.rowIndex].rebateDays =
          this.InterestDefinitionForm.get('RebateDays')?.value;
        this.schemeinterestRatebyid[this.rowIndex].gracePeriod =
          this.InterestDefinitionForm.get('GracePeriod')?.value;
        this.schemeinterestRatebyid[this.rowIndex].overdueInterestRate =
          this.InterestDefinitionForm.get('OverdueInterest')?.value;
        this.schemeinterestRatebyid[this.rowIndex].penalInterestRate =
          this.InterestDefinitionForm.get('PenalInterest')?.value;
        this.schemeinterestRatebyid[this.rowIndex].status = 0;
      }
      this.onReset();
      this.save=false
      Swal.fire('', 'Added Successfully', 'success')
    }
  }

  //Edit values of corresponding row
  public editvalues(rowIndex: any) {
    this.InterestDefinitionForm.controls['FromDays'].setValue(
      this.schemeinterestRatebyid[rowIndex].fromDays
    );
    this.InterestDefinitionForm.controls['ToDays'].setValue(
      this.schemeinterestRatebyid[rowIndex].toDays
    );
    this.InterestDefinitionForm.controls['InterestRate'].setValue(
      this.schemeinterestRatebyid[rowIndex].interestRate
    );
    this.InterestDefinitionForm.controls['MinInterestValue'].setValue(
      this.schemeinterestRatebyid[rowIndex].minInterestValue
    );
    this.InterestDefinitionForm.controls['MaxInterestValue'].setValue(
      this.schemeinterestRatebyid[rowIndex].maxInterestValue
    );
    this.InterestDefinitionForm.controls['Rebate'].setValue(
      this.schemeinterestRatebyid[rowIndex].rebate
    );
    this.InterestDefinitionForm.controls['RebateDays'].setValue(
      this.schemeinterestRatebyid[rowIndex].rebateDays
    );
    this.InterestDefinitionForm.controls['GracePeriod'].setValue(
      this.schemeinterestRatebyid[rowIndex].gracePeriod
    );
    this.InterestDefinitionForm.controls['OverdueInterest'].setValue(
      this.schemeinterestRatebyid[rowIndex].overdueInterestRate
    );
    this.InterestDefinitionForm.controls['PenalInterest'].setValue(
      this.schemeinterestRatebyid[rowIndex].penalInterestRate
    );
    this.rowIndex = rowIndex;
  }
  //delete values of corresponding row
  public Deletevalues(index: any) {
    Swal.fire({
      text: 'Are you sure you want to delete ?',
      icon: 'warning',
      cancelButtonText: 'Cancel',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.schemeinterestRatebyid.splice(index, 1);
        this.onReset();
          Swal.fire({
          title: 'Deleted successfully',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          icon: 'success',
        });
      }
    });
  }

  //Reset form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public onReset(): void {
    this.InterestDefinitionForm.reset();
    this.rowIndex = -1;
    this.submitted = false;
  }

  //clear
  public ClearDetails()
  {
    this.InterestDefinitionForm.reset();
    this.submitted = false;
  }
  //submit function>>>>>>>>>>>>>>>>
  public Submit() {
    if (this.schemeinterestRatebyid.length >= 1) {
      this.getSchemeInterestDefinition.emit(this.schemeinterestRatebyid);
    }
  }
  //validation>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public getErrorMessage(controlName: string): string {
    return this.envFn.getFormError(this.InterestDefinitionForm, controlName);
  }
}
