import { Component, ComponentFactoryResolver, ComponentRef, Injector, OnInit, TemplateRef, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { EnvFunction } from 'src/app/core/env/function/env-function';
import { AppState } from 'src/app/core/store/app.state';
import { showLoader } from 'src/app/core/store/sharedStore/shared.action';
import { SchemeService } from '../../scheme/services/scheme.service';
import { SchemeFormService } from '../services/scheme-form.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EnvVariable } from 'src/app/core/env/variables/env-variable';
import { validationIsNumber } from 'src/app/core/validation/is-number.validator';
import { enableAllEditSchemeFormViewState, resetSchemeFormState, saveFetchedSchemeFormData, saveSchemeFormData, saveTranSchemeFormData, switchSchemeFormIsOpenAndEditModeStatus, updateFetchedProductId, updateFetchedSchemeId, updateSchemeFormEditableStatus, updateSchemeFormIsOpenStatus } from 'src/app/core/store/schemeFormStore/schemeform.action';
import { OfficeAccountFormComponent } from '../office-account-form/office-account-form.component';
import { fetchSchemeFormStateOnContainer } from 'src/app/core/store/schemeFormStore/schemeform.selectors';

@Component({
  selector: 'app-container-office-account',
  templateUrl: './container-office-account.component.html',
  styleUrls: ['./container-office-account.component.scss']
})
export class ContainerOfficeAccountComponent implements OnInit {
// View Child>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
@ViewChild('contain', { read: ViewContainerRef })
compContain: ViewContainerRef;

@ViewChild('pendingSchemeDetailsModal', { static: true })
pendingSchemeModal: TemplateRef<any>;

//objects-----------------------------------------------------------------------------------
private unsubscribe$: Subject<void> = new Subject<void>();
//form-----------------------------------------
   public formofficecontainer: FormGroup;
   public dropDownPreSchemes: any = [];
   public dropDownProduct: any = [];
  public  fetchedProductId: number = 0;
  public schemeId: number = -1;
  public fetchedSchemeId = -1;
  public isEditMode: boolean = false;
  public isTran: boolean = false;
  public isDisable: boolean = true;
  public tranNum: number = -1;
  public isViewOnly:boolean=false;
  public PendingView:boolean=false;
  public CutomerAccount:boolean=true
  public isOfficeAccount:boolean = false;
  public ProductType:string='FSGF'
  public currentFormId: number = 1;
  public schemeFormDetails = [
    { id: 1, formName: 'SCHEME INFO', component: OfficeAccountFormComponent, completed: true, editable: true, editMode: true, isOpen: true },
  ];
  private schemeFormsInstances: any = [];

  constructor(private envFn: EnvFunction,
    private componentFactoryResolver: ComponentFactoryResolver,
    private fb: FormBuilder,
    private injector: Injector,
    private schemeService: SchemeService,
    private schemeFormService: SchemeFormService,
    private appStore: Store<AppState>,
    private env: EnvFunction,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,

    ) { 
    this.appStore.dispatch(showLoader({ status: true }));
  }

  ngOnInit(): void {
    this.getSchemeFormsViewData();
    this.createPreSchemeForm()
    if(!this.isViewOnly)this.createPreSchemeForm();
    if(this.tranNum==-1)this.getProductList();
    this.onChanegeProduct();
    this.appStore.dispatch(showLoader({ status: false }));
    this.setUpNextComponent(this.schemeFormDetails[0].id);
    if(this.fetchedProductId)
    {
    this.formofficecontainer.get('productControl')?.setValue(3)
    }
    this.getDataIfEditMode();

    // this.appStore
    // .select(fetchSchemeFormView_SchemeInfo)
    // .pipe(takeUntil(this.unsubscribe$))
    // .subscribe((data:any) => {
    //   this.schemeFormDetails[0].completed = data.completed;
    //   this.schemeFormDetails[0].editMode = data.editMode;
    //   this.schemeFormDetails[0].editable = data.editable;
    //   this.schemeFormDetails[0].isOpen = data.isOpen;
    //   if(data.isOpen) this.currentFormId=1;
    // });

  }

  ngOnDestroy(): void {
    this.resetData();
  }
  //reset all data after leaving this view
private resetData() {
  this.appStore.dispatch(resetSchemeFormState());
  this.unsubscribe$.next();
  this.unsubscribe$.complete();
}

//form functions--------------------------------------------------------------------------
private createPreSchemeForm() {
  this.formofficecontainer = this.fb.group({
    productControl: new FormControl(3, [
      Validators.required,
      Validators.pattern(EnvVariable.patternOnlyNumbers),
      validationIsNumber(100000, 1),
    ]),
    preSchemeControl: new FormControl('', [
      Validators.required,
    ]),
  });

  // if (this.fetchedProductId > 0) this.getSchemeDetails();
}

//onChange Products
private onChanegeProduct() {
  this.formofficecontainer
    .get('productControl')
    ?.valueChanges.pipe(takeUntil(this.unsubscribe$))
    .subscribe(() => {
      this.getSchemeDetails();
      const productId = this.formofficecontainer.get('productControl')?.value;
      this.appStore.dispatch(
        updateFetchedProductId({ productId: productId })
      );
      this.appStore.dispatch(updateFetchedSchemeId({ schemeId: -1 }));
    });
}
setUpNextComponent(id: number) {
  const nextform = this.getSchemeForm(id);
  if (nextform) {
    this.appStore.dispatch(
      updateSchemeFormIsOpenStatus({ formId: nextform.id, status: true })
    );
    // if (!nextform.completed && !nextform.editable) this.loadComponent(id);
    this.appStore.dispatch(
      updateSchemeFormEditableStatus({ formId: nextform.id, status: true })
    );
    this.navigateTo(nextform.id);
  }
}

public navigateTo(schemeId: number) {
  const schemeForm = this.getSchemeForm(schemeId);
  if (schemeForm && schemeForm.editable) {
    this.currentFormId = schemeForm.id;
    this.schemeFormDetails = this.schemeFormDetails.map((form) => {
      if (form.id === schemeForm.id)
        this.appStore.dispatch(
          switchSchemeFormIsOpenAndEditModeStatus({
            formId: form.id,
            status: true,
          })
        );
      else
        this.appStore.dispatch(
          switchSchemeFormIsOpenAndEditModeStatus({
            formId: form.id,
            status: false,
          })
        );
      // this.cdr.detectChanges();
      return form;
    });
  } else alert('Please complete the previous forms, to continue.');
}

private getSchemeForm(id: number) {
  return this.schemeFormDetails.find((form) => form.id === id);
}
//get product list from store
private getProductList() {
  this.dropDownProduct = [];
  this.schemeService
    .getSchemeTypeList()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (data: any) => {
        if (data.statusCode == 200) this.dropDownProduct = data.result;
        else {
          this.envFn.showResponseErrorMessage(
            'something went wrong while fetching product list'
          );
        }
      },
      (err) => {
        this.envFn.showResponseErrorMessage(
          'something went wrong while fetching product list'
        );
      }
    );
}
//onChange preScheme
public getPreSchemeDetails() {
  console.log("getPreSchemeDetails");
  
  const schemeId = this.formofficecontainer.get('preSchemeControl')?.value;
  this.appStore.dispatch(updateFetchedSchemeId({ schemeId: schemeId }));
  if(schemeId)
  this.getSchemeDetailsById(schemeId, true);
}
//get scheme details from store
private getSchemeDetails(searchData: string = '') {
  
  this.dropDownPreSchemes = [];
  this.schemeService
    .getSchemeDetails(this.fetchedProductId, searchData, 0, 0)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (data: any) => {        
        if (data.statusCode == 200)
          data.result != 'NODATA'
            ? (this.dropDownPreSchemes = data.result)
            : (this.dropDownPreSchemes = []);
        else
          this.envFn.showResponseErrorMessage(
            'something went wrong while fetching schemesdd'
          );
      },
      (err) => {
        this.envFn.showResponseErrorMessage(
          'something went wrong while fetching schemes'
        );
      }
    );
}
//fetching schemefromview data from schem store
private getSchemeFormsViewData() {
  this.appStore
    .select(fetchSchemeFormStateOnContainer)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data) => {

      this.fetchedProductId = 3;
      this.isEditMode = data.editMode;
      this.isTran = data.isTran;
      this.schemeId = data.schemeId;
      this.isViewOnly = data.viewOnly;
      this.PendingView=data.PendingView;
      this.fetchedSchemeId = data.fetchedSchemeId;
      this.tranNum = data.tranNum;      
      this.ProductType=data.ProductType;
    });
  }
  //getDataFunction
