import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EnvFunction } from 'src/app/core/env/function/env-function';
import { Observable, max } from 'rxjs';
import { Store } from '@ngrx/store';
import { InterestDefinitionService } from '../../service/interest-definition.service';
import { EnvVariable } from 'src/app/core/env/variables/env-variable';
import { FromToDate } from 'src/app/core/validation/from-to-date.validator';
import { validateFromDate } from 'src/app/core/validation/pastDate.validator';
import Swal from 'sweetalert2';
import { MinMaxNumber } from 'src/app/core/validation/min-max-number.validator';
import { SchemeFormService } from 'src/app/modules/scheme-forms/services/scheme-form.service';
import { MiddleNumVal, MiddleNumValForInterest1 } from 'src/app/core/validation/middle.number.valiadation';

@Component({
  selector: 'app-charge-type',
  templateUrl: './charge-type.component.html',
  styleUrls: ['./charge-type.component.scss'],
})
export class ChargeTypeComponent implements OnInit {
  public chargeTypeList: any = [];
  public chargeAtList: any = [];
  public chargeOnList: any = [];
  public transactionLabelList: any = [];
  public chargeVaueTypeList: any = [];
  public maxFromDate: string = new Date().toISOString().split('T')[0];
  public hideButton: boolean;
  public submitted: boolean = false;
  public dateRange: boolean = false;
  public chargeTypeId: number = 0;
  public chargeCodeList: any = [];
  public formChargeType: FormGroup;

  @Output() chargeDefinitionSaved = new EventEmitter<any>();
  masterData$: Observable<any[]>;
  public slab: number = 0;
  public editRow: any=-1
  constructor(
    private store: Store,
    private envFn: EnvFunction,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private chargeService: InterestDefinitionService,
    private schemFormService: SchemeFormService,
    private dialogRef: MatDialogRef<ChargeTypeComponent>
  ) { }

  ngOnInit(): void {
    this.chargeTypeForm();
    this.onButtonClick();
    this.getChargeTpeList();
    this.getchargeOn();
    this.getChargeAtList();
    this.getChargeValueTypeList();
    this.getTransactionLabelList();
    this.formChargeType.get('chargeAt')?.disable()
    this.formChargeType.get('chargeOn')?.disable()
    this.formChargeType.get('chargeValueType')?.disable()

  }

