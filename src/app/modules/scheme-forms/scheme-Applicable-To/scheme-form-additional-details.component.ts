import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import {  Subject, takeUntil } from 'rxjs';
import { EnvFunction } from 'src/app/core/env/function/env-function';
import { AppState } from 'src/app/core/store/app.state';
import { showLoader } from 'src/app/core/store/sharedStore/shared.action';
import { SchemeFormService } from '../services/scheme-form.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SchemeFormDocDetailsComponent } from '../scheme-form-doc-details/scheme-form-doc-details.component';
import { validationIsNumber } from 'src/app/core/validation/is-number.validator';
import { EnvVariable } from 'src/app/core/env/variables/env-variable';
import { fetchFetchedSchemeFormState_ApplicableTo } from 'src/app/core/store/schemeFormStore/schemeform.selectors';
import { BranchSelectionComponent } from '../branch-selection/branch-selection.component';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CommonService } from 'src/app/core/env/common-services/common.service';
import Swal from 'sweetalert2';

//inner Model---------------------------------------------------------------------

//document List Type
interface DocumentDetailType {
  docTypeId: number;
  toAmount: string;
  fromAmount: string;
  documentType: number;
  mandatory: string;
}
//-------------------------------------------------------------------------------------------------

@Component({
  selector: 'app-scheme-form-additional-details',
  templateUrl:'./scheme-form-additional-details.component.html',
  styleUrls: ['./scheme-form-additional-details.component.scss'],
})
export class SchemeFormAdditionalDetailsComponent implements OnInit {
  //view variables----------------------------------------------------------------------------
  @ViewChild('docDetailsModal', { static: true }) docModal: TemplateRef<any>;

  //objects-----------------------------------------------------------------------------------
  private unsubscribe$: Subject<void> = new Subject<void>();
  //froms-------------------------------------------------------------------------------------
  public formSchemeAdditionalDetails: FormGroup;
  public formSchemeApplicableTo: FormGroup;
  // public formSchemeDocumentDetails: FormGroup;
  public DropDownApplicableTo: any = [];
  public DropDownApplicableList: any = [];
  public mergeData: any[] = [];
  // public DropDownDocumentList: any = [];

  //other variables---------------------------------------------------------------------------
  public applicableTodetails: any = [];
  public schemeDocuments: DocumentDetailType[] = [];

  public showApplicableZoneList: boolean = false;
  public showApplicableRegionList: boolean = false;
  public showApplicableBranchList: boolean = false;
  
  public showGetApplicableOption: boolean = false;
  public applicableOptionLabel: string = 'Select options';
  public applicableHeadLabel: string = 'options';
  public Add:boolean=false
  private fetchSchemeDetails: any;
  private schemeDetails: any;
  public isTran: boolean = false;
  public viewOnly: boolean = false;
  public submitted:boolean=false;
  branchDetails: any;
  DropDownApplicableList1: any=[];
  //constructor
  constructor(
    private envFn: EnvFunction,
    private fb: FormBuilder,
    private commonService: SchemeFormService,
    private Service: CommonService,
    public dialog: MatDialog,
    private appStore: Store<AppState>
  ) {
    this.appStore.dispatch(showLoader({ status: true }));
  }

