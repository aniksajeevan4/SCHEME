import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from 'src/app/core/env/common-services/common.service';
import { EnvFunction } from 'src/app/core/env/function/env-function';
import { AppState } from 'src/app/core/store/app.state';
import { fetchFetchedSchemeFormState_AdditionalDetails, fetchedProductIdState } from 'src/app/core/store/schemeFormStore/schemeform.selectors';

@Component({
  selector: 'app-additional-details',
  templateUrl: './additional-details.component.html',
  styleUrls: ['./additional-details.component.scss']
})
export class AdditionalDetailsComponent implements OnInit {
    //objects----------------
  private unsubscribe$: Subject<void> = new Subject<void>();
  public dropDownRefreshTo: any = [];
  public formAdditionalDetails: FormGroup;
  
   //variables--------------
   public formSubmitted:boolean=false;
   private fetchedProductId: number = 0;
  valrefresh: boolean;
  viewOnly: any;
  ProductType: string;
  private fetchSchemeDetails: any;
  private schemeDetails: any;
  public isTran: boolean = false;
  schemeRefreshToarray: any;
  constructor(private comservice: CommonService,
    private appStore: Store<AppState>,
    private envFn: EnvFunction,
    private fb: FormBuilder,

    ) { 
  }

  ngOnInit(): void {
    this.createForm()
    this.getStoreData()
    this.getRefreshTo()
    this.getSchemDetails()
    this.onCheckboxChange(this.formAdditionalDetails.get('schemeRefreshAllowed')?.value)
  }
  
  private createForm(): void {
    this.formAdditionalDetails = this.fb.group(
      {
        schemeRefreshAllowed: new FormControl(false, [Validators.required]),
        schemeRefreshTo: new FormControl('', [Validators.required]),
      }
  );
}
    //store---------------------------------------------------------------------------------------------------------------
  //get store data
  getStoreData() {
    this.appStore.select(fetchedProductIdState).subscribe((data: any) => {
      this.fetchedProductId = data;
      console.log(this.fetchedProductId,'getstoredata2');
      
    });
  }
  //get schemedetails from store and send data to patch the form
  private getSchemDetails() {
    try {
      this.appStore.select(fetchFetchedSchemeFormState_AdditionalDetails).subscribe((data) => {
        (this.fetchSchemeDetails = data.fetchSchemeDetails),
          (this.schemeDetails = data.schemeDetails);
        this.isTran = data.isTran;
        this.viewOnly = data.viewOnly;
        this.ProductType=data.ProductType
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
    //patch value to the form field
    private patchData(data: any) {
      if(!data.loanScheme.topUpAllowed){
        this.formAdditionalDetails.get('schemeRefreshTo')?.disable()
        this.formAdditionalDetails.get('schemeRefreshTo')?.setValue('')
      }
      if(data.loanScheme.topUpAllowed)
      this.formAdditionalDetails.get('schemeRefreshTo')?.enable()
        
        if(data.loanScheme.topUpAllowed && data.loanScheme.topUpSchemeId) 
        {
          const strings = data.loanScheme.topUpSchemeId.map((num: any) => String(num));
          this.formAdditionalDetails.controls['schemeRefreshTo'].setValue(
           strings,
          );
        }
         this.formAdditionalDetails.patchValue({
          schemeRefreshAllowed: Number(data.loanScheme.topUpAllowed),
        });
        if(this.viewOnly)
        {
          this.formAdditionalDetails.get('schemeRefreshTo')?.disable()
        }
        if (this.viewOnly) this.formAdditionalDetails.disable();
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
public SubmitForm(){
  this.formSubmitted=true
  console.log(this.formAdditionalDetails.valid,'ertetetetvalid');
  
  if (this.formAdditionalDetails.valid) {     
    if (this.formAdditionalDetails.get('schemeRefreshTo')?.value) {
      const array = this.formAdditionalDetails.get('schemeRefreshTo')?.value;
      this.schemeRefreshToarray = array.map((str: string) => Number(str));
    }
    const formData = {
      topUpAllowed: Boolean(
        this.formAdditionalDetails.get('schemeRefreshAllowed')?.value
      ),
      topUpSchemeId:(this.schemeRefreshToarray),
  }
  if (this.isTran) this.envFn.saveSchemeFormLiveData(7, formData);
  else this.envFn.saveSchemeFormTempdata(7, formData);
  }
}
onCheckboxChange(event:any): void {
  console.log(event,'onCheckboxChangeevent');
  const checkboxValue = event.checked;
   if(checkboxValue)
   {
   this.formAdditionalDetails.get('schemeRefreshTo')?.enable()
  this.valrefresh=true;
   }
   if(!checkboxValue){
    this.valrefresh=false;
    this.formAdditionalDetails.get('schemeRefreshTo')?.disable()
    this.formAdditionalDetails.get('schemeRefreshTo')?.setValue('')
  }
  if(this.viewOnly){
    this.formAdditionalDetails.get('schemeRefreshTo')?.disable()
  }
  }
  //validation>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public getErrorMessage(controlName: string): string {
    return this.envFn.getFormError(this.formAdditionalDetails, controlName);
  }
}
