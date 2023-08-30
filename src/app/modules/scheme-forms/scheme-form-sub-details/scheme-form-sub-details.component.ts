import { fetchSchemeFormState_generalInfo } from './../../../core/store/schemeFormStore/schemeform.selectors';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { EnvFunction } from 'src/app/core/env/function/env-function';
import { EnvVariable } from 'src/app/core/env/variables/env-variable';
import { showLoader } from 'src/app/core/store/sharedStore/shared.action';
import { validationIsNumber } from 'src/app/core/validation/is-number.validator';
import { MinMaxNumber } from 'src/app/core/validation/min-max-number.validator';
import { SchemeService } from '../../scheme/services/scheme.service';
import { SchemeFormService } from '../services/scheme-form.service';
import { AppState } from 'src/app/core/store/app.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-scheme-form-sub-details',
  templateUrl: './scheme-form-sub-details.component.html',
  styleUrls: ['./scheme-form-sub-details.component.scss']
})
export class SchemeFormSubDetailsComponent implements OnInit {

  //objects----------------
  public thisDay = new Date();
  private unsubscribe$: Subject<void> = new Subject<void>();

  //froms------------------
  public formSchemeDetails: FormGroup;
  public dropDownGL: any = [];
  public dropDownGenderType: any = [];
  public dropDownCustomerType: any = [];
  public dropDownRePaymentType: any = [];
  public dropDownRefreshTo: any = [];
  public dropDownValidationType: any = [];
  public dropDownChannelType: any = [];
  public formSubmitted:boolean = false;
  //variables--------------
  private fetchedProductId: number = 0;
  private fetchSchemeDetails: any;
  private schemeDetails: any;
  public isTran: boolean = false;
  public loadView :boolean = false;
  public durationTypes:any = [{id:1, title:'In Day'},{id:2, title:'In Month'}];
  public viewOnly:boolean = false;
  //constructor
  constructor(
    private envFn: EnvFunction,
    private fb: FormBuilder,
    private schemeService: SchemeService,
    private commonService: SchemeFormService,
    private appStore: Store<AppState>
  ) {
    this.appStore.dispatch(showLoader({ status: true }));
  }

  //Life cycle functions--------------------------------------------------------------------------------------------------
  ngOnInit(): void {
    this.getGlList();
    this.getGenderType();
    this.getCustomerType();
    this.getPaymentTypeList();
    this.getRefreshTo();
    // this.getValidationProcedure();
    this.getChannelType();
    this.createForm();
    this.getSchemDetails();
    this.ifFormValueChanges();
    this.appStore.dispatch(showLoader({ status: false }));
    this.loadView = true;
  }

  //store---------------------------------------------------------------------------------------------------------------

  //get schemedetails from store and send data to patch the form
  private getSchemDetails() {
    try{
    this.appStore.select(fetchSchemeFormState_generalInfo).subscribe((data) => {
      this.fetchSchemeDetails = data.fetchSchemeDetails,
        this.schemeDetails = data.schemeDetails
      this.isTran = data.isTran;
      this.viewOnly = data.viewOnly;
      if (this.schemeDetails) this.patchData(this.schemeDetails)
      else if (this.fetchSchemeDetails) this.patchData(this.fetchSchemeDetails);
    });
  }
  catch(error){
    this.envFn.showResponseErrorMessage('Something went wrong while fetching data from store')
  }
  }



  //Service-------------------------------------------------------------------------------------
  //get GL Code data for listing>>>>>>>>>>>>>>>>>>
  private getGlList() {
    try{
    this.commonService.getGlCodeList().pipe(takeUntil(this.unsubscribe$)).subscribe(
      (data: any) => {
        if (data.statusCode == 200) {
          this.dropDownGL = [];
          this.dropDownGL = data.result
        }
        else this.envFn.showResponseErrorMessage('something went wrong while fetching GL Code list');
      },
      () => { this.envFn.showResponseErrorMessage('something went wrong while fetching GL Code list'); }
    );
  }
  catch(error){
    this.envFn.showResponseErrorMessage('something went wrong while fetching GL Code list');
  }
  }


