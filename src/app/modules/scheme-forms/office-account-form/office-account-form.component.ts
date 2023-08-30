import { CommonService } from './../../../core/env/common-services/common.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';
import { EnvFunction } from 'src/app/core/env/function/env-function';
import { EnvVariable } from 'src/app/core/env/variables/env-variable';
import { SchemeFormService } from '../services/scheme-form.service';
import { updateFetchedProductType, updateSchemeFormViewOnly } from 'src/app/core/store/schemeFormStore/schemeform.action';
import { AppState } from 'src/app/core/store/app.state';
import { Store } from '@ngrx/store';
import { fetchSchemeFormState_SchemeInfo, fetchedProductIdState } from 'src/app/core/store/schemeFormStore/schemeform.selectors';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-office-account-form',
  templateUrl: './office-account-form.component.html',
  styleUrls: ['./office-account-form.component.scss']
})
export class OfficeAccountFormComponent implements OnInit {
  private unsubscribe$: Subject<void> = new Subject<void>();
  private schemeDetails: any;
  public formSubmitted: boolean = false;
  public formSchemeDetails: FormGroup;
  public glCodeSearch: any = null;
  public dropDownGL: any = [];
  schemeInfo:any
  ProductType: any;
  fetchedProductId: any;
  schemeId: any;
  fetchSchemeDetails: any;
  isTran: boolean;
  viewOnly: boolean;
  public tranId: any;
  editMode: any;

  constructor(private fb: FormBuilder,
    private envFn:EnvFunction,
    private SchemeFormService:SchemeFormService,
    private appStore: Store<AppState>,
    private actRoute: ActivatedRoute,
    private router: Router,

    ) {
   }

  ngOnInit(): void {
    this.createForm()
    this.getGLCodeAll()
    this.getStoreData()
    this.pathCheck()
    this.getSchemDetails()
  }

    //store---------------------------------------------------------------------------------------------------------------
  //get store data
  getStoreData() {
    this.appStore.select(fetchedProductIdState).subscribe((data) => {
      this.fetchedProductId = data;
      console.log(data, 'getStoreData');
    });
  }
    //get schemedetails from store and send data to patch the form
    private getSchemDetails() {
      if(!this.viewOnly)
      {
      try {
        this.appStore.select(fetchSchemeFormState_SchemeInfo).pipe(take(2)).subscribe((data) => {   
        this.fetchSchemeDetails = data.fetchSchemeDetails
        this.schemeDetails = data.schemeDetails
        this.isTran = data.isTran;
        this.viewOnly = data.viewOnly;
        this.editMode= data.editMode

        console.log(this.schemeDetails ,'schemeDetails');
        console.log(this.fetchSchemeDetails ,'fetchSchemeDetails');
    
      if (this.schemeDetails)
      {
        this.patchData(this.schemeDetails);
      } 
      else if (this.fetchSchemeDetails)
      {
        this.patchData(this.fetchSchemeDetails);
      }
        });
      } catch (error) {
        this.envFn.showResponseErrorMessage(
          'Something went wrong while fetching data from store'
        );
      }
    }
    }
  
    private patchData(data: any) {    
      if(data)
      {
    
      if(this.schemeDetails && this.schemeDetails.schemeId!=0){ 
        this.formSchemeDetails.get("schemeName")?.disable() 
      } 
      
      this.formSchemeDetails.patchValue({
        schemeName: data.schemeCode,
        schemeDescription: data.description,
        schemeTransactionLabel: data.glCode,
      });
      if (this.viewOnly) this.formSchemeDetails.disable();
    }
  }
    //path checking
    private pathCheck()
    {
      let uid;
      let featureId;
      let branchId;
      this.actRoute.queryParams.subscribe((params) => {
        uid = params['uid'];
        featureId = params['featureId'];
        branchId = params['branchId'];
      });
      if (this.actRoute.snapshot.params['OfficeeditTran']) {
        this.tranId = this.actRoute.snapshot.params['OfficeeditTran'];
        this.getTransactionData(this.tranId, branchId);
      } else if (this.actRoute.snapshot.params['OfficeviewTran']) {
        this.viewOnly = true;
        this.appStore.dispatch(updateSchemeFormViewOnly({viewOnly:this.viewOnly}));
        this.tranId = this.actRoute.snapshot.params['OfficeviewTran'];
         this.getTransactionData(this.tranId, branchId);
    }
  }
  public getTransactionData(tranNumber: number, branchId: any) {
    this.envFn
      .getCommonTransactionData(tranNumber, branchId)
      .then((res: any) => {
        this.schemeDetails = JSON.parse(res[0].updatedData).schemeInfo;
        console.log(this.schemeDetails,' this.schemeInfo');
        this.patchData(this.schemeDetails);
      })
      .catch((error: any) => {
        console.error(error);
      });
  }
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
        schemeName: new FormControl('', [
          Validators.required,
          Validators.pattern(EnvVariable.patternStringAndNumberAndSomeSpecial),
          Validators.minLength(4),
        ]),
        hideCheckbox: new FormControl(''),
        schemeTransactionLabel: new FormControl(null, [
          Validators.required,
        ]),

