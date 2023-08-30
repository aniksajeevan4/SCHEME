import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Injector,
  NgModuleRef,
  OnInit,
  TemplateRef,
  Type,
  ViewChild,
  ViewContainerRef,
  createNgModuleRef,
} from '@angular/core';
import { CommonService } from 'src/app/core/env/common-services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemeFormDetailsComponent } from '../scheme-form-details/scheme-form-details.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EnvFunction } from 'src/app/core/env/function/env-function';
import { AppState } from 'src/app/core/store/app.state';
import {
  fetchSchemeFormStateOnContainer,
  fetchSchemeFormView_AddDetails,
  fetchSchemeFormView_ApplicableTo,
  fetchSchemeFormView_GeneralInfo,
  fetchSchemeFormView_InterestConfig,
  fetchSchemeFormView_InterestDefinition,
  fetchSchemeFormView_SchemeInfo,
  fetchSchemeFormView_schemeCharges,
  fetchSchemeLiveDetails,
  getSchemeFormOnSaveData,
} from 'src/app/core/store/schemeFormStore/schemeform.selectors';
import {
  enableAllEditSchemeFormViewState,
  resetSchemeFormState,
  saveFetchedSchemeFormData,
  saveSchemeFormData,
  saveTranSchemeFormData,
  switchSchemeFormIsOpenAndEditModeStatus,
  updateFetchedProductId,
  updateFetchedSchemeId,
  updateSchemeFormCompletedStatus,
  updateSchemeFormEditableStatus,
  updateSchemeFormIsOpenStatus,
  updateSchemeFormViewOnly,
  updateSchemeFormsEditMode,
  updateSchemeId,
} from 'src/app/core/store/schemeFormStore/schemeform.action';
import { Subject, takeUntil } from 'rxjs';
import { showLoader } from 'src/app/core/store/sharedStore/shared.action';
import { ChargeMasterComponent } from '../../master/charge-definition/charge-master/charge-master.component';
import { Store } from '@ngrx/store';
import { InterestViewComponent } from '../../master/interest-view/interest-view.component';
import { InterestConfigurationComponent } from '../interest-configuration/interest-configuration.component';
import { SchemeService } from '../../scheme/services/scheme.service';
import { SchemeFormService } from '../services/scheme-form.service';
import { validationIsNumber } from 'src/app/core/validation/is-number.validator';
import { EnvVariable } from 'src/app/core/env/variables/env-variable';
import { HttpParams } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PendingSchemeDetailsComponent } from '../pending-scheme-details/pending-scheme-details.component';
import { SchemeFormInfoComponent } from '../scheme-form-info/scheme-form-info.component';
import { SchemeFormAdditionalDetailsComponent } from '../scheme-Applicable-To/scheme-form-additional-details.component';
import { AdditionalDetailsComponent } from '../additional-details/additional-details.component';