  //get Channel types for listing>>>>>>>>>>>>>>>>>>
  private getGenderType() {
    try{
    this.commonService.getGenderList().pipe(takeUntil(this.unsubscribe$)).subscribe(
      (data: any) => {
        if (data.statusCode == 200) {
          this.dropDownGenderType = [];
          this.dropDownGenderType = data.result
        }
        else this.envFn.showResponseErrorMessage('something went wrong while fetching gender list');
      },
      () => { this.envFn.showResponseErrorMessage('something went wrong while fetching gender list'); }
    );

  }
  catch(error){
    this.envFn.showResponseErrorMessage('something went wrong while fetching gender list');
  }
  }

  //get Channel types for listing>>>>>>>>>>>>>>>>>>
  private getCustomerType() {
    try{
    this.commonService.getCustomerTypeList().pipe(takeUntil(this.unsubscribe$)).subscribe(
      (data: any) => {
        if (data.statusCode == 200) {
          this.dropDownCustomerType = [];
          this.dropDownCustomerType = data.result
        }
        else this.envFn.showResponseErrorMessage('something went wrong while fetching Customer type list');
      },
      () => { this.envFn.showResponseErrorMessage('something went wrong while fetching Customer type list'); }
    );
  }
  catch(error){
    this.envFn.showResponseErrorMessage('something went wrong while fetching Customer type list');
  }
  }
  //get payment type data for listing>>>>>>>>>>>>>>>>>>
  private getPaymentTypeList() {
    try{
    this.commonService.getRePaymentTypeList().pipe(takeUntil(this.unsubscribe$)).subscribe(
      (data: any) => {
        if (data.statusCode == 200) {
          this.dropDownRePaymentType = [];
          this.dropDownRePaymentType = data.result
        }
        else this.envFn.showResponseErrorMessage('something went wrong while fetching re-payment type list');
      },
      () => { this.envFn.showResponseErrorMessage('something went wrong while fetching re-payment type list'); }
    );
  }
  catch(error){
    this.envFn.showResponseErrorMessage('something went wrong while fetching re-payment type list');
  }
  }

  //get payment type data for listing>>>>>>>>>>>>>>>>>>
  private getRefreshTo() {
    try{
    this.dropDownRefreshTo = []
    this.schemeService.getSchemeDetails(this.fetchedProductId, '', 1, 5).pipe(takeUntil(this.unsubscribe$)).subscribe(
      (data: any) => {
        if (data.statusCode == 200) this.dropDownRefreshTo = [{ schemeId: 0, name: 'Same Scheme' }].concat(data.result);
        else this.envFn.showResponseErrorMessage('something went wrong while fetching schemes')
      },
      () => {
        this.envFn.showResponseErrorMessage('something went wrong while fetching schemes for refresh')
      })
    }
    catch(error){
      this.envFn.showResponseErrorMessage('something went wrong while fetching schemes for refresh')
    }
  }

  //get GL Validation procedures for listing>>>>>>>>>>>>>>>>>>
  // private getValidationProcedure() {
  //   try{
  //   this.commonService.getValidationProcedureList().pipe(takeUntil(this.unsubscribe$)).subscribe(
  //     (data: any) => {
  //       if (data.statusCode == 200) {
  //         this.dropDownValidationType = [];
  //         this.dropDownValidationType = data.result
  //       }
  //       else this.envFn.showResponseErrorMessage('something went wrong while fetching Validation procedure list');
  //     },
  //     (error) => { this.envFn.showResponseErrorMessage('something went wrong while fetching Validation procedure list'); }
  //   );
  // }
  // catch(error){
  //   this.envFn.showResponseErrorMessage('something went wrong while fetching Validation procedure list');
  // }
  // }

