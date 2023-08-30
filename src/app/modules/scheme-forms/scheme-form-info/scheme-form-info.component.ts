import { CommonService } from './../../../core/env/common-services/common.service';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';
import { EnvFunction } from 'src/app/core/env/function/env-function';
import { EnvVariable } from 'src/app/core/env/variables/env-variable';
import { SchemeFormService } from '../services/scheme-form.service';
import {
  fetchSchemeFormStateOnContainer,
  fetchSchemeFormState_SchemeInfo,
  fetchedProductIdState,
} from 'src/app/core/store/schemeFormStore/schemeform.selectors';
import { AppState } from 'src/app/core/store/app.state';
import { Store } from '@ngrx/store';
import { showLoader } from 'src/app/core/store/sharedStore/shared.action';
import { updateFetchedProductType } from 'src/app/core/store/schemeFormStore/schemeform.action';

@Component({
  selector: 'app-scheme-form-info',
  templateUrl: './scheme-form-info.component.html',
  styleUrls: ['./scheme-form-info.component.scss'],
})
export class SchemeFormInfoComponent implements OnInit {
  private unsubscribe$: Subject<void> = new Subject<void>();

  public formSubmitted: boolean = false;
  public formSchemeDetails: FormGroup;
  public glCodeSearch: any = null;
  public dropDownGL: any = [];
  public isTran: boolean;
  public viewOnly: boolean;

  //variables--------------
  private fetchedSchemeId: number = 0;
  public fetchedProductId: number = 0;
  private fetchSchemeDetails: any;
  private schemeDetails: any;
  loadView: boolean;
  schemeId: number;
  ProductType: string;
  schemeInfo: any;
  constructor(
    private fb: FormBuilder,
    private envFn: EnvFunction,
    private SchemeFormService: SchemeFormService,
    private appStore: Store<AppState>
  ) {}
  ngOnInit(): void {
    this.createForm();
    this.getStoreData();
    this.getSchemDetails();
    this.appStore.dispatch(showLoader({ status: false }));
    this.loadView = true;
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
    this.formSchemeDetails = this.fb.group({
      schemeName: new FormControl('', [
        Validators.required,
        Validators.pattern(EnvVariable.patternStringAndNumberAndSomeSpecial),
        Validators.minLength(4),
      ]),
      hideCheckbox: new FormControl(''),
      schemeTransactionLabel: new FormControl(null, [
        Validators.required,
        Validators.pattern(EnvVariable.patternStringAndNumberAndHyphen),
        Validators.maxLength(16),
      ]),
      schemeDescription: new FormControl('', [
        Validators.required,
        this.onlySpacesValidator(),
        Validators.pattern(EnvVariable.patternStringAndNumber),
        Validators.minLength(5),
      ]),
    });
  }