  //Life cycle functions--------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.getApplicableToList();
    this.createFormAdditionalDetails();
    this.createFormApplicableTo();
    this.OnChangeApplicableTypeList();
    this.getSchemDetails();
    this.appStore.dispatch(showLoader({ status: false }));
  }

  //store---------------------------------------------------------------------------------------
  //get schemedetails from store and send data to patch the form
  private getSchemDetails() {
    this.appStore
      .select(fetchFetchedSchemeFormState_ApplicableTo)
      .subscribe((data) => {
        (this.fetchSchemeDetails = data.fetchSchemeDetails),
          (this.schemeDetails = data.schemeDetails);
        this.isTran = data.isTran;
        this.viewOnly = data.viewOnly;
        if (this.schemeDetails) this.patchData(this.schemeDetails);
        else if (this.fetchSchemeDetails)
          this.patchData(this.fetchSchemeDetails);
      });
  }

  //Service-------------------------------------------------------------------------------------
  //get GL Code data for listing>>>>>>>>>>>>>>>>>>
  private getApplicableToList() {
    this.commonService
      .getApplicableToList()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (data: any) => {
          if (data.statusCode == 200) {
            this.DropDownApplicableTo = [];
            this.DropDownApplicableTo = data.result;
          } else
            this.envFn.showResponseErrorMessage(
              'something went wrong while fetching Applicable to list'
            );
        },
        (error) => {
          this.envFn.showResponseErrorMessage(
            'something went wrong while fetching Applicable to list'
          );
        }
      );
  }

  //get Zone List
  private getZoneList() {
    // this.DropDownApplicableList = [];
    this.commonService
      .getZoneList()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (data: any) => {
          if (data.statusCode == 200) {
            this.DropDownApplicableList = data.result;
            this.DropDownApplicableList = this.envFn.replaceKey(
              this.DropDownApplicableList,
              'zoneId',
              'branchGroupId'
            );
            this.DropDownApplicableList = this.envFn.replaceKey(
              this.DropDownApplicableList,
              'zone',
              'branchGroup'
            );
            console.log(this.DropDownApplicableList, '1234');
          } else
            this.envFn.showResponseErrorMessage(
              'something went wrong while fetching branches list'
            );
        },
        (error) => {
          this.envFn.showResponseErrorMessage(
            'something went wrong while fetching Branches list'
          );
        }
      );
  }

  //get Region List
  private getRegionList() {
    this.DropDownApplicableList = [];
    this.commonService
      .getRegionList()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (data: any) => {
          if (data.statusCode == 200) {
            this.DropDownApplicableList = data.result;
            this.DropDownApplicableList = this.envFn.replaceKey(
              this.DropDownApplicableList,
              'regionId',
              'branchGroupId'
            );
            this.DropDownApplicableList = this.envFn.replaceKey(
              this.DropDownApplicableList,
              'region',
              'branchGroup'
            );
          } else
            this.envFn.showResponseErrorMessage(
              'something went wrong while fetching branches list'
            );
        },
        (error) => {
          this.envFn.showResponseErrorMessage(
            'something went wrong while fetching Branches list'
          );
        }
      );
  }

  //get branch List
  private getBranchList() {
    // this.DropDownApplicableList = [];
    // this.commonService.getBranchList().pipe(takeUntil(this.unsubscribe$)).subscribe(
    //   (data: any) => {
    //     if (data.statusCode == 200) {
    //       this.DropDownApplicableList = data.result
    //       this.DropDownApplicableList = this.envFn.replaceKey(this.DropDownApplicableList, 'branchId', 'branchGroupId');
    //       this.DropDownApplicableList = this.envFn.replaceKey(this.DropDownApplicableList, 'branchName', 'branchGroup');
    //       console.log(this.DropDownApplicableList)
    //     }
    //     else this.envFn.showResponseErrorMessage('something went wrong while fetching branches list');
    //   },
    //   (error) => { this.envFn.showResponseErrorMessage('something went wrong while fetching Branches list'); }
    // );
  }

  //form----------------------------------------------------------------------------------------------------------------

  //form declaration>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  private createFormAdditionalDetails(): void {
    this.formSchemeAdditionalDetails = this.fb.group({
      schemeApplicableTypeControl: new FormControl(1, [
        Validators.required,
        // validationIsNumber(5, 1),
      ]),
    });
  }

  private createFormApplicableTo(): void {
    this.formSchemeApplicableTo = this.fb.group({
      schemeApplicableToControl: new FormControl('', [
        // Validators.required,
        // Validators.pattern(EnvVariable.patternLastName),
      ]),
    });
  }

  //patch value to the form field
  public patchData(data: any) {
    this.formSchemeAdditionalDetails.patchValue({
      schemeApplicableTypeControl: data.groupTypeId,
    });
    this.setUpApplicableToView(data.groupTypeId);
    this.applicableTodetails = data.schemeBranch;
    this.schemeDocuments = data.schemeDocuments;
    console.log( this.schemeDocuments,' this.schemeDocuments');
    console.log( this.applicableTodetails,' this.applicableTodetails');

  }

  //onChange ApplicableTo
  private OnChangeApplicableTypeList() {
    this.applicableTodetails = []
    this.formSchemeAdditionalDetails
      .get('schemeApplicableTypeControl')
      ?.valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.setUpApplicableToView(data);
        // if(data == 2 || data == 3 || data == 4) this.openModalForBranchSelection();
      });
  }

  //validation
  public getErrorMessage(controlName: string): string {
    if (controlName == 'schemeApplicableTypeControl')
      return this.envFn.getFormError(
        this.formSchemeAdditionalDetails,
        controlName
      );
    else if (controlName == 'schemeApplicableToControl')
      return this.envFn.getFormError(this.formSchemeApplicableTo, controlName);
    else return '';
  }

  //form submission
  public validateForm() {  
    this.submitted=true;   
    if (
      this.formSchemeAdditionalDetails.valid &&
      this.schemeDocuments.length > 0 &&
      ((this.formSchemeAdditionalDetails.get('schemeApplicableTypeControl')?.value!==1 && this.applicableTodetails.length > 0) ||
      (this.formSchemeAdditionalDetails.get('schemeApplicableTypeControl')?.value===1))
    ) {
      const formData = {
        groupTypeId: this.formSchemeAdditionalDetails.get(
          'schemeApplicableTypeControl'
        )?.value,
        schemeBranch:
          this.applicableTodetails.length > 0
            ? this.applicableTodetails
            : [{ branchGroupId: 1, branchGroup: 'organization' }],
        schemeDocuments: this.schemeDocuments,
      };
      if (this.isTran) 
      {
        this.envFn.saveSchemeFormLiveData(3, formData);
        this.submitted=true;  
      } 
      else
     {
      this.submitted=true;  
      this.envFn.saveSchemeFormTempdata(3, formData);
     } 
    }
  }

  //other functions-------------------------------------------------------------------------------------------------------------------------

  private getSchemeApplicableList() {
    if (this.formSchemeAdditionalDetails?.value > 1)
      return this.applicableTodetails;
    return null;
  }

  private getApplicableOptionList() {
    if (this.showApplicableZoneList) this.getZoneList();
    else if (this.showApplicableRegionList) this.getRegionList();
    else if (this.showApplicableBranchList) this.getBranchList();
  }

  private setGetApplicableToOption() {
    this.showGetApplicableOption = true;
  }

  private setUpApplicableToView(id: number) {
    this.applicableTodetails = [];
    this.formSchemeApplicableTo.get('schemeApplicableToControl')?.setValue('');
    console.log(id, 'id');
    if (id == 3) {
      //set Zone
      this.applicableOptionLabel = 'Select Zones';
      this.applicableHeadLabel = 'Zones';
      this.showApplicableZoneList = true;
      this.showApplicableRegionList = false;
      this.showApplicableBranchList = false;
    } else if (id == 2) {
      //set region
      this.applicableOptionLabel = 'Select Regions';
      this.applicableHeadLabel = 'Regions';
      this.showApplicableRegionList = true;
      this.showApplicableZoneList = false;
      this.showApplicableBranchList = false;
    } else if (id == 4) {
      //set branch
      this.DropDownApplicableList=[]
      this.applicableOptionLabel = 'Select Branches';
      this.applicableHeadLabel = 'Branches';
      this.showApplicableBranchList = true;
      this.showApplicableZoneList = false;
      this.showApplicableRegionList = false;
    } else {
      if (id == 1) {
        this.applicableTodetails = [
          { branchGroupId: 1, branchGroup: 'organization' },
        ];
      }
      this.showApplicableZoneList = false;
      this.showApplicableRegionList = false;
      this.showApplicableBranchList = false;
    }
    this.getApplicableOptionList();
    this.setGetApplicableToOption();
  }

  public AddApplicableOption() {
    console.log( this.DropDownApplicableList1,'11111');
    this.DropDownApplicableList = this.DropDownApplicableList.concat(this.DropDownApplicableList1);
    //remove null row
    this.DropDownApplicableList =  this.DropDownApplicableList.filter((item: null) => item !== null);
    this.DropDownApplicableList = this.DropDownApplicableList.filter((item: { branchGroupId: any; }, index: any, self: any[]) =>
    index === self.findIndex((t) => (
    t.branchGroupId === item.branchGroupId
))
);
    console.log(this.DropDownApplicableList,'DropDownApplicableList');
    if (this.formSchemeApplicableTo.valid) {
      const applicableList = this.formSchemeApplicableTo.get('schemeApplicableToControl')?.value;
      const duplicateItems: any[] = [];
      // const mergeData: any[] = [];
      console.log('going to loop lidt dtaaaaaaaa', this.applicableTodetails)

      console.log('selected dataaaa', applicableList)
      applicableList.forEach((id: any) => {
        const isDuplicate = this.applicableTodetails.some((existingItem: any) => existingItem.branchGroupId == id);
        if (isDuplicate) {
          duplicateItems.push(id);
        } else {
          const itemData = this.getMergedApplicableList([id]); // Assuming getMergedApplicableList returns an array
          console.log('itemData',itemData);
          console.log('mergeData0',this.mergeData);
          if(itemData)
          {
            this.mergeData = this.mergeData.concat(itemData);
            console.log('mergeData1',this.mergeData);
          }
          // if(itemData)mergeData.push(itemData);
        }
      });
      console.log('total mereged dataaa', this.mergeData)   
      if (this.mergeData.length > 0) {
        this.applicableTodetails = this.applicableTodetails.concat(this.mergeData);
        console.log('list dataaaa', this.applicableTodetails)
        this.formSchemeApplicableTo.get('schemeApplicableToControl')?.setValue(null);
      }
      if (duplicateItems.length > 0) {
        Swal.fire('', 'Some Multiple Data Removed');
      }

    }
    // this.DropDownApplicableList=[]
    this.DropDownApplicableList1=[]
    this.mergeData=[]
  }


  private getMergedApplicableList(arrayData: any) {
    const mergeData = this.DropDownApplicableList.filter((item: any) =>
      arrayData.includes(item.branchGroupId)
    );

    return mergeData;
  }

  //get product name from id
  public getApplicableToNameFromId(id: number = 0) {
    const listDetails = this.DropDownApplicableList.find(
      (item: { branchGroupId: number; branchGroup: string }) =>
        item.branchGroupId == id ? item : null
    );
    return listDetails ? listDetails.branchGroup : '';
  }

  openModalForBranchSelection() {
    let dialogRef: MatDialogRef<BranchSelectionComponent> = this.dialog.open(
      BranchSelectionComponent,
      {
        width: '350px',
        // ...
      }
    );

    // Optionally, you can subscribe to the afterClosed event to perform actions after the dialog is closed.
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.schemeDocuments.push(result);
    });
  }

  openModalForDocDetail() {
    let dialogRef: MatDialogRef<SchemeFormDocDetailsComponent> =
      this.dialog.open(SchemeFormDocDetailsComponent, {
        width: '1000px',
        // ...
      });

    // Optionally, you can subscribe to the afterClosed event to perform actions after the dialog is closed.
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.schemeDocuments.push(result);
    });
  }

  public removeApplicableToDetails(id: number) {


   
    Swal.fire({
      text: 'Are you sure you want to delete ?',
      icon: 'warning',
      cancelButtonText: 'Cancel',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedData = this.applicableTodetails.filter(
          (item: { branchGroupId: number; branchGroup: string }) =>
            item.branchGroupId !== id
        );
        this.applicableTodetails = updatedData;
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
  public removeDocDetails(index: any) {
    // Swal.fire({
    //   text: 'Do You Want To Delete?',
    //   showCancelButton: true,
    //   confirmButtonColor: '#05a34a',
    //   cancelButtonColor: '#7987a1',
    //   confirmButtonText: 'Yes',
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     this.schemeDocuments.splice(index, 1);
    //   }
    // });
    Swal.fire({
      text: 'Are you sure you want to delete ?',
      icon: 'warning',
      cancelButtonText: 'Cancel',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.schemeDocuments.splice(index, 1);
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

  public goToNextForm() {
    this.envFn.goToNextSchemeForm(3);
  }

  keyup(event: any) {
    // this.schemeBranch.get('branch')?.setValue(null)
    const searchTerm = event.target.value.trim();
    console.log(this.formSchemeApplicableTo.get('schemeApplicableTypeControl')?.valid,'valid');  
    if (searchTerm.length >= 3 && this.showApplicableBranchList == true) {
      this.Service.getBranchBySearch(searchTerm)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((data: any) => {
          console.log(data);
          if(data.result!=null)
          {
            this.DropDownApplicableList = data.result; 
            if(this.DropDownApplicableList)
            {       
            this.DropDownApplicableList = this.envFn.replaceKey(
            this.DropDownApplicableList,
            'branchId',
            'branchGroupId'
          );
          this.DropDownApplicableList = this.envFn.replaceKey(
            this.DropDownApplicableList,
            'branchName',
            'branchGroup'
          );
          }
        }
        });
        this.DropDownApplicableList1 = this.DropDownApplicableList1.concat(this.DropDownApplicableList);
        // this.DropDownApplicableList1 = this.DropDownApplicableList1.filter((item: null) => item !== null); 
      this.DropDownApplicableList = this.DropDownApplicableList1.filter((item: { branchGroupId: any; }, index: any, self: any[]) =>
      index === self.findIndex((t) => (
      t.branchGroupId === item.branchGroupId
  ))
);
    console.log(this.DropDownApplicableList,'lastkeyup');
    
    } else if (searchTerm.length < 3 && this.showApplicableBranchList == true) {
      // this.DropDownApplicableList = [];
      
    }
  }
}
