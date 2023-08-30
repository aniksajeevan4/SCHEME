import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { EnvFunction } from 'src/app/core/env/function/env-function';
import { SchemeFormService } from '../services/scheme-form.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.state';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { showLoader } from 'src/app/core/store/sharedStore/shared.action';
import {
  fetchSchemeFormStateOnContainer,
  fetchSchemeFormState_generalInfo,
  fetchedProductIdState,
} from 'src/app/core/store/schemeFormStore/schemeform.selectors';
import { validationIsNumber } from 'src/app/core/validation/is-number.validator';
import { EnvVariable } from 'src/app/core/env/variables/env-variable';
import { FromToDate } from 'src/app/core/validation/from-to-date.validator';
import { MinMaxNumber } from 'src/app/core/validation/min-max-number.validator';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CommonService } from 'src/app/core/env/common-services/common.service';
@Component({
  selector: 'app-scheme-form-details',
  templateUrl: './scheme-form-details.component.html',
  styleUrls: ['./scheme-form-details.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class SchemeFormDetailsComponent implements OnInit {
  //objects----------------
  public thisDay = new Date();
  private unsubscribe$: Subject<void> = new Subject<void>();

  //froms------------------
  public formSchemeDetails: FormGroup;
  public dropDownGL: any = [];
  public dropDownGenderType: any = [];
  public SecurityType:any=[]
  public dropDownCustomerType: any = [];
  public dropDownRePaymentType: any = [];
  public dropDownRefreshTo: any = [];
  public dropDownValidationType: any = [];
  public dropDownChannelType: any = [];
  public schemeValidationProcedure:any=[]
  public formSubmitted: boolean = false;
  allOptionValue = 0; // The value you want to use for the "All" option in the mat-select
  //variables--------------
  private fetchedProductId: number = 0;
  private fetchSchemeDetails: any;
  private schemeDetails: any;
  public isTran: boolean = false;
  public loadView: boolean = false;
  public durationTypeIds: any = [
    { id: 1, title: 'In Days' },
    { id: 2, title: 'In Months' },
  ];
  public viewOnly: boolean = false;
  public stringArray: any;
  public selectedGenderIds: any;
  public glCodeSearch: any = null;
  fetchedSchemeId: number;
  schemeRefreshToarray: any;
  Refreshtopatch: any;
  schemeId: number;
  valrefresh: boolean=false;

  constructor(
    private envFn: EnvFunction,
    private fb: FormBuilder,
    private comservice: CommonService,
    private commonService: SchemeFormService,
    private appStore: Store<AppState>,
    private http:SchemeFormService,
  ) {
    this.appStore.dispatch(showLoader({ status: true }));
  }

  //Life cycle functions--------------------------------------------------------------------------------------------------
  ngOnInit(): void {
    this.getStoreData();
    this.getRefreshTo();
    this.getGenderType();
    this.getCustomerType();
    this.getSecurityType();
    this.getPaymentTypeList();
    this.getChannelType();
    this.createForm();
    this.getSchemDetails();
    this.appStore.dispatch(showLoader({ status: false }));
    this.loadView = true;
    this.callOnCheckboxChange()
    this.getSchemeFormsViewData()
    this.getschemeValidationProcedure()
  }
  //store---------------------------------------------------------------------------------------------------------------
  //get store data
  getStoreData() {
    this.appStore.select(fetchedProductIdState).subscribe((data) => {
      this.fetchedProductId = data;
      console.log(this.fetchedProductId,'getstoredata2');
      
    });
  }
   getSchemeFormsViewData() {
    this.appStore
      .select(fetchSchemeFormStateOnContainer)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.fetchedSchemeId = data.fetchedSchemeId;  
      });
    }
  //get schemedetails from store and send data to patch the form
  private getSchemDetails() {
    try {
      this.appStore.select(fetchSchemeFormState_generalInfo).subscribe((data) => {
        (this.fetchSchemeDetails = data.fetchSchemeDetails),
          (this.schemeDetails = data.schemeDetails);
        this.isTran = data.isTran;
        this.viewOnly = data.viewOnly;
        console.log(this.schemeDetails,'this.schemeDetails');
        console.log(this.fetchSchemeDetails,'this.fetchSchemeDetails');
        if (this.schemeDetails) this.patchData(this.schemeDetails);
        else if (this.fetchSchemeDetails)
          this.patchData(this.fetchSchemeDetails);
      });
    } catch (error) {
      this.envFn.showResponseErrorMessage(
        'Something went wrong while fetching data from store'
      );
    }
  }
  //Service-------------------------------------------------------------------------------------
  //get GL Code data for listing>>>>>>>>>>>>>>>>>>
  private getGlList() {
    try {
      this.commonService
        .getGlCodeList()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (data: any) => {
            if (data.statusCode == 200) {
              this.dropDownGL = [];
              this.dropDownGL = data.result;
            } else
              this.envFn.showResponseErrorMessage(
                'something went wrong while fetching GL Code list'
              );
          },
          (error) => {
            this.envFn.showResponseErrorMessage(
              'something went wrong while fetching GL Code list'
            );
          }
        );
    } catch (error) {
      this.envFn.showResponseErrorMessage(
        'something went wrong while fetching GL Code list'
      );
    }
  }
  //get security Type Dropdown>>>>>>>>>>>>>>>>>>
  private getSecurityType() {
    try {
      this.commonService
        .getSecurityType()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (data: any) => {
            if (data.statusCode == 200) {
              this.SecurityType = [];
              this.SecurityType = data.result;
              console.log(this.SecurityType,'this.SecurityType');
              
            } else
              this.envFn.showResponseErrorMessage(
                'something went wrong while fetching gender list'
              );
          },
          (error) => {
            this.envFn.showResponseErrorMessage(
              'something went wrong while fetching gender list'
            );
          }
        );
    } catch (error) {
      this.envFn.showResponseErrorMessage(
        'something went wrong while fetching gender list'
      );
    }
  }
  //get Channel types for listing>>>>>>>>>>>>>>>>>>
  private getGenderType() {
    try {
      this.commonService
        .getGenderList()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (data: any) => {
            if (data.statusCode == 200) {
              this.dropDownGenderType = [];
              this.dropDownGenderType = data.result;
            } else
              this.envFn.showResponseErrorMessage(
                'something went wrong while fetching gender list'
              );
          },
          (error) => {
            this.envFn.showResponseErrorMessage(
              'something went wrong while fetching gender list'
            );
          }
        );
    } catch (error) {
      this.envFn.showResponseErrorMessage(
        'something went wrong while fetching gender list'
      );
    }
  }

  //get Channel types for listing>>>>>>>>>>>>>>>>>>
  private getCustomerType() {
    try {
      this.commonService
        .getCustomerTypeList()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (data: any) => {
            if (data.statusCode == 200) {
              this.dropDownCustomerType = [];
               this.dropDownCustomerType = [{ id: 0, description: 'All' }].concat(
                data.result);
                console.log(this.dropDownCustomerType,'this.dropDownCustomerType');
                
            } else
              this.envFn.showResponseErrorMessage(
                'something went wrong while fetching Customer type list'
              );
          },
          (error) => {
            this.envFn.showResponseErrorMessage(
              'something went wrong while fetching Customer type list'
            );
          }
        );
    } catch (error) {
      this.envFn.showResponseErrorMessage(
        'something went wrong while fetching Customer type list'
      );
    }
  }
  //get payment type data for listing>>>>>>>>>>>>>>>>>>
  private getPaymentTypeList() {
    try {
      this.commonService
        .getRePaymentTypeList()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (data: any) => {
            if (data.statusCode == 200) {
              this.dropDownRePaymentType = [];
              this.dropDownRePaymentType = data.result;
            } else
              this.envFn.showResponseErrorMessage(
                'something went wrong while fetching re-payment type list'
              );
          },
          (error) => {
            this.envFn.showResponseErrorMessage(
              'something went wrong while fetching re-payment type list'
            );
          }
        );
    } catch (error) {
      this.envFn.showResponseErrorMessage(
        'something went wrong while fetching re-payment type list'
      );
    }
  }

  //get payment type data for listing>>>>>>>>>>>>>>>>>>
  private getRefreshTo() {
    try {
      this.dropDownRefreshTo = [];
      this.comservice
        .getSchemeList('false',this.fetchedProductId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(          
          (data: any) => {
           if (data.statusCode == 200)
              this.dropDownRefreshTo = [
                { schemeId: 0, schemeCode: 'Same Scheme' },
              ].concat(data.result);
            else
              this.envFn.showResponseErrorMessage(
                'something went wrong while fetching schemes'
              );
          },
          (err) => {
            this.envFn.showResponseErrorMessage(
              'something went wrong while fetching schemes for refresh'
            );
          }
        );
    } catch (error) {
      this.envFn.showResponseErrorMessage(
        'something went wrong while fetching schemes for refresh'
      );
    } 
  }


  //get Channel types for listing>>>>>>>>>>>>>>>>>>
  private getChannelType() {
    try {
      this.commonService
        .getChannelTypeList()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (data: any) => {
            if (data.statusCode == 200) {
              this.dropDownChannelType = [];
              this.dropDownChannelType = data.result;
            } else
              this.envFn.showResponseErrorMessage(
                'something went wrong while fetching Channel Type list'
              );
          },
          (error) => {
            this.envFn.showResponseErrorMessage(
              'something went wrong while fetching Channel Type list'
            );
          }
        );
    } catch (error) {
      this.envFn.showResponseErrorMessage(
        'something went wrong while fetching Channel Type list'
      );
    }
  }

  //form----------------------------------------------------------------------------------------------------------------

  //form declaration>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  onlySpacesValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value && value.trim().length === 0) {
        return { containsOnlySpaces: true };
      }
      return null;
    };
  }


  private createForm(): void {
    this.formSchemeDetails = this.fb.group(
      {     
        securityType: new FormControl('', [
          Validators.required
           ]),
        schemeStart: new FormControl(new Date(), [Validators.required]),
        schemeEnd: new FormControl('', [Validators.required]),
        schemeMinAge: new FormControl(18, [
          Validators.required,
          Validators.pattern(EnvVariable.patternOnlyNumbers),
          validationIsNumber(EnvVariable.maxAge, EnvVariable.minAge),
        ]),
        schemeMaxAge: new FormControl(null,[
          Validators.required,
          Validators.pattern(EnvVariable.patternOnlyNumbers),
          validationIsNumber(EnvVariable.maxAge, EnvVariable.minAge),
        ]),

        schemeFieldVerifyApplicable: new FormControl(false, [
          Validators.required,
        ]),
        schemeFieldVerifyLimit: new FormControl(0, [
          Validators.pattern(EnvVariable.patternOnlyNumbers),
        ]),
        schemeRepaymentType: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternOnlyNumbers),
          validationIsNumber(EnvVariable.maxDropDown, EnvVariable.minDropDown),
        ]),
        schemeRefreshAllowed: new FormControl(false, [Validators.required]),
        schemeRefreshTo: new FormControl(false, [
          validationIsNumber(EnvVariable.maxDropDown, EnvVariable.minDropDown),
        ]),
        schemePrePaymentAllowed: new FormControl(false, [Validators.required]),
        PrePaymentPenalty:new FormControl('', [Validators.required, Validators.max(100)]),
        schemePreclosure: new FormControl(false, [Validators.required]),
        PreclosurePenalty:new FormControl('', [Validators.required, Validators.max(100)]),
        schemeTakeOver: new FormControl(false, [Validators.required]),
        schemeNewCustomers: new FormControl(false, [Validators.required]),
        schemeDormantCustomers: new FormControl(false, [Validators.required]),
        schemeNewBranch: new FormControl(false, [Validators.required]),
        schemeMaxLoanAmount: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patterncurrency),
        ]),
        schemeActiveLoan: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternOnlyNumbers),
          validationIsNumber(100000000, 1),
        ]),
        schemeBranchMaxLoanAmount: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patterncurrency),

        ]),
        schemeBranchActiveLoan: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternOnlyNumbers),
          validationIsNumber(100000000, 1),
        ]),
        schemeValidation: new FormControl('', [
          Validators.pattern(EnvVariable.patternStringAndNumber),
        ]),
        schemeChannelId: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternOnlyNumbers),
          validationIsNumber(4, 0),
        ]),
        schemeGenderType: new FormControl('', [Validators.required]),
        schemeCustomerType: new FormControl('', [Validators.required]),
        durationTypeId: new FormControl(1, [Validators.required]),
        maxTerm: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternOnlyNumbers),
        ]),
        minAmount: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternOnlyNumbers),
          // validationIsNumber(EnvVariable.maxAmount, EnvVariable.minAmount),
        ]),
        maxAmount: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternOnlyNumbers),
          // validationIsNumber(EnvVariable.maxAmount, EnvVariable.minAmount),
        ]),
        perGramRate: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternDecimalPoints),
          Validators.max(100),
        ]),
        
      },
      {
        validator: [
          FromToDate('schemeStart','schemeEnd'),
          MinMaxNumber('schemeMinAge', 'schemeMaxAge'),
          MinMaxNumber('schemeBranchActiveLoan', 'schemeActiveLoan'),
          MinMaxNumber('schemeBranchMaxLoanAmount','schemeMaxLoanAmount'),
        ],
      }
    );
  }
  //get schemeValidation 
  private getschemeValidationProcedure(){
    this.http.getProcedure(0).subscribe((res: any) => {
      this.schemeValidationProcedure = res.result;      
    });
   }
  //gl searchable key event
  public keyup(event: any) {   
    this.formSubmitted=true     
    if (event.target.value.length >= 1) {
      this.dropDownGL = [];
      this.commonService
        .getSearchGlCodeList(event.target.value)
        .subscribe((res: any) => {
          this.dropDownGL = res.result;
        });

    } else {
      this.dropDownGL=[]
    }
  }
  //patch value to the form field
  private patchData(data: any) {
    // if(!data.loanScheme.topUpAllowed){
    //   this.formSchemeDetails.get('schemeRefreshTo')?.disable()
    //   this.formSchemeDetails.get('schemeRefreshTo')?.setValue('')
    // }
    // if(data.loanScheme.topUpAllowed)
    // this.formSchemeDetails.get('schemeRefreshTo')?.enable()
    if(!data.loanScheme.prePayment)
    {
      this.formSchemeDetails.get('PrePaymentPenalty')?.disable()
      this.formSchemeDetails.get('PrePaymentPenalty')?.setValue('')
    }
    if(data.loanScheme.prePayment)
    {
      this.formSchemeDetails.get('PrePaymentPenalty')?.enable()
    }

    if(!data.loanScheme.preClosure)
    {
      this.formSchemeDetails.get('PreclosurePenalty')?.disable()
      this.formSchemeDetails.get('PreclosurePenalty')?.setValue('')
    }
    if(data.loanScheme.preClosure)
    {
      this.formSchemeDetails.get('PreclosurePenalty')?.enable()
    }
    if(this.viewOnly)
    {
      this.formSchemeDetails.get('schemeRefreshTo')?.disable()
      this.formSchemeDetails.get('PrePaymentPenalty')?.disable()
      this.formSchemeDetails.get('PreclosurePenalty')?.disable()

    } 
    // try {
      let updatedCustomerGender: any[] = [];
      if (Array.isArray(data.customerGender)) {
        updatedCustomerGender = data.customerGender.map(
          (gender: { genderId: { toString: () => any } }) =>
            gender.genderId.toString()
        );
      }
      let updatedCustomerType: any[] = [];
      if (Array.isArray(data.customerType)) {
        updatedCustomerType = data.customerType.map(
          (customerType: { customerTypeId: { toString: () => any } }) =>
            customerType.customerTypeId.toString()
        );
      }
      console.log(data,'hkgjkfjfkjfsecurityType');
      let updatedSecurityType: any[] = [];
      if (Array.isArray(data.securityType)) {
        updatedSecurityType = data.securityType.map(
          (securityType: { securityTypeId: { toString: () => any } }) =>
          securityType.securityTypeId.toString(),
      );
      }
      // let accountId = data.loanScheme.accountId
      // let transactionLabel = data.loanScheme.transactionLabel
      // this.dropDownGL = [{ accountId: Number(accountId), transactionLabel: transactionLabel}];
      // if(this.schemeDetails){         
      // this.formSchemeDetails.get("schemeTransactionLabel")?.setValue(this.dropDownGL[0].accountId);
      //   this.formSchemeDetails.patchValue({
      //     schemeName: String(data.loanScheme.name),
      //     schemeDescription: String(data.loanScheme.description),
      //   });
      // }
      // if(this.schemeDetails && this.schemeDetails.loanScheme.schemeId!=0){ 
      //   this.formSchemeDetails.get("schemeName")?.disable() 
      // } 
      
      // if(data.loanScheme.topUpAllowed && data.loanScheme.topUpSchemeId) 
      // {
      //   const strings = data.loanScheme.topUpSchemeId.map((num: any) => String(num));
      //   this.formSchemeDetails.controls['schemeRefreshTo'].setValue(
      //    strings,
      //   );
      // }
       this.formSchemeDetails.patchValue({
        schemeStart: data.loanScheme.startDate,
        schemeEnd: data.loanScheme.endDate,
        schemeMinAge: Number(data.loanScheme.minAge),
        schemeMaxAge: Number(data.loanScheme.maxAge),
        schemeFieldVerifyApplicable: Boolean(
          data.loanScheme.fieldVerificationApplicability
        ),
        schemeFieldVerifyLimit: Number(
          data.loanScheme.fieldVerificationLimitAmt
        ),
        schemeRepaymentType: Number(data.loanScheme.rePaymentTypeId),
        // schemeRefreshAllowed: Number(data.loanScheme.topUpAllowed),
        schemePrePaymentAllowed: Boolean(data.loanScheme.prePayment),
        PrePaymentPenalty:Number(data.loanScheme.prePaymentPenalty),
        schemePreclosure: Boolean(data.loanScheme.preClosure),
        PreclosurePenalty:Number(data.loanScheme.preclosurePenalty),
        schemeTakeOver: Boolean(data.loanScheme.takeOverLoansAllowed),
        schemeNewCustomers: Boolean(data.loanScheme.newCustomer),
        schemeDormantCustomers: Boolean(data.loanScheme.dormantCustomer),
        schemeNewBranch: Boolean(data.loanScheme.newBranch),
        schemeMaxLoanAmount: Number(data.loanScheme.maxLoanAmount),
        schemeActiveLoan: Number(data.loanScheme.activeLoansAllowed),
        schemeBranchMaxLoanAmount: Number(data.loanScheme.branchMaxLoanAmount),
        schemeBranchActiveLoan: Number(
          data.loanScheme.branchActiveLoansAllowed
        ),
        schemeChannelId: Number(data.loanScheme.channelId),
        schemeGenderType: updatedCustomerGender,
        schemeCustomerType: updatedCustomerType,
        schemeValidation: 
          (data.loanScheme.validateProcedureId),
       durationTypeId: Number(data.schemeLimitDefDetails.durationTypeId),
       maxTerm: Number(data.schemeLimitDefDetails.maxTerm),
       minAmount: Number(data.schemeLimitDefDetails.minAmount),
       maxAmount: Number(data.schemeLimitDefDetails.maxAmount),
       perGramRate: Number(data.schemeLimitDefDetails.perGramRate),
       securityType:updatedSecurityType
      });
      if (this.viewOnly) this.formSchemeDetails.disable();
 }

  //validation>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public getErrorMessage(controlName: string): string {
    return this.envFn.getFormError(this.formSchemeDetails, controlName);
  }

  //submit form
  public submitForm() { }
  //form submission
  public validateForm() {
    this.formSubmitted = true;
    if (this.formSchemeDetails.valid) {     
      // if (this.formSchemeDetails.get('schemeRefreshTo')?.value) {
      //   const array = this.formSchemeDetails.get('schemeRefreshTo')?.value;
      //   this.schemeRefreshToarray = array.map((str: string) => Number(str));
      // }
      if(this.isTran)
      { 
         this.schemeId=this.schemeDetails.loanScheme.schemeId
      }
      else
      {
        this.schemeId=0
      }     
    const formData = {
      loanScheme: {
        productId: Number(this.fetchedProductId),
        startDate: this.envFn.formattedDate(this.formSchemeDetails.get('schemeStart')?.value),
        endDate:  this.envFn.formattedDate(this.formSchemeDetails.get('schemeEnd')?.value),
        minAge: Number(this.formSchemeDetails.get('schemeMinAge')?.value),
        maxAge: Number(this.formSchemeDetails.get('schemeMaxAge')?.value),
        newCustomer: Boolean(
          this.formSchemeDetails.get('schemeNewCustomers')?.value
        ),
        dormantCustomer: Boolean(
          this.formSchemeDetails.get('schemeDormantCustomers')?.value
        ),
        activeLoansAllowed: Number(
          this.formSchemeDetails.get('schemeActiveLoan')?.value
        ), 
        maxLoanAmount: Number(
          this.formSchemeDetails.get('schemeMaxLoanAmount')?.value
        ),
        branchMaxLoanAmount: Number(
          this.formSchemeDetails.get('schemeBranchMaxLoanAmount')?.value
        ),
        branchActiveLoansAllowed: Number(
          this.formSchemeDetails.get('schemeBranchActiveLoan')?.value
        ),
        fieldVerificationApplicability: Boolean(
          this.formSchemeDetails.get('schemeFieldVerifyApplicable')?.value
        ),
        fieldVerificationLimitAmt: Number(
          this.formSchemeDetails.get('schemeFieldVerifyLimit')?.value
        ),
        prePayment: Boolean(
          this.formSchemeDetails.get('schemePrePaymentAllowed')?.value
        ),
        prePaymentPenalty: Number(
          this.formSchemeDetails.get('PrePaymentPenalty')?.value
        ),
        preClosure: Boolean(
          this.formSchemeDetails.get('schemePreclosure')?.value
        ),
        preclosurePenalty: Number(
          this.formSchemeDetails.get('PreclosurePenalty')?.value
        ),
        rePaymentTypeId: Number(
          this.formSchemeDetails.get('schemeRepaymentType')?.value
        ),
        //   topUpAllowed: Boolean(
        //   this.formSchemeDetails.get('schemeRefreshAllowed')?.value
        // ),
        // topUpSchemeId:(this.schemeRefreshToarray),
        takeOverLoansAllowed: Boolean(
          this.formSchemeDetails.get('schemeTakeOver')?.value
        ),
        channelId: Number(this.formSchemeDetails.get('schemeChannelId')?.value),
        newBranch: Boolean(
          this.formSchemeDetails.get('schemeNewBranch')?.value
        ),
        validateProcedureId:Number(this.formSchemeDetails.get('schemeValidation')?.value),
        status: 0,
      },
        customerGender: this.formSchemeDetails
        .get('schemeGenderType')
        ?.value.map((id: any) => ({ genderId: parseInt(id) })),
      customerType: this.formSchemeDetails
        .get('schemeCustomerType')
        ?.value.map((id: any) => ({ customerTypeId: parseInt(id) })),
        securityType: this.formSchemeDetails
        .get('securityType')
        ?.value.map((securityTypeId: any) => ({ securityTypeId: parseInt(securityTypeId),securityDefId:0 })),
          schemeLimitDefDetails: {
          limitDefId:0,
          durationTypeId: Number(
            this.formSchemeDetails.get('durationTypeId')?.value
          ),
          durationType:this.envFn.getDescriptionById(this.durationTypeIds,'id',this.formSchemeDetails.get('durationTypeId')?.value,'title')
          ,
          maxTerm:Number(this.formSchemeDetails.get('maxTerm')?.value
          ),
          minAmount: Number(this.formSchemeDetails.get('minAmount')?.value),
          maxAmount: Number(this.formSchemeDetails.get('maxAmount')?.value),       
          perGramRate: Number(
            this.formSchemeDetails.get('perGramRate')?.value
          ),  
        },           
    };
    if (this.isTran) this.envFn.saveSchemeFormLiveData(2, formData);
    else this.envFn.saveSchemeFormTempdata(2, formData);
    }
  }
  onCheckboxChange(event: MatCheckboxChange): void {
  const checkboxValue = event.checked;
   if(checkboxValue)
   this.formSchemeDetails.get('schemeRefreshTo')?.enable()
  this.valrefresh=true;
   if(!checkboxValue){
    this.formSchemeDetails.get('schemeRefreshTo')?.disable()
    this.formSchemeDetails.get('schemeRefreshTo')?.setValue('')
  }
  if(this.viewOnly){
    this.formSchemeDetails.get('schemeRefreshTo')?.disable()
  }
  }
   onschemePreclosureChange(event: any) {
    const checkboxValue = event.checked;
    if(checkboxValue)
    this.formSchemeDetails.get('PreclosurePenalty')?.enable()
    if(!checkboxValue){
     this.formSchemeDetails.get('PreclosurePenalty')?.disable()
     this.formSchemeDetails.get('PreclosurePenalty')?.setValue('')
   }
   if(this.viewOnly){
     this.formSchemeDetails.get('PreclosurePenalty')?.disable()
   }
  }
  onschemePrePaymentChange(event: any) {
    const checkboxValue = event.checked;
    if(checkboxValue)
    this.formSchemeDetails.get('PrePaymentPenalty')?.enable()
    if(!checkboxValue){
     this.formSchemeDetails.get('PrePaymentPenalty')?.disable()
     this.formSchemeDetails.get('PrePaymentPenalty')?.setValue('')
   }
   if(this.viewOnly){
     this.formSchemeDetails.get('PrePaymentPenalty')?.disable()
   }
  }

  callOnCheckboxChange(): void {
    const checkboxValue = this.formSchemeDetails.get('schemeRefreshAllowed')?.value;
    const event = { checked: checkboxValue } as MatCheckboxChange;
    const preclosurePenalty= { checked: this.formSchemeDetails.get('schemePreclosure')?.value } as MatCheckboxChange;
    const prePaymentPenalty= { checked: this.formSchemeDetails.get('schemePrePaymentAllowed')?.value } as MatCheckboxChange;
    this.onCheckboxChange(event);
    this.onschemePreclosureChange(preclosurePenalty)
    this.onschemePrePaymentChange(prePaymentPenalty)
  }

  public searchGlCode(event: any) {
    let glCode = event.target.value;
    let length = event.target.value.length;
    if (length > 3 && this.formSchemeDetails.get('schemeName')?.valid) {
      this.commonService
        .searchGlCode(glCode)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res: any) => {
          if (res.statusCode == 200) {
            if (res.result == 'true') {
              this.formSchemeDetails.get('hideCheckbox')?.setValidators([Validators.required]);
              this.formSchemeDetails.get('hideCheckbox')?.updateValueAndValidity();
            } else {
              this.formSchemeDetails.get('hideCheckbox')?.clearValidators();
              this.formSchemeDetails.get('hideCheckbox')?.updateValueAndValidity();
            }
            this.glCodeSearch = res;
          }

        }); this.formSchemeDetails.get('hideCheckbox')?.clearValidators();
      this.formSchemeDetails.get('hideCheckbox')?.updateValueAndValidity();
    } else {
      this.glCodeSearch = '';
    }
  }
  //Clear value of Field Verfication Amount if checkbox unchecked
  FieldVerficationClear(event: any) {
    if (!this.formSchemeDetails.get('schemeFieldVerifyApplicable')?.value) {
      this.formSchemeDetails.get('schemeFieldVerifyLimit')?.setValue(0)
      this.formSchemeDetails.get('schemeFieldVerifyLimit')?.clearValidators();
      this.formSchemeDetails.get('schemeFieldVerifyLimit')?.updateValueAndValidity();
    }
  }
  public goToNextForm() {
    this.envFn.goToNextSchemeForm(2);
  }

  ngOnDestroy(): void {
    this.unsubscribe$;
  }
}