  //store---------------------------------------------------------------------------------------------------------------
  //get store data
  getStoreData() {
    this.appStore.select(fetchedProductIdState).subscribe((data) => {
      this.fetchedProductId = data;
      console.log(data, 'getStoreData');
    });
  }
  getSchemeFormsViewData() {
    this.appStore
      .select(fetchSchemeFormStateOnContainer)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.fetchedSchemeId = data.fetchedSchemeId;
        console.log(data, 'getSchemeFormsViewData');
      });
  }
  //get schemedetails from store and send data to patch the form
  private getSchemDetails() {
    try {
      this.appStore
        .select(fetchSchemeFormState_SchemeInfo)
        .pipe(take(2))
        .subscribe((data) => {
          console.log(data, 'data');
          this.fetchSchemeDetails = data.fetchSchemeDetails;
          this.schemeDetails = data.schemeDetails;
          this.isTran = data.isTran;
          this.viewOnly = data.viewOnly;
          console.log(this.schemeDetails, 'schemeDetails');
          console.log(this.fetchSchemeDetails, 'fetchSchemeDetails');

          if (this.schemeDetails) {
            this.patchData(this.schemeDetails);
          } else if (this.fetchSchemeDetails) {
            this.patchData(this.fetchSchemeDetails);
          }
        });
    } catch (error) {
      this.envFn.showResponseErrorMessage(
        'Something went wrong while fetching data from store'
      );
    }
  }
  private patchData(data: any) {
    if (data) {
      // let accountId = data.accountId
      let transactionLabel = data.transactionLabel[0];
      let ProductType = data.productType[0];
      let glCode = data.glCode[0];
      console.log(data.productType, 'data.productType');
      console.log(data,'dataschemeinfo');
      
      this.appStore.dispatch(
        updateFetchedProductType({ ProductType: ProductType })
      );
      this.dropDownGL = [
        {
          transactionLabel: transactionLabel,
          productType: ProductType,
          glCode: glCode,
        },
      ];
      console.log(this.dropDownGL, ' this.dropDownGL');

      if (this.schemeDetails && this.schemeDetails.schemeId != 0) {
        this.formSchemeDetails.get('schemeName')?.disable();
      }
      this.formSchemeDetails.patchValue({
        schemeName: data.schemeCode,
        schemeDescription: data.description,
        schemeTransactionLabel: data.glCode[0],
      });
      if (this.viewOnly) this.formSchemeDetails.disable();
    }
  }
  public searchGlCode(event: any) {
    let glCode = event.target.value;
    let length = event.target.value.length;
    if (length > 3 && this.formSchemeDetails.get('schemeName')?.valid) {
      this.SchemeFormService.searchGlCode(glCode)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res: any) => {
          if (res.statusCode == 200) {
            if (res.result == 'true') {
              this.formSchemeDetails
                .get('hideCheckbox')
                ?.setValidators([Validators.required]);
              this.formSchemeDetails
                .get('hideCheckbox')
                ?.updateValueAndValidity();
            } else {
              this.formSchemeDetails.get('hideCheckbox')?.clearValidators();
              this.formSchemeDetails
                .get('hideCheckbox')
                ?.updateValueAndValidity();
            }
            this.glCodeSearch = res;
          }
        });
      this.formSchemeDetails.get('hideCheckbox')?.clearValidators();
      this.formSchemeDetails.get('hideCheckbox')?.updateValueAndValidity();
    } else {
      this.glCodeSearch = '';
    }
  }
  //gl searchable key event
  public keyup(event: any) {
    this.formSubmitted = true;
    if (event.target.value.length >= 1) {
      this.dropDownGL = [];
      this.SchemeFormService.getSearchGlCodeList(event.target.value).subscribe(
        (res: any) => {
          this.dropDownGL = res.result;
        }
      );
    } else {
      this.dropDownGL = [];
    }
  }
  public goToNextForm() {
    this.envFn.goToNextSchemeForm(1);
  }
  public Submit() {
    this.ProductType = this.envFn.getDescriptionById(
      this.dropDownGL,
      'glCode',
      String(this.formSchemeDetails.get('schemeTransactionLabel')?.value),
      'productType'
    );
    this.appStore.dispatch(
      updateFetchedProductType({ ProductType: this.ProductType })
    );
    console.log(this.ProductType, 'productType');
    if (this.isTran) {
      this.schemeId = this.schemeDetails.schemeId;
    } else {
      this.schemeId = 0;
    }
    this.schemeInfo = {
      schemeId: this.schemeId,
      schemeCode: String(
        this.formSchemeDetails.get('schemeName')?.value
      ).trim(),
      glCode: [
        this.envFn.getDescriptionById(
          this.dropDownGL,
          'glCode',
          String(this.formSchemeDetails.get('schemeTransactionLabel')?.value),
          'glCode'
        ),
      ],
      // accountId: Number(
      //   this.formSchemeDetails.get('schemeTransactionLabel')?.value
      // ),
      transactionLabel: [
        this.envFn.getDescriptionById(
          this.dropDownGL,
          'glCode',
          String(this.formSchemeDetails.get('schemeTransactionLabel')?.value),
          'transactionLabel'
        ),
      ],
      description: String(
        this.formSchemeDetails.get('schemeDescription')?.value
      ).trim(),
      productType: this.ProductType,
      schemeTypeId: this.fetchedProductId,
    };
    console.log(this.schemeInfo, 'schemeInfo');
    console.log(this.isTran, 'this.isTran');
    if (this.formSchemeDetails.valid) {
      if (this.isTran) {
        this.envFn.saveSchemeFormLiveData(1, this.schemeInfo);
      } else {
        this.envFn.saveSchemeFormTempdata(1, this.schemeInfo);
      }
    }
  }

  //validation>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public getErrorMessage(controlName: string): string {
    return this.envFn.getFormError(this.formSchemeDetails, controlName);
  }
}
