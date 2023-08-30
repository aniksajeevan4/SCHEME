import { fetchSchemeFormState_generalInfo } from './../../../core/store/schemeFormStore/schemeform.selectors';
import { Component, OnInit } from '@angular/core';
import { EnvFunction } from 'src/app/core/env/function/env-function';
import { SchemeService } from '../../scheme/services/scheme.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SchemeFormService } from '../services/scheme-form.service';
import { AppState } from 'src/app/core/store/app.state';
import { Store } from '@ngrx/store';
import { showLoader } from 'src/app/core/store/sharedStore/shared.action';
import { fetchedProductIdState } from 'src/app/core/store/schemeFormStore/schemeform.selectors';
import { EnvVariable } from 'src/app/core/env/variables/env-variable';
import { validationIsString } from 'src/app/core/validation/is-string.validator';
import { FromToDate } from 'src/app/core/validation/from-to-date.validator';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-scheme-form-main-details',
  templateUrl: './scheme-form-main-details.component.html',
  styleUrls: ['./scheme-form-main-details.component.scss']
})
export class SchemeFormMainDetailsComponent implements OnInit {

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
    this.getStoreData();
    this.createForm();
    this.getSchemDetails();
    this.ifFormValueChanges();
    this.appStore.dispatch(showLoader({ status: false }));
    this.loadView = true;
  }

  //store---------------------------------------------------------------------------------------------------------------
  //get store data
  getStoreData() {
    this.appStore.select(fetchedProductIdState).subscribe((data) => { this.fetchedProductId = data })
  }

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

  //form----------------------------------------------------------------------------------------------------------------

  //form declaration>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  private createForm(): void {
    this.formSchemeDetails = this.fb.group({
      'schemeName': new FormControl('', [Validators.required, Validators.pattern(EnvVariable.patternStringAndNumber), validationIsString(EnvVariable.maxNameCharacter, EnvVariable.minNameCharacter)]),
      'schemeDescription': new FormControl('', [Validators.required, Validators.pattern(EnvVariable.patternStringAndNumber), validationIsString(EnvVariable.maxDescription, EnvVariable.minDescription)]),
      'schemeStart': new FormControl(new Date(), [Validators.required]),
      'schemeEnd': new FormControl('', [Validators.required]),
    },{
      validator: [
        FromToDate('schemeStart','schemeEnd'),
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
      schemeName: String(data.loanScheme.name),
      schemeDescription: String(data.loanScheme.description),
      schemeStart: data.loanScheme.startDate,
      schemeEnd: data.loanScheme.endDate,
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
          schemeId: 0,
          name: String(this.formSchemeDetails.get('schemeName')?.value).trim(),
          schemeCode : '',
          description: String(this.formSchemeDetails.get('schemeDescription')?.value).trim(),
          productId: Number(this.fetchedProductId),
          startDate: this.formSchemeDetails.get('schemeStart')?.value,
          endDate: this.formSchemeDetails.get('schemeEnd')?.value,
          status: 0
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
