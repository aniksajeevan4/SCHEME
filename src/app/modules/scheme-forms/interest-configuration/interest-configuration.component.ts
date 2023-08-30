import { getSchemeDetails } from './../../../core/store/schemeStore/scheme.action';

import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EnvFunction } from 'src/app/core/env/function/env-function';
import { SchemeFormService } from '../services/scheme-form.service';
import { EnvVariable } from 'src/app/core/env/variables/env-variable';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.state';
import { fetchFetchedSchemeFormState_intrest_Config } from 'src/app/core/store/schemeFormStore/schemeform.selectors';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';
import { MatFormFieldDefaultOptions } from '@angular/material/form-field';

@Component({
  selector: 'app-interest-configuration',
  templateUrl:'./interest-configuration.component.html',
  styleUrls: ['./interest-configuration.component.scss'],
})
export class InterestConfigurationComponent implements OnInit {
  //objects----------------
  public thisDay = new Date();

  //froms------------------
  public InterestConfigForm: FormGroup;
  public InterestTypeList: any=[];
  public interestComputationType:any=[];
  public interestFrequency:any=[];
  public interestBasis:any=[];
  public interestcalculationtype:any=[];
  public subhead:any=[];
  public SchemeInterestDefinition:any=[]
  public TransactionLabel:any=[]
 public fetchInterestConfiguration:any=[]
 public InterestcalculationProcedure:any=[]

  //variables----------------
  private fetchSchemeDetails: any;
  private schemeDetails: any;
  public isTran: boolean = false;
  public submitted:any=false;
  public viewOnly:boolean=false;
  public TodayDate: string = new Date().toISOString().split('T')[0];
   matFormFieldDefaultOptions: MatFormFieldDefaultOptions = {
    hideRequiredMarker: true
  };
  //constructor---------------
  constructor(private fb: FormBuilder,private envFn : EnvFunction,private http: SchemeFormService,private appStore: Store<AppState>
    ) {
      // this.appStore.dispatch(showLoader({ status: true }));
    }
  //Life cycle functions--------------------------------------------------------------------------------------------------
  ngOnInit(): void {
    this.CreateInterestConfigForm();
    this.getinteresttype();
    this.getinterestComputationType();
    this.getfrequency()
    this.getinterestbasis()
    this.getinterestcalculationtype()
    this.getTransactionLabel()
    this.getSchemDetails()
    this.Formdisable()
    this.ifFormValueChanges()
    this.getInterestcalculationProcedure()

    }
  //form----------------------------------------------------------------------------------------------------------------

  //form declaration>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  private CreateInterestConfigForm(): void {
    this.InterestConfigForm = this.fb.group({       
      EffetivefromDate: new FormControl(new Date(), [Validators.required]),
      interestComputationType: new FormControl('', [Validators.required]),
      interestType: new FormControl('', [Validators.required]),
      interestComputationFrequencyAccrued:new FormControl('',[Validators.required]),
      MinDays:new FormControl('', [Validators.required,Validators.pattern(EnvVariable.patternOnlyNumbersnospace)]),
      MinAmount:new FormControl('', [Validators.required,Validators.pattern(EnvVariable.patterncurrency)]),
      RoundingRule:new FormControl('', [Validators.required,Validators.pattern(EnvVariable.patternOnlyNumbersnospace),Validators.max(5)]),
      InterestcalculationProcedure:new FormControl('', [Validators.required,Validators.pattern(EnvVariable.patternAlphaNumernospace)]),
      interestBasis:new FormControl('', [Validators.required]),

      interestBooking:new FormControl('', [Validators.required]),
      interestBookingFrequency:new FormControl('',[Validators.required]),
      TransactionLabelBooking:new FormControl('', [Validators.required]),
      chkReversibleBooking:new FormControl(false),

      interestApplication:new FormControl('', [Validators.required]),
      interestApplicationFrequency:new FormControl('', [Validators.required]),    
      TransactionLabelApplication:new FormControl('', [Validators.required]),
   },
  );
}


  //get schemedetails from store and send data to patch the form
  private getSchemDetails() {
    try{
    this.appStore.select(fetchFetchedSchemeFormState_intrest_Config).subscribe((data) => {
     this.schemeDetails = data.schemeDetails
      this.isTran = data.isTran
      this.viewOnly=data.viewOnly
      if (this.schemeDetails) this.patchData(this.schemeDetails)
      else if (this.fetchSchemeDetails) this.patchData(this.fetchSchemeDetails);
    });
  }
  catch(error){
    this.envFn.showResponseErrorMessage('Something went wrong while fetching data from store')
  }
  }
  //patch value to the form field
  public patchData(data: any) {
    try{
    this.InterestConfigForm.patchValue({
      EffetivefromDate: String(data.fromDate),
      interestType: Number(data.interestTypeId),
      interestComputationType: String(data.interestComputationTypeId),
      interestComputationFrequencyAccrued: Number(data.interestComputationFrequencyId),
      MinDays: String(data.minDays),
      MinAmount: Number(data.minAmount),
      interestBasis: String(data.interestNumberOfDaysPerYear),
      RoundingRule: Number(data.roundingRule),
      InterestcalculationProcedure: String(data.procedureId),
      chkReversibleBooking:Boolean(data.isInterestBookingReversible),

      interestBooking: String(data.schemeInterestAccount[0].stageId),
      interestBookingFrequency: Number(data.schemeInterestAccount[0].frequencyId),
      TransactionLabelBooking: String(data.schemeInterestAccount[0].accountId),
      isInterestBookingReversible: Number(data.schemeInterestAccount[0].Reversible),
      
      interestApplication: String(data.schemeInterestAccount[1].stageId),
      interestApplicationFrequency: Number(data.schemeInterestAccount[1].frequencyId),
      TransactionLabelApplication: String(data.schemeInterestAccount[1].accountId),
    });
  }catch(err){
    console.log('Something went wrong while patching data')
   }
  }

  //Disable form on view mode
  private Formdisable()
  {
   if(this.viewOnly) 
   {
    this.InterestConfigForm.disable()
   }
  }
  //get Interest types for listing>>>>>>>>>>>>>>>>>>
  private getinteresttype() {
    this.http.getinteresttype().subscribe((res: any) => {
      this.InterestTypeList = res.result;
    });
  }
  //get Interest interestComputationType types for listing>>>>>>>>>>>>>>>>>>
  private getinterestComputationType(){
    this.http.getinterestComputationtype().subscribe((res: any) => {
      this.interestComputationType = res.result;
  });
}  
  //get interest Computation Frequency for listing>>>>>>>>>>>>>>>>>>
  private getfrequency(){ 
    this.http.getfrequency().subscribe((res: any) => {
      this.interestFrequency = res.result;
  });
  }
  //get SubHead for listing>>>>>>>>>>>>>>>>>>
  // private getsubhead(){
  //   this.http.getsubhead().subscribe((res: any) => {
  //     this.subhead = res.result;
  // });
  // }

  //get TransactionLabel
    private getTransactionLabel(){
    this.http.getTransactionLabel().subscribe((res: any) => {
      this.TransactionLabel = res.result;     
  });
  }