private getDataIfEditMode() {
  // if (this.tranNum > -1) {
    if (this.isEditMode && this.isTran) {
    //call live data with schemeID
    this.getSchemeDetailsById(this.schemeId, false);
  } else if (this.isEditMode) {
    if (this.schemeId > 0) {
      //call scheme details from temId from from partial save data to schemeDetails in store
      //we will get fetchschemedetails along with scheme details
      if (this.fetchedSchemeId > 0) {
        this.getSchemeDetailsById(this.fetchedSchemeId, true);
        //call scheme details from live data with schemId and save it to fetched schemeDetails
      }
  }
 }
}
//get scheme details by Id
private getSchemeDetailsById(
  schemeId: number = -1,
  isSaveToFetch: boolean = true
) {

  console.log('trying to fetch scheme data')
  //fetch data and save it to fetchSchemeDetails if isSaveToFetch==true, else save to schemeDetails
  this.schemeFormService
    .getSchemeDetailsById(schemeId)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (data: any) => {
        if (data.statusCode == 200) {
          if (isSaveToFetch)
            this.appStore.dispatch(
              saveFetchedSchemeFormData({
                schemejson: JSON.stringify(data.result),
              })
            );
          else {
            this.appStore.dispatch(
              saveSchemeFormData({ schemejson: JSON.stringify(data.result) })
            );
            this.appStore.dispatch(
              saveTranSchemeFormData({
                schemejson: JSON.stringify(data.result),
              })
            );
            this.appStore.dispatch(enableAllEditSchemeFormViewState());
          }
        } else
          this.envFn.showResponseErrorMessage(
            'something went wrong while fetching schemes'
          );
      },
      (err) => {
        this.envFn.showResponseErrorMessage(
          'something went wrong while fetching schemes'
        );
      }
    );
}

public getErrorMessage(controlName: string): string {
  return this.envFn.getFormError(this.formofficecontainer, controlName);
}
}