@Component({
  selector: 'app-scheme-form-container2',
  templateUrl: './scheme-form-container2.component.html',
  styleUrls: ['./scheme-form-container2.component.scss']
})
export class SchemeFormContainer2Component implements OnInit {
// View Child>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
@ViewChild('contain', { read: ViewContainerRef })
compContain: ViewContainerRef;
@ViewChild('componentContainer1', { read: ViewContainerRef })
componentContainer1: ViewContainerRef;
@ViewChild('componentContainer2', { read: ViewContainerRef })
componentContainer2: ViewContainerRef;
@ViewChild('componentContainer3', { read: ViewContainerRef })
componentContainer3: ViewContainerRef;
@ViewChild('componentContainer4', { read: ViewContainerRef })
componentContainer4: ViewContainerRef;
@ViewChild('componentContainer5', { read: ViewContainerRef })
componentContainer5: ViewContainerRef;
@ViewChild('componentContainer6', { read: ViewContainerRef })
componentContainer6: ViewContainerRef;

@ViewChild('pendingSchemeDetailsModal', { static: true })
pendingSchemeModal: TemplateRef<any>;

//objects-----------------------------------------------------------------------------------
private unsubscribe$: Subject<void> = new Subject<void>();

//Form--------------------------------------------------------------------------------------------------------------------
public formPreScheme: FormGroup;
public dropDownPreSchemes: any = [];
public dropDownProduct: any = [];
//variables---------------------------------------------------------------------------------------------------------------
public pendingSchemeDetails: any[] = [];
public currentFormId: number = 1;
private schemeFormsInstances: any = [];

//view defenition----------------------------------------------------------------------------------------------------------------------------------------------------------------
// public schemeFormDetails: SchemeFormViewState[] = [];
public  fetchedProductId: number = 3;

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
 public schemeFormDetails = [
  { id: 1, formName: 'SCHEME INFO', component: SchemeFormInfoComponent, completed: true, editable: true, editMode: true, isOpen: true },
  { id: 2, formName: 'SCHEME GENERAL INFO', component: SchemeFormDetailsComponent, completed: true, editable: true, editMode: true, isOpen: true },
  { id: 3, formName: 'SCHEME APPLICABLE TO', component: SchemeFormAdditionalDetailsComponent, completed: false, editable: false, editMode: false, isOpen: false },
  { id: 4, formName: 'SCHEME INTEREST CONFIGURATION', component: InterestConfigurationComponent, completed: false, editable: false, editMode: false, isOpen: false },
  { id: 5, formName: 'INTEREST VIEW', component: InterestViewComponent, completed: false, editable: false, editMode: false, isOpen: false },
  { id: 6, formName: 'SCHEME CHARGES', component: ChargeMasterComponent, completed: false, editable: false, editMode: false, isOpen: false },
  { id: 7, formName: 'ADDITIONAL DETAILS',component: AdditionalDetailsComponent , completed: false, editable: false, editMode: false, isOpen: false },
];

// schemeFormComponents = [
//   { id: 1, component: SchemeFormDetailsComponent },
//   { id: 2, component: SchemeFormAdditionalDetailsComponent },
//   { id: 3, component: InterestConfigurationComponent },
//   { id: 4, component: InterestViewComponent },
//   { id: 5, component: ChargeMasterComponent },
//   { id: 6, component: SchemeLimitComponent },
// ];
tranId: number=0;
  Method: string;
  FeatureId: number;

//constructor----------------------------------------------------------------------------
constructor(
  private envFn: EnvFunction,
  private componentFactoryResolver: ComponentFactoryResolver,
  private fb: FormBuilder,
  private injector: Injector,
  private schemeService: SchemeService,
  private schemeFormService: SchemeFormService,
  private CommonService: CommonService,
  private appStore: Store<AppState>,
  private env: EnvFunction,
  public dialog: MatDialog,
  private router: Router,
  private route: ActivatedRoute
) {
  this.appStore.dispatch(showLoader({ status: true }));
}

//lifecycle functions --------------------------------------------------------------------
ngOnInit(): void {
  this.getSchemeFormsViewData();
  this.urlChecking()
  // this.openModalForPendingDetail();
  if(!this.isViewOnly)this.createPreSchemeForm();
  if(this.tranNum==-1)this.getProductList();
  this.getDataIfEditMode();
  this.onChanegeProduct();
  // this.onChangePreScheme();
  this.appStore.dispatch(showLoader({ status: false }));
  this.setUpNextComponent(this.schemeFormDetails[0].id);
  console.log(this.fetchedProductId,'inoit');
  
  if(this.fetchedProductId)
{
this.formPreScheme.get('productControl')?.setValue(this.fetchedProductId)
}
}

// ngAfterViewInit(): void {
// }

ngOnDestroy(): void {
  this.resetData();
}

//Store functions-------------------------------------------------------------------------------------
//fetching schemefromview data from schem store
private getSchemeFormsViewData() {
  let data:any
  this.appStore
    .select(fetchSchemeFormStateOnContainer)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data1:any) => {
      data=data1
    });
    this.fetchedProductId = data.fetchedProductId;
    this.isEditMode = data.editMode;
    this.isTran = data.isTran;
    this.schemeId = data.schemeId;
    this.isViewOnly = data.viewOnly;
    this.PendingView=data.PendingView;
    this.fetchedSchemeId = data.fetchedSchemeId;
    this.tranNum = data.tranNum;      
    this.ProductType=data.ProductType;
    console.log('this.ProductType',this.ProductType); 
    console.log('this.fetchedProductId111111111111111',this.fetchedProductId);  
    this.appStore
    .select(fetchSchemeFormView_SchemeInfo)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data:any) => {
      this.schemeFormDetails[0].completed = data.completed;
      this.schemeFormDetails[0].editMode = data.editMode;
      this.schemeFormDetails[0].editable = data.editable;
      this.schemeFormDetails[0].isOpen = data.isOpen;
      if(data.isOpen) this.currentFormId=1;
    });

    this.appStore
    .select(fetchSchemeFormView_GeneralInfo)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data:any) => {
      this.schemeFormDetails[1].completed = data.completed;
      this.schemeFormDetails[1].editMode = data.editMode;
      this.schemeFormDetails[1].editable = data.editable;
      this.schemeFormDetails[1].isOpen = data.isOpen;
      if(data.isOpen) this.currentFormId=2;
    });

    this.appStore
    .select(fetchSchemeFormView_ApplicableTo)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data:any) => {
      this.schemeFormDetails[2].completed = data.completed;
      this.schemeFormDetails[2].editMode = data.editMode;
      this.schemeFormDetails[2].editable = data.editable;
      this.schemeFormDetails[2].isOpen = data.isOpen;
      if(data.isOpen) this.currentFormId=3;
    });

    this.appStore
    .select(fetchSchemeFormView_InterestConfig)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data:any) => {
      this.schemeFormDetails[3].completed = data.completed;
      this.schemeFormDetails[3].editMode = data.editMode;
      this.schemeFormDetails[3].editable = data.editable;
      this.schemeFormDetails[3].isOpen = data.isOpen;
      if(data.isOpen) this.currentFormId=4;
    });

    this.appStore
    .select(fetchSchemeFormView_InterestDefinition)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data:any) => {
      this.schemeFormDetails[4].completed = data.completed;
      this.schemeFormDetails[4].editMode = data.editMode;
      this.schemeFormDetails[4].editable = data.editable;
      this.schemeFormDetails[4].isOpen = data.isOpen;
      if(data.isOpen) this.currentFormId=5;
    });

    this.appStore
    .select(fetchSchemeFormView_schemeCharges)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data:any) => {
      this.schemeFormDetails[5].completed = data.completed;
      this.schemeFormDetails[5].editMode = data.editMode;
      this.schemeFormDetails[5].editable = data.editable;
      this.schemeFormDetails[5].isOpen = data.isOpen;
      if(data.isOpen) this.currentFormId=6;
    });

    this.appStore
    .select(fetchSchemeFormView_AddDetails)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data:any) => {
      this.schemeFormDetails[6].completed = data.completed;
      this.schemeFormDetails[6].editMode = data.editMode;
      this.schemeFormDetails[6].editable = data.editable;
      this.schemeFormDetails[6].isOpen = data.isOpen;
      if(data.isOpen) this.currentFormId=7;
    });
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