        schemeDescription: new FormControl('', [
          Validators.required, this.onlySpacesValidator(),
          Validators.pattern(EnvVariable.patternStringAndNumber),
          Validators.minLength(5),
           ]),
          }
           );
          }

          public searchGlCode(event: any) {
            let glCode = event.target.value;
            let length = event.target.value.length;
            if (length > 3 && this.formSchemeDetails.get('schemeName')?.valid) {
              this.SchemeFormService
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
  //gl searchable key event
  public getGLCodeAll() {
    this.formSubmitted = true;
      this.dropDownGL = [];
      this.SchemeFormService.getGLCodeAll().subscribe(
        (res: any) => {
          this.dropDownGL = res.result;
        }
      );
  }
  public Submit()
  {
    this.formSubmitted=true
    if(this.formSchemeDetails.valid)
    {
   let glCode=this.formSchemeDetails.get('schemeTransactionLabel')?.value;
    const transactionLabels = [];
    for (const value of glCode) {
      const transactionLabel = this.envFn.getDescriptionById(
        this.dropDownGL,
        'glCode',
        value,
        'transactionLabel'
      );   
      transactionLabels.push(transactionLabel);
    }
      this.appStore.dispatch(updateFetchedProductType({ProductType:this.ProductType}));
      console.log(this.ProductType,'productType');
    if(this.isTran)
    { 
      this.schemeId=this.schemeDetails.schemeId
       
    }
    else
    {
      this.schemeId=0
    }     
      this.schemeInfo={
        schemeId: this.schemeId,
        schemeCode: String(this.formSchemeDetails.get('schemeName')?.value).trim(),
        description: String(
          this.formSchemeDetails.get('schemeDescription')?.value
        ).trim(),
         glCode:(
          this.formSchemeDetails.get('schemeTransactionLabel')?.value
        ),
        transactionLabel: transactionLabels,
        schemeTypeId:this.fetchedProductId
      }   
      const schemeInfo={
        schemeInfo:this.schemeInfo
         }
      console.log(this.schemeInfo,'schemeInfo');
      if (this.actRoute.snapshot.params['OfficeeditTran']) {
        let featureId
        if(this.isTran)
        {
          featureId=52
        }
        else{
          featureId=51
        }
        let   params = new HttpParams()
         params = params.set(
             'updatedData',
             JSON.stringify(schemeInfo)
           );
           console.log(params,'params');           
             this.envFn.sendBackReview(this.tranId, 22, 1,featureId, 'UPDATE', 0, 0, 0, params).subscribe((data: any) => {
             if (data.statusCode == 200) {
               this.formSubmitted=true
               this.router.navigate(['/'], { relativeTo: this.actRoute });     
               this.envFn.showSwalAlert('',
               data.result +' sent for verification successfully !!',
               'success'
              );
              
            }else{
               // Failure
               this.envFn.showResponseErrorMessage('Something went wrong');
             }
             },
             (error: any) => {
               // Error
               this.envFn.showResponseErrorMessage('Something went wrong');
             });
           } else  {
            let featureId
            if(this.isTran)
            {
              featureId=52
            }
            else{
              featureId=51
            }
        let   params = new HttpParams()
          params = params.set(
       'editedData',
       JSON.stringify(schemeInfo)
     );
     params = params.set(
       'updatedData',
       JSON.stringify(schemeInfo)
     );      
     const userId=22
     const branchId=1
     const Amount=0
     const Method='CREATE'
     const incAuthcount=0
     const loanCount=0
     this.envFn
               .generateTran(userId,branchId,featureId,Amount,Method,incAuthcount,loanCount,params)
               .subscribe(
                 (data: any) => {
                   if (data.statusCode == 200) {
                     this.router.navigate(['/'], { relativeTo: this.actRoute });
                     this.envFn.showSwalAlert('',
                      data.result +' sent for verification successfully !!',
                      'success'
                     );
                   } else {
                     // Failure
                     this.envFn.showResponseErrorMessage('Something went wrong');
                   }
                 },
                 (error: any) => {
                   // Error
                   this.envFn.showResponseErrorMessage('Something went wrong');
                 }
               );
   }
  }
}
  //validation>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public getErrorMessage(controlName: string): string {
    return this.envFn.getFormError(this.formSchemeDetails, controlName);
  }
 }