  //get Channel types for listing>>>>>>>>>>>>>>>>>>
  private getChannelType() {
    try{
    this.commonService.getChannelTypeList().pipe(takeUntil(this.unsubscribe$)).subscribe(
      (data: any) => {
        if (data.statusCode == 200) {
          this.dropDownChannelType = [];
          this.dropDownChannelType = data.result;
        }
        else this.envFn.showResponseErrorMessage('something went wrong while fetching Channel Type list');
      },
      () => { this.envFn.showResponseErrorMessage('something went wrong while fetching Channel Type list'); }
    );
  }
  catch(error){
    this.envFn.showResponseErrorMessage('something went wrong while fetching Channel Type list');
  }
  }

  //form----------------------------------------------------------------------------------------------------------------

  //form declaration>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  private createForm(): void {
    this.formSchemeDetails = this.fb.group({
      'schemeTransactionLabel': new FormControl('', [Validators.required,validationIsNumber(EnvVariable.maxDropDown, 1)]),
      'schemeMinAge': new FormControl(18, [Validators.required, Validators.pattern(EnvVariable.patternOnlyNumbers), validationIsNumber(EnvVariable.maxAge, EnvVariable.minAge)]),
      'schemeMaxAge': new FormControl('', [Validators.required, Validators.pattern(EnvVariable.patternOnlyNumbers), validationIsNumber(EnvVariable.maxAge, EnvVariable.minAge)]),
      'schemeMinTerm': new FormControl('', [Validators.required, Validators.pattern(EnvVariable.patternOnlyNumbers), validationIsNumber(EnvVariable.maxTerms, EnvVariable.minTerms)]),
      'schemeMaxTerm': new FormControl('', [Validators.required, Validators.pattern(EnvVariable.patternOnlyNumbers), validationIsNumber(EnvVariable.maxTerms, EnvVariable.minTerms)]),
      'schemeDurationType': new FormControl(1, [Validators.required]),
      'schemeMinAmount': new FormControl('', [Validators.required, Validators.pattern(EnvVariable.patternOnlyNumbers), validationIsNumber(EnvVariable.maxAmount, EnvVariable.minAmount)]),
      'schemeMaxAmount': new FormControl('', [Validators.required, Validators.pattern(EnvVariable.patternOnlyNumbers), validationIsNumber(EnvVariable.maxAmount, EnvVariable.minAmount)]),
      'schemeAllowedRPG': new FormControl('', [Validators.required, validationIsNumber(99999999999999, 1)]),
      'schemeFieldVerifyApplicable' : new FormControl(false, [Validators.required]),
      'schemeFieldVerifyLimit': new FormControl(0, [Validators.pattern(EnvVariable.patternOnlyNumbers), validationIsNumber(EnvVariable.maxAmount, EnvVariable.minAmount)]),
      'schemeRepaymentType': new FormControl('', [Validators.required, Validators.pattern(EnvVariable.patternOnlyNumbers), validationIsNumber(EnvVariable.maxDropDown, EnvVariable.minDropDown)]),
      'schemeRefreshAllowed' : new FormControl(false, [Validators.required]),
      'schemeRefreshTo': new FormControl(false, [Validators.required, Validators.pattern(EnvVariable.patternOnlyNumbers), validationIsNumber(EnvVariable.maxDropDown, EnvVariable.minDropDown)]),
      'schemePrePaymentAllowed': new FormControl(false, [Validators.required]),
      'schemePreclosure': new FormControl(false, [Validators.required]),
      'schemeTakeOver': new FormControl(false, [Validators.required]),
      'schemeNewCustomers': new FormControl(false, [Validators.required]),
      'schemeDormantCustomers': new FormControl(false, [Validators.required]),
      'schemeNewBranch': new FormControl(false, [Validators.required]),
      'schemeMaxLoanAmount': new FormControl('', [Validators.required, Validators.pattern(EnvVariable.patternOnlyNumbers), validationIsNumber(EnvVariable.maxAmount, EnvVariable.minAmount)]),
      'schemeActiveLoan': new FormControl('', [Validators.required, Validators.pattern(EnvVariable.patternOnlyNumbers), validationIsNumber(1000000000, 1)]),
      'schemeBranchMaxLoanAmount': new FormControl('', [Validators.required, Validators.pattern(EnvVariable.patternOnlyNumbers), validationIsNumber(1000000000, 1)]),
      'schemeBranchActiveLoan': new FormControl('', [Validators.required, Validators.pattern(EnvVariable.patternOnlyNumbers), validationIsNumber(1000000000, 1)]),
      'schemeValidation': new FormControl('', [Validators.required, Validators.pattern(EnvVariable.patternStringAndNumber), validationIsNumber(100000, 1)]),
      'schemeChannelId': new FormControl('', [Validators.required, Validators.pattern(EnvVariable.patternOnlyNumbers), validationIsNumber(4, 0)]),
      'schemeGenderType': new FormControl('', [Validators.required]),
      'schemeCustomerType': new FormControl('', [Validators.required, Validators.pattern(EnvVariable.patternOnlyNumbers), validationIsNumber(1000, 0)])
    },{
      validator: [
        MinMaxNumber('schemeMinAge','schemeMaxAge'),
        MinMaxNumber('schemeMinTerm','schemeMaxTerm'),
        MinMaxNumber('schemeMinAmount','schemeMaxAmount'),
        MinMaxNumber('schemeBranchActiveLoan','schemeActiveLoan'),
        MinMaxNumber('schemeBranchMaxLoanAmount','schemeMaxLoanAmount')
      ]
    })
  }

  //formValueChanges
  private ifFormValueChanges() {
    this.formSchemeDetails.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => { });
  }

  //patch value to the form field
  public patchData(data: any) {
    try{
    this.formSchemeDetails.patchValue({
      schemeTransactionLabel: String(data.loanScheme.transactionLabel),
      schemeMinAge: Number(data.loanScheme.minAge),
      schemeMaxAge: Number(data.loanScheme.maxAge),
      schemeDurationType:Number(data.loanScheme.durationType),
      schemeMinTerm: Number(data.schemeLimit.minTerm),
      schemeMaxTerm: Number(data.schemeLimit.maxTerm),
      schemeMinAmount: Number(data.schemeLimit.minAmount),
      schemeMaxAmount: Number(data.schemeLimit.maxAmount),
      schemeAllowedRPG: Number(data.loanScheme.perGramRate),
      schemeFieldVerifyApplicable : Boolean(data.loanScheme.fieldVerificationApplicability),
      schemeFieldVerifyLimit: Number(data.loanScheme.fieldVerificationLimitAmt),
      schemeRepaymentType: Number(data.loanScheme.rePaymentTypeId),
      schemeRefreshAllowed: Number(data.loanScheme.topUpAllowed),
      schemeRefreshTo: Number(data.loanScheme.topUpSchemeId),
      schemePrePaymentAllowed: data.loanScheme.prePayment,
      schemePreclosure: Boolean(data.loanScheme.preclosure),
      schemeTakeOver: Boolean(data.loanScheme.takeOverLoansAllowed),
      schemeNewCustomers: Boolean(data.loanScheme.newCustomer),
      schemeDormantCustomers: Boolean(data.loanScheme.dormantCustomer),
      schemeNewBranch: Boolean(data.loanScheme.newBranch),
      schemeMaxLoanAmount: Number(data.loanScheme.maxLoanAmount),
      schemeActiveLoan: Number(data.loanScheme.activeLoansAllowed),
      schemeBranchMaxLoanAmount: Number(data.loanScheme.branchMaxLoanAmount),
      schemeBranchActiveLoan: Number(data.loanScheme.branchActiveLoansAllowed),
      schemeValidation: data.loanScheme.validateProcedure,
      schemeChannelId: Number(data.loanScheme.channelId),
      schemeGenderType: Number(data.customerGender.genderId),
      schemeCustomerType: Number(data.customerType.customerTypeId)
    });

    if(this.viewOnly) this.formSchemeDetails.disable();
  }catch(err){
    console.log('Something went wrong while patching data')
   }
  }

  //validation>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public getErrorMessage(controlName: string): string {
    return this.envFn.getFormError(this.formSchemeDetails, controlName);
  }

  //form submission
  public validateForm() {
    this.formSubmitted = true;

    if (this.formSchemeDetails.valid) {
// alert(this.formSchemeDetails.get('schemeGenderType')?.value)
      const formData = {
        loanScheme: {
          transactionLabel: String(this.formSchemeDetails.get('schemeTransactionLabel')?.value),
          minAge: Number(this.formSchemeDetails.get('schemeMinAge')?.value),
          maxAge: Number(this.formSchemeDetails.get('schemeMaxAge')?.value),
          newCustomer: Boolean(this.formSchemeDetails.get('schemeNewCustomers')?.value),
          dormantCustomer: Boolean(this.formSchemeDetails.get('schemeDormantCustomers')?.value),
          activeLoansAllowed: Number(this.formSchemeDetails.get('schemeActiveLoan')?.value),
          validateProcedure: String(this.formSchemeDetails.get('schemeValidation')?.value),
          maxLoanAmount: Number(this.formSchemeDetails.get('schemeMaxLoanAmount')?.value),
          branchMaxLoanAmount: Number(this.formSchemeDetails.get('schemeBranchMaxLoanAmount')?.value),
          branchActiveLoansAllowed: Number(this.formSchemeDetails.get('schemeBranchActiveLoan')?.value),
          fieldVerificationApplicability: Boolean(this.formSchemeDetails.get('schemeFieldVerifyApplicable')?.value),
          fieldVerificationLimitAmt: Number(this.formSchemeDetails.get('schemeFieldVerifyLimit')?.value),
          prePayment: Boolean(this.formSchemeDetails.get('schemePrePaymentAllowed')?.value),
          preclosure: Boolean(this.formSchemeDetails.get('schemePreclosure')?.value),
          rePaymentTypeId: Number(this.formSchemeDetails.get('schemeRepaymentType')?.value),
          perGramRate: Number(this.formSchemeDetails.get('schemeAllowedRPG')?.value),
          accountNumber: '',
          topUpAllowed : Boolean(this.formSchemeDetails.get('schemeRefreshAllowed')?.value),
          topUpSchemeId: Number(this.formSchemeDetails.get('schemeRefreshTo')?.value),
          takeOverLoansAllowed: Boolean(this.formSchemeDetails.get('schemeTakeOver')?.value),
          channelId: Number(this.formSchemeDetails.get('schemeChannelId')?.value),
          newBranch: Boolean(this.formSchemeDetails.get('schemeNewBranch')?.value),
          status: 0
        },
        schemeLimit: {
          durationType : Number(this.formSchemeDetails.get('schemeDurationType')?.value),
          minTerm: Number(this.formSchemeDetails.get('schemeMinTerm')?.value),
          maxTerm: Number(this.formSchemeDetails.get('schemeMaxTerm')?.value),
          minAmount: Number(this.formSchemeDetails.get('schemeMinAmount')?.value),
          maxAmount: Number(this.formSchemeDetails.get('schemeMaxAmount')?.value),
        },
        customerGender: {
          genderId: Number(this.formSchemeDetails.get('schemeGenderType')?.value),
        },
        customerType: {
          customerTypeId: Number(this.formSchemeDetails.get('schemeCustomerType')?.value),
        }
      }
      if(this.isTran) this.envFn.saveSchemeFormLiveData(1,formData);
      else this.envFn.saveSchemeFormTempdata(1, formData);
    }
  }
  public goToNextForm(){
    this.envFn.goToNextSchemeForm(1)
  }

}