//get scheme details from store
private getSchemeDetails(searchData: string = '') {
  
  this.dropDownPreSchemes = [];
  this.schemeService
    .getSchemeDetails(this.fetchedProductId,searchData, 0, 0)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (data: any) => {        
        if (data.statusCode == 200)
          data.result != 'NODATA'
            ? (this.dropDownPreSchemes = data.result)
            : (this.dropDownPreSchemes = []);
        else
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

//get scheme details by Id
private getSchemeDetailsByTempId(schemeId: number = -1) {
  this.schemeFormService
    .getSchemeDetailsByTempId(schemeId)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      (data: any) => {
        if (data.statusCode == 200) {
          this.appStore.dispatch(
            saveSchemeFormData({ schemejson: data.result })
          );
          this.appStore.dispatch(
            saveTranSchemeFormData({ schemejson: data.result })
          );
          this.appStore.dispatch(saveSchemeFormData(JSON.parse(data.result)));
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

//form functions--------------------------------------------------------------------------
private createPreSchemeForm() {
  this.formPreScheme = this.fb.group({
    productControl: new FormControl(this.fetchedProductId, [
      Validators.required,
      Validators.pattern(EnvVariable.patternOnlyNumbers),
      validationIsNumber(100000, 1),
    ]),
    preSchemeControl: new FormControl('', [
      Validators.required,
    ]),
  });

  if (this.fetchedProductId > 0) 
  {this.getSchemeDetails();}
}

//onChange Products
private onChanegeProduct() {
  this.formPreScheme
    .get('productControl')
    ?.valueChanges.pipe(takeUntil(this.unsubscribe$))
    .subscribe(() => {
      this.getSchemeDetails();
      const productId = this.formPreScheme.get('productControl')?.value;
      this.appStore.dispatch(
        updateFetchedProductId({ productId: productId })
      );
      this.appStore.dispatch(updateFetchedSchemeId({ schemeId: -1 }));
    });
}

//onChange preScheme
public getPreSchemeDetails() {
  const schemeId = this.formPreScheme.get('preSchemeControl')?.value;
  this.appStore.dispatch(updateFetchedSchemeId({ schemeId: schemeId }));
  if(schemeId )
  this.getSchemeDetailsById(schemeId, true);
}

public getErrorMessage(controlName: string): string {
  return this.envFn.getFormError(this.formPreScheme, controlName);
}

//Other functions------------------------------------------------------------------------

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

//open pending scheme grid view modal
openModalForPendingDetail() {
  if (!this.isTran && !this.isViewOnly) {
    let dialogRef: MatDialogRef<PendingSchemeDetailsComponent> =
      this.dialog.open(PendingSchemeDetailsComponent, {
        width: '75%',
        height: '90%',
        // ...
      });
    // Optionally, you can subscribe to the afterClosed event to perform actions after the dialog is closed.
    dialogRef.afterClosed().subscribe((result) => {
      this.getDataIfEditMode();
    });
  }
}

private getSchemeFormComponent(schemeFormId: number) {
  const form = this.schemeFormDetails.find(
    (element) => element.id === schemeFormId
  );
  if (form) return form;
  return null;
}

private getSchemeForm(id: number) {
  return this.schemeFormDetails.find((form) => form.id === id);
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

loadComponent2(formId: number) {
  const componentTypeDetails = this.getSchemeFormComponent(formId);
  if (!componentTypeDetails) {
    console.log('no component matches to load');
    return;
  }
  import('../scheme-forms.module').then((formmodule) => {
    const formModule = formmodule['SchemeFormsModule'];
    let moduleRef: NgModuleRef<any> = createNgModuleRef(
      formModule,
      this.injector
    );
    const component = moduleRef.instance.getSchemeForm3Component();
    this.compContain.createComponent(component, { ngModuleRef: moduleRef });
    const schemeinstanceData = {
      id: formId,
      formInstant: component,
    };
    this.schemeFormsInstances.push(schemeinstanceData);
  });
}

loadComponent(formId: number) {
  const componentTypeDetails = this.getSchemeFormComponent(formId);
  if (!componentTypeDetails) {
    console.log('no component matches to load');
    return;
  }
  const componentType: Type<any> = componentTypeDetails.component;
  let componentRef!: ComponentRef<any>;
  const componentFactory =
    this.componentFactoryResolver.resolveComponentFactory(componentType); // Resolve the component factory for the specified component type
  // Create the component instance and insert it into the view
  switch (formId) {
    case 1:
      componentRef =
        this.componentContainer1.createComponent(componentFactory);
      break;
    case 2:
      componentRef =
        this.componentContainer2.createComponent(componentFactory);
      break;
    case 3:
      componentRef =
        this.componentContainer3.createComponent(componentFactory);
      break;
    case 4:
      componentRef =
        this.componentContainer4.createComponent(componentFactory);
      break;
    case 5:
      componentRef =
        this.componentContainer5.createComponent(componentFactory);
      break;
    case 6:
      componentRef =
        this.componentContainer6.createComponent(componentFactory);
      break;
    default:
      componentRef =
        this.componentContainer1.createComponent(componentFactory);
  }

  // Call the `scrollTo` method of the component
  const schemeinstanceData = {
    id: formId,
    formInstant: componentRef,
  };
  this.schemeFormsInstances.push(schemeinstanceData);
}

setFormCompleteStatus(id: number) {
  const nextFormId = id + 1;
  const form = this.getSchemeForm(id);
  if (form) {
    this.appStore.dispatch(
      updateSchemeFormCompletedStatus({ formId: form.id, status: true })
    );
    this.appStore.dispatch(
      updateSchemeFormIsOpenStatus({ formId: form.id, status: false })
    );
    this.setUpNextComponent(nextFormId);
  }
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

//handles toggling on open and close of all accordian tab
toggleAccord(id: number) {
  const form = this.getSchemeForm(id);
  if (form && form.editable) {
    if (form.isOpen)
      this.appStore.dispatch(
        switchSchemeFormIsOpenAndEditModeStatus({
          formId: form.id,
          status: false,
        })
      );
    else
      this.appStore.dispatch(
        switchSchemeFormIsOpenAndEditModeStatus({
          formId: form.id,
          status: true,
        })
      );
  }
}

//get product name from id
public getProductNameFromId(productId: number = 0) {
  const productDetail = this.dropDownProduct.find(
    (item: { productId: number; name: string }) =>
      item.productId == productId ? item : null
  );
  return productDetail ? productDetail.name : '';
}

goEditPage(schemeId: number, productId: number) {
  this.appStore.dispatch(updateSchemeFormsEditMode({ status: true }));
  this.appStore.dispatch(updateSchemeId({ schemeId: schemeId }));
  if (productId != 0)
    this.appStore.dispatch(updateFetchedProductId({ productId: productId }));
}

//reset all data after leaving this view
private resetData() {
  this.appStore.dispatch(resetSchemeFormState());
  this.unsubscribe$.next();
  this.unsubscribe$.complete();
}



//tran generation api function call
public generateTran() {
  let data:any
  this.appStore.select(fetchSchemeLiveDetails).pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
    data=res
  });
     if (data) {
      if(!this.isTran)
      {
         this.Method="create"
         this.FeatureId=28
      }
      else{
         this.Method="Update"
         this.FeatureId=29
      }
        if (data.schemeDetails && data.TranSchemeDetails) {
          const jsonData = JSON.parse(String(data.schemeDetails));
          if (jsonData.schemeCharges != null) {
            let edit: any = data.schemeDetails;
            // let update: any = data.TranSchemeDetails
            let update: any = data.schemeDetails;
            let params = new HttpParams();
            params = params.set('editedData', edit);
            params = params.set('updatedData', update);
            this.isDisable = false;
            this.env
              .generateTran(22, 1, this.FeatureId, 0, this.Method,0,0,params)
              .subscribe(
                (data: any) => {
                  if (data.statusCode == 200) {
                    this.isDisable = true;
                    this.router.navigate(['/'], { relativeTo: this.route });
                    this.env.showSwalAlert(
                      '',
                      'Scheme create request ' +
                        data.result +
                        ' sent for verification successfully !!',
                      'success'
                      ).then(() => {
                        // Call your function here
                        this.DeletePending(jsonData.schemeId)
                      });
                  } else {
                    // Failure
                    this.isDisable = true;
                    this.env.showSwalAlert( '','Something went wrong !!','error');
                  }
                },
                (error: any) => {
                  // Error
                  this.isDisable = true;
                  this.env.showSwalAlert( '','Something went wrong !!','error');
                }
              );
            return;
          }else{
            this.env.showSwalAlert( '','Please fill all the details !!','warning');
          }
        }else{
          this.env.showSwalAlert( '','Please fill all the details !!','warning');
        }
      }
      // });
}
//Delete pending
public DeletePending(schemeTempId:any)
{
  try{
  this.CommonService.DeletePendingEntries(schemeTempId).subscribe(
    (data: any) => {
      if (data.statusCode == 200) {
        // this.envFn.showSwalAlert(
        //   '',
        //   'successfully Deleted!!',
        //   'success'       
        // );
        console.log('Pending Deleted Successfully');
      }
      else this.envFn.showResponseErrorMessage('something went wrong while Deleting schemes')
    },
    (err) => {
      this.envFn.showResponseErrorMessage('something went wrong while Deleting schemes')
    });
}
catch(error){
  this.envFn.showResponseErrorMessage('something went wrong while Deleting schemes')
}
}
//cancel button
public cancel() {
  this.router.navigate(['/'], { relativeTo: this.route });
  this.isDisable = true;
}



//sendBack for review function call
public sendBackReview() {
  let data:any
  this.appStore.select(fetchSchemeLiveDetails).pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
    data=res
  });
     if (data) {
        if (data.schemeDetails && data.TranSchemeDetails) {
          const jsonData = JSON.parse(String(data.schemeDetails));
          if (jsonData.schemeCharges != null) {
      // let update: any = data.TranSchemeDetails
      let update: any = data.schemeDetails;
      let params = new HttpParams();
      params = params.set('updatedData', update);
      // this.isDisable = false;
      this.env.sendBackReview(this.tranId, 22, 1, 28, 'UPDATE', 0, 0, 0, params)
        .subscribe(
          (data: any) => {
            if (data.statusCode == 200) {
              this.router.navigate(['/'], { relativeTo: this.route });
              this.env.showSwalAlert(
                '',
                'Scheme create request ' +
                  data.result +
                  ' sent for verification successfully !!',
                'success'
              );
            } else {
              // Failure
              // this.isDisable = true;
              this.env.showResponseErrorMessage('Something went wrong');
            }
          },
          (error: any) => {
            // Error
            // this.isDisable = true;
            this.env.showResponseErrorMessage('Something went wrong');
          }
        );
        return;
          }
        }
      }
}

//checking for url
public urlChecking() {
  let uid
  let featureId
  let branchId
  this.route.queryParams.subscribe(params => {
    uid = params['uid'];
    featureId = params['featureId'];
    branchId = params['branchId'];
  });
  if (this.route.snapshot.params['editTran']) {
    // this.tranId= 2756
    this.tranId = this.route.snapshot.params["editTran"];
    this.getTransactionData(this.tranId,branchId)
  } else if (this.route.snapshot.params['viewTran']) {
    this.tranId = this.route.snapshot.params["viewTran"];
    this.appStore.dispatch(updateSchemeFormViewOnly({viewOnly:true}))
    this.isViewOnly = true;
    this.getTransactionData(this.tranId,branchId)
    this.appStore
    .select(fetchSchemeFormStateOnContainer)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data) => {
    })
  } else if(this.PendingView){
    this.openModalForPendingDetail()
  }
}

//getTransactionData
public getTransactionData(tranNumber:number,branchId:any){
  this.env.getTransactionData(tranNumber,branchId) .then((res: any) => {
    this.appStore.select(getSchemeFormOnSaveData).subscribe((data: any) => {
      });
  })
  .catch((error: any) => {
    console.error(error);
  });
}
}