  //form
  private chargeTypeForm() {
    this.formChargeType = this.fb.group(
      {
        chargeType: new FormControl('', [Validators.required]),
        // effectiveFrom: new FormControl('', [Validators.required,validateFromDate]),
        // effectiveTo: new FormControl('', [Validators.required,validateFromDate]),
        // fromDate: new FormControl('',[Validators.required,validateFromDate]),
        // toDate: new FormControl('', [Validators.required,validateFromDate]),
        fromAmount: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternOnlyNumbers),
        ]),
        toAmount: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternNumberswithoutZero),
        ]),
        fromRate: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternDecimalPoints),
          Validators.max(100),
        ]),
        toRate: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternDecimalPointNoZero),
          Validators.max(100),
        ]),
        minChargeValue: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternOnlyNumbers),
        ]),
        maxChargeValue: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternNumberswithoutZero),
        ]),
        chargeAt: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternOnlyNumbers),
        ]),
        chargeOn: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternOnlyNumbers),
        ]),
        chargeValueType: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternOnlyNumbers),
        ]),
        definiteChargeValue: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternOnlyNumbers),
        ]),
        tranLabel: new FormControl('', [Validators.required]),
      },
      {
        validator: [
          // FromToDate('fromDate','toDate'),
          MinMaxNumber('fromAmount', 'toAmount'),
          MinMaxNumber('fromRate', 'toRate'),
          MinMaxNumber('minChargeValue', 'maxChargeValue'),
          // MiddleNumVal('minChargeValue','maxChargeValue','definiteChargeValue')
        ],
      }
    );
  }

  public  MiddleNumValForCharge(){
    // Get the values from the form controls
    const minValue = this.formChargeType.get('minChargeValue')?.value;
    const maxValue = this.formChargeType.get('maxChargeValue')?.value;
    const definiteChargeValue = this.formChargeType.get('definiteChargeValue')?.value;

    // Call the custom validation function
    const result = MiddleNumValForInterest1(minValue, maxValue, definiteChargeValue);

    // Do something with the result (if needed)
    console.log('Validation result:', result);

    // Update the form control's validity and error message (if needed)
    // For example, you can set the error on the 'InterestRate' control:
    const control = this.formChargeType.get('definiteChargeValue');
    if (result) {
      control?.setErrors({ middleNumValidationCharge: true });
    }
    else if(this.formChargeType.get('definiteChargeValue')?.value>100)
    {
      control?.setErrors({ max: true });
    }
     else {
      control?.setErrors(null);
    }
}
    //deleting rows from table
    public deleteChargeCode(index: number): void {
      Swal.fire({
        text: 'Are you sure you want to delete ?',
        icon: 'warning',
        cancelButtonText: 'Cancel',
        showCancelButton: true,
        confirmButtonText: 'Delete',
      }).then((result) => {
        if (result.isConfirmed) {
            this.chargeCodeList.splice(index, 1);
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
    
  
  //for identifying add or edit page
  public onButtonClick(): void {
    if (this.data.isEditMode) {
      this.hideButton = this.data.isEditMode;
      this.chargeCodeList=this.data.chargeCoddeLists
    } else {
      this.hideButton = this.data.isEditMode;
      this.editRow=this.data.index
    }
  }

  //get data from table for editing
  public getChargeDefinition() {
    const charge = this.data.chargeCodeList;
    this.chargeTypeId=this.data.chargeCodeList.chargeTypeId
    if ((charge.rateSlab == 1 && charge.amountSlab == 0) || charge.slab == 1) {
      this.slab = 1;
      this.formChargeType.patchValue({
        fromRate: charge.fromRate,
        toRate: charge.toRate,
      });
    } else if (
      (charge.rateSlab == 0 && charge.amountSlab == 1) ||
      charge.slab == 2
    ) {
      this.slab = 2;
      this.formChargeType.patchValue({
        fromAmount: charge.fromAmount,
        toAmount: charge.toAmount,
      });
    } else {
      this.slab = 0;
      this.formChargeType.patchValue({
        fromAmount: charge.fromAmount,
        toAmount: charge.toAmount,
        fromRate: charge.fromRate,
        toRate: charge.toRate,
      });
    }
    this.formChargeType.patchValue({
      chargeType: charge.chargeTypeId,
      effectiveFrom: charge.effectiveDate,
      fromDate: charge.fromDate,
      toDate: charge.toDate,
      // fromAmount: charge.fromAmount,
      // toAmount: charge.toAmount,
      // fromRate: charge.fromRate,
      // toRate: charge.toRate,
      minChargeValue: charge.minChargeValue,
      maxChargeValue: charge.maxChargeValue,
      chargeAt: charge.chargeAtId,
      chargeOn: charge.chargeOnId,
      chargeValueType: charge.chargeValueTypeId,
      definiteChargeValue: charge.defChargeValue,
      tranLabel: charge.accountId,
    });
    this.chargeCodeList=this.data.chargeCoddeLists
  }

  public edit(charge:any,id:any){
    this.editRow=id
    this.chargeTypeId=charge.chargeTypeId
    if ((charge.rateSlab == 1 && charge.amountSlab == 0) || charge.slab == 1) {
      this.slab = 1;
      this.formChargeType.patchValue({
        fromRate: charge.fromRate,
        toRate: charge.toRate,
      });
    } else if (
      (charge.rateSlab == 0 && charge.amountSlab == 1) ||
      charge.slab == 2
    ) {
      this.slab = 2;
      this.formChargeType.patchValue({
        fromAmount: charge.fromAmount,
        toAmount: charge.toAmount,
      });
    } else {
      this.slab = 0;
      this.formChargeType.patchValue({
        fromAmount: charge.fromAmount,
        toAmount: charge.toAmount,
        fromRate: charge.fromRate,
        toRate: charge.toRate,
      });
    }
    this.formChargeType.patchValue({
      chargeType: charge.chargeTypeId,
      effectiveFrom: charge.effectiveDate,
      fromDate: charge.fromDate,
      toDate: charge.toDate,
      // fromAmount: charge.fromAmount,
      // toAmount: charge.toAmount,
      // fromRate: charge.fromRate,
      // toRate: charge.toRate,
      minChargeValue: charge.minChargeValue,
      maxChargeValue: charge.maxChargeValue,
      chargeAt: charge.chargeAtId,
      chargeOn: charge.chargeOnId,
      chargeValueType: charge.chargeValueTypeId,
      definiteChargeValue: charge.defChargeValue,
      tranLabel: charge.accountId,
    });

  }


  save() {
    if(this.chargeCodeList.length>0){
       this.chargeDefinitionSaved.emit(this.chargeCodeList);
      Swal.fire('', 'Added Successfully', 'success')
    }
  
  }


  //add chargeCode on table
  public saveChargeDefinition() {
    this.submitted = true;
    if(this.formChargeType.get('definiteChargeValue')?.value && this.formChargeType.get('minChargeValue')?.value &&
    this.formChargeType.get('maxChargeValue')?.value) {
      this.formChargeType.get('formChargeType')?.clearValidators()
    if (this.formChargeType.get('definiteChargeValue')?.value> this.formChargeType.get('minChargeValue')?.value && this.formChargeType.get('definiteChargeValue')?.value < this.formChargeType.get('maxChargeValue')?.value) {
      this.formChargeType.get('definiteChargeValue')?.clearValidators()
      this.formChargeType.get('definiteChargeValue')?.updateValueAndValidity();
      this.formChargeType.get('minChargeValue')?.clearValidators()
      this.formChargeType.get('minChargeValue')?.updateValueAndValidity();
      this.formChargeType.get('maxChargeValue')?.clearValidators()
      this.formChargeType.get('maxChargeValue')?.updateValueAndValidity();
    }
  }
    let isDuplicate:any
  //   if (this.formChargeType.get('chargeType')?.value && this.data.chargeTypeId) {
  //     if(this.formChargeType.get('chargeType')?.value== this.chargeTypeId){
  //       const count = this.data.chargeTypeId.filter((existingItem: any) => existingItem == this.formChargeType.get('chargeType')?.value).length;
  //       isDuplicate = count > 1;
  //     }
  //   else{
  //     isDuplicate = this.data.chargeTypeId.some((existingItem: any) => existingItem ==this.formChargeType.get('chargeType')?.value);
  //   }
  //   console.log(isDuplicate,"isDuplicate");
    
  // }
  if (this.formChargeType.get('chargeType')?.value) {
    if(this.formChargeType.get('chargeType')?.value== this.chargeTypeId){
      const count = this.chargeCodeList.filter((existingItem: any) => existingItem.chargeTypeId == this.formChargeType.get('chargeType')?.value).length;
      isDuplicate = count > 1;
    }
  else{
    // alert(12)
    isDuplicate = this.chargeCodeList.some((existingItem: any) => existingItem.chargeTypeId==this.formChargeType.get('chargeType')?.value);
  }
  console.log(isDuplicate,"isDuplicate");
  
}

    
    if (this.slab == 2) {
      this.formChargeType.get('toRate')?.setValue(0);
      this.formChargeType.get('fromRate')?.setValue(0);
      this.formChargeType.get('fromRate')?.clearValidators();
      this.formChargeType.get('fromRate')?.updateValueAndValidity();
      this.formChargeType.get('toRate')?.clearValidators();
      this.formChargeType.get('toRate')?.updateValueAndValidity();
    } else if (this.slab == 1) {
      this.formChargeType.get('toAmount')?.setValue(0);
      this.formChargeType.get('fromAmount')?.setValue(0);
      this.formChargeType.get('fromAmount')?.clearValidators();
      this.formChargeType.get('fromAmount')?.updateValueAndValidity();
      this.formChargeType.get('toAmount')?.clearValidators();
      this.formChargeType.get('toAmount')?.updateValueAndValidity();
    }

    
    if (!isDuplicate) {
    if (this.formChargeType.valid) {
      const chargeDefinition = {
        // chargeCodeId:0,
        // chargeDefId: this.formChargeType.get("definiteChargeValue")?.value,
        chargeTypeId: this.formChargeType.get('chargeType')?.value,
        chargeTypeValue: this.envFn.getDescriptionById(
          this.chargeTypeList,
          'chargeTypeId',
          this.formChargeType.get('chargeType')?.value,
          'chargeTypeValue'
        ),
        chargeOnId: this.formChargeType.get('chargeOn')?.value,
        chargeOnValue:  this.envFn.getDescriptionById(
          this.chargeOnList,
          'chargeOnId',
          this.formChargeType.get('chargeOn')?.value,
          'chargeOnValue'
        ),
        chargeAtId: this.formChargeType.get('chargeAt')?.value,
        chargeAtValue: this.envFn.getDescriptionById(
          this.chargeAtList,
          'chargeAtId',
          this.formChargeType.get('chargeAt')?.value,
          'chargeAtValue'
        ),
        fromAmount: this.formChargeType.get('fromAmount')?.value,
        toAmount: this.formChargeType.get('toAmount')?.value,
        defChargeValue: this.formChargeType.get('definiteChargeValue')?.value,
        // effectiveDate: this.formChargeType.get("effectiveFrom")?.value,
        // fromDate: this.formChargeType.get("fromDate")?.value,
        // toDate: this.formChargeType.get("toDate")?.value,
        fromRate: this.formChargeType.get('fromRate')?.value,
        toRate: this.formChargeType.get('toRate')?.value,
        maxChargeValue: this.formChargeType.get('maxChargeValue')?.value,
        minChargeValue: this.formChargeType.get('minChargeValue')?.value,
        accountId: this.formChargeType.get('tranLabel')?.value,
        transactionLabel:this.envFn.getDescriptionById(this.transactionLabelList,'id',this.formChargeType.get('tranLabel')?.value,'description'),
        chargeValueTypeId: this.formChargeType.get('chargeValueType')?.value,
        chargeValueType: this.envFn.getDescriptionById(
          this.chargeVaueTypeList,
          'chargeValueTypeId',
          this.formChargeType.get('chargeValueType')?.value,
          'chargeValueType'
        ),
        slab: this.slab,
      };

      // alert(this.editRow)
      if (this.editRow == -1) {
        this.chargeCodeList.push(chargeDefinition)
      }else{
        this.chargeCodeList[this.editRow] = chargeDefinition;
      }
      this.clear()
      // this.chargeDefinitionSaved.emit(chargeDefinition);
      // Swal.fire('', 'Added Successfully', 'success')
    }
  }else{
    Swal.fire("",'Cannot add same Charge Type');
       }
  }
  //get api by chargetype id
  public onChargeType(chargeType: any): void {
    console.log(chargeType.target.value);
    this.chargeService
      .getChargeTypeById(chargeType.target.value)
      .subscribe((res: any) => {
        if (res.statusCode == 200) {
          if (res.result.rateSlab == 1 && res.result.amountSlab == 0) {
            this.slab = 1;
          } else if (res.result.rateSlab == 0 && res.result.amountSlab == 1) {
            this.slab = 2;
          } else {
            this.slab = 0;
          }
          this.formChargeType.patchValue({
            chargeAt: res.result.chargeAtId,
            chargeOn: res.result.chargeOnId,
            chargeValueType: res.result.chargeValueTypeId,
          });
        }
      });
  }

  //get chargetype list
  public getChargeTpeList() {
    this.chargeService.getChargeType().subscribe((res: any) => {
      this.chargeTypeList = res.result;
    });
  }

  //get charge at list
  public getChargeAtList() {
    this.chargeService.getchargeAt().subscribe((res: any) => {
      this.chargeAtList = res.result;
    });
  }

  //get charge on list
  public getchargeOn() {
    this.chargeService.getchargeOn().subscribe((res: any) => {
      this.chargeOnList = res.result;
    });
  }

  //get charge value type list
  public getChargeValueTypeList() {
    this.chargeService.getChargeValueType().subscribe((res: any) => {
      this.chargeVaueTypeList = res.result;
    });
  }

  //get Transaction accounting Label list
  private getTransactionLabelList() {
    this.schemFormService.getTransactionLabel().subscribe((res: any) => {
      this.transactionLabelList = res.result;
    });
  }

  //clear form
  public clear() {
    this.formChargeType.reset();
    this.submitted = false;
    this.editRow = -1;

  }

  //validation>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public getErrorMessage(controlName: string): string {
    return this.envFn.getFormError(this.formChargeType, controlName);
  }
}