//get interestBasis
  private getinterestbasis(){
    this.http.getinterestbasis().subscribe((res: any) => {
      this.interestBasis = res.result;
    });
   } 
   //Get InterestcalculationProcedure 
   private getInterestcalculationProcedure(){
    this.http.getProcedure(1).subscribe((res: any) => {
      this.InterestcalculationProcedure = res.result;
      
    });
   }
    //get interest Computation Frequency for listing>>>>>>>>>>>>>>>>>>
    private getinterestcalculationtype(){
  
      this.http.getinterestcalculationtype().subscribe((res: any) => {
        this.interestcalculationtype = res.result;
        this.InterestConfigForm.controls['interestBooking'].setValue(this.interestcalculationtype[0]?.id);
        this.InterestConfigForm.controls['interestApplication'].setValue(this.interestcalculationtype[1]?.id);
    });
    }
//Submit Form
public Submit()
{
  this.submitted=true
  if(this.InterestConfigForm.valid)
{
  const schemeInterestAccount = [
    {
      stageId:this.InterestConfigForm.get('interestBooking')?.value,
      frequencyId:this.InterestConfigForm.get('interestBookingFrequency')?.value,
      accountId: this.InterestConfigForm.get('TransactionLabelBooking')?.value,
      status: '0'
    },
    {
      stageId:this.InterestConfigForm.get('interestApplication')?.value,
      frequencyId:this.InterestConfigForm.get('interestApplicationFrequency')?.value,
      accountId: this.InterestConfigForm.get('TransactionLabelApplication')?.value,
      status: '0'
    }
  ];
 this.SchemeInterestDefinition={
    fromDate: this.envFn.formattedDate(this.InterestConfigForm.get('EffetivefromDate')?.value),
    interestTypeId: this.InterestConfigForm.get('interestType')?.value,
    interestComputationTypeId: this.InterestConfigForm.get('interestComputationType')?.value,
    interestComputationFrequencyId: this.InterestConfigForm.get('interestComputationFrequencyAccrued')?.value,
    minDays: this.InterestConfigForm.get('MinDays')?.value,
    minAmount: this.InterestConfigForm.get('MinAmount')?.value,
    interestNumberOfDaysPerYear: this.InterestConfigForm.get('interestBasis')?.value,
    roundingRule: this.InterestConfigForm.get('RoundingRule')?.value,
    procedureId: this.InterestConfigForm.get('InterestcalculationProcedure')?.value,
    procedureName:this.envFn.getDescriptionById(this.InterestcalculationProcedure,'id', this.InterestConfigForm.get('InterestcalculationProcedure')?.value,'description'),
    isInterestBookingReversible:this.InterestConfigForm.get('chkReversibleBooking')?.value,
    schemeInterestAccount:schemeInterestAccount
    }
  
  if(this.isTran) this.envFn.saveSchemeFormLiveData(4,this.SchemeInterestDefinition);
  else this.envFn.saveSchemeFormTempdata(4, this.SchemeInterestDefinition);
 }
}

public goToNextForm(){
  this.envFn.goToNextSchemeForm(4)
}
//validation>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public getErrorMessage(controlName: string): string {
    return this.envFn.getFormError(this.InterestConfigForm, controlName);
  }

  public ifFormValueChanges() {
    // this.InterestConfigForm.statusChanges.pipe(
    //   distinctUntilChanged(),
    //   takeUntil(this.unsubscribe$)
    // ).subscribe(() => { 
    //   if (this.InterestConfigForm.dirty) {
    //     this.appStore.dispatch(disableOtherForms({ formId:3 }));
    //   }
    // });
  }
  private unsubscribe$: Subject<void> = new Subject<void>();

}
