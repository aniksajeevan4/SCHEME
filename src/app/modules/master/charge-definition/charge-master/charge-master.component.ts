import { Component, Input, OnInit } from '@angular/core';
import { Subject, Subscription, catchError, takeUntil, throwError } from 'rxjs';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { ChargeTypeComponent } from '../charge-type/charge-type.component';
import { ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { MasterState } from '../../../../core/store/master/master.state';
import { addToMaster } from '../../../../core/store/master/master.action';
import { MatSelect } from '@angular/material/select';
import { EnvFunction } from 'src/app/core/env/function/env-function';
import { AppState } from 'src/app/core/store/app.state';
import {
  fetchFetchedSchemeFormState_Charge,
  getSchemeFormOnSaveData,
} from 'src/app/core/store/schemeFormStore/schemeform.selectors';
import Swal from 'sweetalert2';
import { InterestDefinitionService } from '../../service/interest-definition.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { EnvVariable } from 'src/app/core/env/variables/env-variable';
import { ActivatedRoute, Router } from '@angular/router';
import { updateSchemeFormViewOnly } from 'src/app/core/store/schemeFormStore/schemeform.action';
import { CommonService } from 'src/app/core/env/common-services/common.service';

@Component({
  selector: 'app-charge-master',
  templateUrl: './charge-master.component.html',
  styleUrls: ['./charge-master.component.scss'],
})
export class ChargeMasterComponent implements OnInit {
  // variables
  public chargeCodeList: any = [];
  public chargeCode: any = [];
  public chargeCodeSearch: any = null;
  public chargeDefId: number = 0;
  public isTran: boolean = false;
  public schemeDetails: any;
  public fetchSchemeDetails: any;
  public viewOnly: boolean = false;
  public submitted: boolean = false;
  public addEdit: boolean | null;
  public chardeEdit: boolean | null;
  public addDisable: boolean = false;
  public isDisable: boolean = true;
  public navBarHide: boolean = true;
  public formChargeMaster: FormGroup;
  public chargeViewFormCheckbox: FormGroup;
  public maxFromDate: string = new Date().toISOString().split('T')[0];
  @Input() hideButton: boolean|null = false;
  @Input() overRide: boolean = false;
  private unsubscribe$ = new Subject<void>();
  dialogRef: MatDialogRef<ChargeTypeComponent>;
  @ViewChild(ChargeTypeComponent) chargeTypeComponent: ChargeTypeComponent;
  @ViewChild('chargeCodeSelect') chargeCodeSelect!: MatSelect;
  public tranId: number = 0;
  effctiveDate: any;
  chargeCodeList2: any;

  constructor(
    private store: Store<MasterState>,
    private dialog: MatDialog,
    private chargeDefinition: InterestDefinitionService,
    private envFn: EnvFunction,
    private appStore: Store<AppState>,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private commonServices: CommonService
  ) {}

  ngOnInit(): void {
    this.chargeMasterForm();
    this.getChargeCodeList();
    // this.getShemeCharges();
    this.urlChecking();
    this.formCheckboxCharge();
    this.saveChargeDefinitionOverRide();
    this.Formdisable();
  }

  public chargeMasterForm() {
    this.formChargeMaster = this.fb.group({
      chargeCodeId: new FormControl(''),
      chargeCode: new FormControl('', [
        Validators.required,
        Validators.pattern(EnvVariable.patternChargeCode),
        Validators.minLength(4),
      ]),
      effectiveDate: new FormControl('', [Validators.required]),
      ExistingChargeCodeCopy: new FormControl(''),
      effectiveDateList: new FormControl(''),
    });

    this.chargeViewFormCheckbox = this.fb.group({
      chkEditChargeCode: new FormControl(''),
      chkNewChargeCode: new FormControl(''),
      chkNewEffective: new FormControl(''),
      chkOldEffective: new FormControl(''),
    });
  }

  public clearValue() {
    this.chardeEdit = null;
    this.chargeCodeList = [];
    this.chargeViewFormCheckbox.get('chkOldEffective')?.setValue(false);
    this.chargeViewFormCheckbox.get('chkNewEffective')?.setValue(false);
    this.formChargeMaster.reset();
    this.addDisable=false
  }

  public formCheckboxCharge() {
    this.chargeViewFormCheckbox.get(
      'chkEditChargeCode'
    )?.valueChanges.subscribe((value) => {
      if (value) {
        this.formChargeMaster.reset();
        this.chargeViewFormCheckbox.get('chkNewChargeCode')?.setValue(
          false
        );
        this.addEdit = false;
        this.clearValue();
      } else {
        this.clearValue();
        this.addEdit = null;
      }
    });

    this.chargeViewFormCheckbox.get(
      'chkNewChargeCode'
    )?.valueChanges.subscribe((value) => {
      if (value) {
        this.formChargeMaster.reset();
        this.chargeCodeList = [];
        this.chargeViewFormCheckbox.get('chkEditChargeCode')?.setValue(
          false
        );
        this.addEdit = true;
        this.addDisable=true
      } else {
        this.clearValue();
        this.addEdit = null;
      }
    });

    this.chargeViewFormCheckbox.get(
      'chkNewEffective'
    )?.valueChanges.subscribe((value) => {
      if (value) {
        this.chargeViewFormCheckbox.get('chkOldEffective')?.setValue(false);
        this.chardeEdit = true;
        this.addDisable=false
      } else {
        this.formChargeMaster.reset();
        this.chardeEdit = null;
        this.chargeCodeList = [];
      }
    });

    this.chargeViewFormCheckbox.get(
      'chkOldEffective'
    )?.valueChanges.subscribe((value) => {
      if (value) {
        this.chargeViewFormCheckbox.get('chkNewEffective')?.setValue(false);
        this.chardeEdit = false;
        this.addDisable=false
      } else {
        this.formChargeMaster.reset();
        this.chardeEdit = null;
        this.chargeCodeList = [];
      }
    });
    this.formChargeMaster
      .get('effectiveDateList')
      ?.valueChanges.subscribe((value) => {
        if (value)
          this.chargeCodeList = this.chargeCodeList2.filter(
            (item: any) => item.effectiveDate === value
          );
          this.formChargeMaster.patchValue({
            effectiveDate:value,
          });
          this.addDisable = true;
      });

      this.formChargeMaster
      .get('effectiveDate')
      ?.valueChanges.subscribe((value) => {
        if (value && this.formChargeMaster.get('chargeCodeId')?.value)
          this.addDisable = true;
      });
  }

  //dropdown api for getting chargeCode
  private getChargeCodeList() {
    this.chargeDefinition
      .getChargeCode()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (res: any) => {
          if (res.statusCode === 200) {
            this.chargeCode = res.result;
          } else {
            console.log('Something went wrong while fetching Charge Code list');
          }
        },
        (error) => {
          console.log('Error occured'); // Handle subscription error
        }
      );
  }

  //to get and display the values on table from dropdown
  public onClick() {
    this.chargeCodeList = '';
    if (!this.addEdit)
      this.chargeDefId = this.formChargeMaster.get('chargeCodeId')?.value;
    if (this.addEdit)
      this.chargeDefId = this.formChargeMaster.get(
        'ExistingChargeCodeCopy'
      )?.value;
      if(this.chargeDefId)
    this.chargeDefinition
      .getChargeDetailsById(this.chargeDefId)
      .subscribe((res: any) => {
        if (res.statusCode == 200 && res.result) {
          if (this.addEdit) {
            this.chargeCodeList = res.result;
          } else {
            if (this.chardeEdit == true) {
              this.chargeCodeList = res.result;      
              if(this.formChargeMaster.get('effectiveDate')?.value) this.addDisable=true              
          }
          this.formChargeMaster.get('effectiveDateList')?.setValue('')
          this.effctiveDate =[]
          const effectiveDatesSet = new Set(
            res.result.map((res: any) => res.effectiveDate.substring(0, 10))
          );
          this.effctiveDate = Array.from(effectiveDatesSet);
            this.chargeCodeList2 = res.result.map((item: any) => {
              item.effectiveDate = item.effectiveDate.substring(0, 10);
              return item;
            });
          }

          // const data = {
          //   chargeCodeId: this.chargeDefId,
          //   ...res.result,
          // };
          // const isDuplicate = this.chargeCodeList.some(
          //   (item: any) => item.chargeCodeId === this.chargeDefId
          // );
          // if (isDuplicate && this.chargeDefId !== 0) {
          //   Swal.fire("",'Cannot add same Charge Type');
          // } else {
          // this.chargeCodeList.push(data);
          // this.formChargeMaster.patchValue({
          //   effectiveDate: this.chargeCodeList[0].effectiveDate.slice(0, 10),
          // });

          // this.store.dispatch(addToMaster({ data }));
          console.log(this.chargeCodeList, 'this.chargeCodeList');

          // }
        } else {
          Swal.fire('', 'something went wrong');
        }
      });
  }

  // checking for url
  public urlChecking() {
    let uid;
    let featureId;
    let branchId;
    this.route.queryParams.subscribe((params) => {
      uid = params['uid'];
      featureId = params['featureId'];
      branchId = params['branchId'];
    });
    if (this.route.snapshot.params['mastereditTran']) {
      this.tranId = this.route.snapshot.params['mastereditTran'];
      console.log(this.tranId, uid, featureId, branchId);
      this.getTransactionData(this.tranId, branchId);
    } else if (this.route.snapshot.params['masterviewTran']) {
      this.tranId = this.route.snapshot.params['masterviewTran'];
      this.getTransactionData(this.tranId, branchId);
            this.viewOnly = true;

      this.formChargeMaster.disable();
      this.chargeViewFormCheckbox.disable()
      this.formChargeMaster.get('effectiveDateList')?.disable()
      // this.hideButton = true;
    } else if (this.hideButton) {
      this.navBarHide=false
      this.getShemeCharges();
    } else if (this.overRide) {
      this.navBarHide=false
      if(this.route.snapshot.params['overRideViewTran'] ){
      // this.viewOnly = true;
      this.formChargeMaster.disable();
      this.chargeViewFormCheckbox.disable()
      }
      this.hideButton = this.route.snapshot.params['overRideViewTran'] ? null : false;
      this.addEdit = true
      this.addDisable=true
      this.chargeCodeList = this.commonServices.override.schemeCharges
      this.chargeCodeSearch = { result: 'false' };
      if(this.chargeCodeList.length>0){
        this.formChargeMaster.patchValue({
       chargeCode: this.chargeCodeList[0].chargeCode,
       effectiveDate: this.chargeCodeList[0].effectiveDate,
     });
     }
    }
    else {
      this.addOrEdit();
    }
  }
  //Disable form on view mode
  private Formdisable() {
    if (this.viewOnly) {
      this.chargeViewFormCheckbox.disable();
      this.formChargeMaster.disable()
    }
  }
  private getShemeCharges() {
    this.appStore
      .select(fetchFetchedSchemeFormState_Charge)
      .subscribe((data) => {
        (this.fetchSchemeDetails = data.fetchSchemeDetails),
          (this.schemeDetails = data.schemeDetails);
        this.isTran = data.isTran;
        this.viewOnly = data.viewOnly;        
        if (this.schemeDetails) {
          this.chargeCodeList = this.schemeDetails;
          console.log(this.chargeCodeList[0].effectiveDate,'fsfadfadad');
          this.chargeDefId = this.chargeCodeList[0].chargeDefId;
          const effectiveDatesSet = new Set(
            this.chargeCodeList.map((res: any) => res.effectiveDate.substring(0, 10))
          );
          this.effctiveDate = Array.from(effectiveDatesSet);
          this.formChargeMaster.patchValue({
            chargeCodeId: this.chargeCodeList[0].chargeDefId,
            effectiveDateList: this.chargeCodeList[0].effectiveDate,
            effectiveDate: this.chargeCodeList[0].effectiveDate,
          });
        } else if (this.fetchSchemeDetails) {
          this.chargeCodeList = this.fetchSchemeDetails;
          this.chargeDefId = this.chargeCodeList[0].chargeDefId;
          const effectiveDatesSet = new Set(
            this.chargeCodeList.map((res: any) => res.effectiveDate.substring(0, 10))
          );
          this.effctiveDate = Array.from(effectiveDatesSet);
          // this.chargeCodeList = this.schemeDetails;
          this.formChargeMaster.patchValue({
            chargeCodeId: this.chargeCodeList[0].chargeDefId,
            effectiveDateList: this.chargeCodeList[0].effectiveDate,
            effectiveDate: this.chargeCodeList[0].effectiveDate,
          });
        }
        // else  this.chargeCodeList =this.sampleVariable
      });
  }

  public bodyChargeCodeList() {
    let chargeDefId: number;
    let chargeCode: string;
    let mode:boolean |null;
    if (!this.addEdit) {
      chargeDefId = this.chargeDefId;
      if(this.chargeDefId)
      chargeCode = this.envFn.getDescriptionById(
        this.chargeCode,
        'chargeDefId',
        this.chargeDefId,
        'chargeCode'
      );
      if(this.chardeEdit)mode=true
      if(this.chardeEdit==false)mode=false
    } else {
      chargeDefId = 0;
      chargeCode = this.formChargeMaster.get('chargeCode')?.value;
      mode=null
    }

    this.chargeCodeList = this.chargeCodeList.map((item: any) => ({
      ...item,
      effectiveDate:this.envFn.formattedDate( this.formChargeMaster.get('effectiveDate')?.value),
      chargeDefId: chargeDefId,
      chargeCode: chargeCode,
      mode:mode
    }));
  }

  public TranGeneration() {
    this.bodyChargeCodeList();
    let edit: any = { chargeDetails: this.chargeCodeList };
    let update: any = { chargeDetails: this.chargeCodeList };
    let params = new HttpParams();
    params = params.set('updatedData', JSON.stringify(update));
    if (this.route.snapshot.params['mastereditTran']) {
      this.isDisable = false;
      this.envFn
        .sendBackReview(this.tranId, 22, 1, 33, 'UPDATE', 0, 0, 0, params)
        .subscribe(
          (data: any) => {
            this.isDisable = false;
            if (data.statusCode == 200) {
              this.router.navigate(['/'], { relativeTo: this.route });
              this.envFn.showSwalAlert(
                '',
                'Charge Code request ' +
                  data.result +
                  ' sent for verification successfully !!',
                'success'
              );
            } else {
              // Failure
              this.isDisable = true;
              this.envFn.showResponseErrorMessage('Something went wrong');
            }
          },
          (error: any) => {
            // Error
            this.isDisable = true;
            this.envFn.showResponseErrorMessage('Something went wrong');
          }
        );
    } else {
      params = params.set('editedData', JSON.stringify(edit));
      this.isDisable = false;
      this.envFn.generateTran(22, 1, 33, 0, 'create', 0, 0, params).subscribe(
        (data: any) => {
          this.isDisable = false;
          if (data.statusCode == 200) {
            this.isDisable = true;
            this.router.navigate(['/'], { relativeTo: this.route });
            // this.router.navigate(['/master/charge-master'], { relativeTo: this.route });
            this.envFn.showSwalAlert(
              '',
              'Charge Code request ' +
                data.result +
                ' sent for verification successfully !!',
              'success'
            );
          } else {
            // Failure
            this.isDisable = true;
            this.envFn.showSwalAlert('', 'Something went wrong !!', 'error');
          }
        },
        (error: any) => {
          // Error
          this.isDisable = true;
          this.envFn.showSwalAlert('', 'Something went wrong !!', 'error');
        }
      );
    }
  }

  //save the table into scheme
  public saveChargeDefinition(): void {
    if (this.formChargeMaster.get('effectiveDateList')?.valid) {
    this.bodyChargeCodeList();
    if (this.isTran) this.envFn.saveSchemeFormLiveData(6, this.chargeCodeList);
    else this.envFn.saveSchemeFormTempdata(6, this.chargeCodeList);
    }
  }

  public saveChargeDefinitionMaster() {
    this.submitted = true;
    if (this.addEdit) {
      if (
        this.formChargeMaster.valid &&
        this.chargeCodeSearch.result === 'false'
      ) {
        this.TranGeneration();
      }
    } else {
      if(this.formChargeMaster.get('effectiveDate')?.valid ){
      this.TranGeneration();
    }
  }
  }

  public saveChargeDefinitionOverRide() {
    this.bodyChargeCodeList();
    this.commonServices.override.schemeCharges = this.chargeCodeList;
  }

  public getTransactionData(tranNumber: number, branchId: any) {
    this.envFn
      .getCommonTransactionData(tranNumber, branchId)
      .then((res: any) => {
        let chargeDetails= JSON.parse(res[0].updatedData).chargeDetails;
        this.chargeCodeList =chargeDetails
        if (this.chargeCodeList[0].chargeDefId != 0) {
          this.chargeViewFormCheckbox.get('chkEditChargeCode')?.setValue(true)
          if(chargeDetails[0].mode)  this.chargeViewFormCheckbox.get('chkNewEffective')?.setValue(true)
          if(chargeDetails[0].mode==false)  this.chargeViewFormCheckbox.get('chkOldEffective')?.setValue(true)
          this.chargeCodeList = JSON.parse(res[0].updatedData).chargeDetails;
          this.addEdit = false;
          this.chargeDefId = this.chargeCodeList[0].chargeDefId;
          const effectiveDatesSet = new Set(
            this.chargeCodeList.map((res: any) => res.effectiveDate.substring(0, 10))
          );
          this.effctiveDate = Array.from(effectiveDatesSet);
          // alert(this.chargeCodeList[0].effectiveDate)

          this.formChargeMaster.patchValue({
            chargeCodeId: this.chargeCodeList[0].chargeDefId,
            effectiveDateList: this.chargeCodeList[0].effectiveDate,
            effectiveDate: this.chargeCodeList[0].effectiveDate,
          });
        } else {
          this.chargeViewFormCheckbox.get('chkNewChargeCode')?.setValue(true)
          this.addEdit = true;
          this.addDisable=true
        this.chargeCodeList = JSON.parse(res[0].updatedData).chargeDetails;
          this.chargeCodeSearch = { result: 'false' };
          this.formChargeMaster.patchValue({
            chargeCode: this.chargeCodeList[0].chargeCode,
            effectiveDate: this.chargeCodeList[0].effectiveDate,
          });
        }
        console.log(this.chargeCodeList, 'resresresres');
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  //deleting rows from table
  public deleteChargeCode(index: number): void {
    Swal.fire({
      text: 'Are you sure you want to delete ?',
      icon: 'warning',
      cancelButtonText: 'Cancel',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
          this.chargeCodeList.splice(index, 1); 
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

  //for adding new  values
  public addOpenModal(): void {
    const dialogConfig: MatDialogConfig<any> = {
      panelClass: 'custom',
      disableClose: true,
      data: {
        isEditMode: true,
        chargeTypeId: this.chargeTypeId(),
        chargeCoddeLists: this.chargeCodeList,
      },
    };
    const dialogRef = this.dialog.open(ChargeTypeComponent, dialogConfig);
    dialogRef.componentInstance.chargeDefinitionSaved.subscribe(
      (chargeDefinition: any) => {
        // this.chargeCodeList.push(chargeDefinition);
        this.chargeCodeList = chargeDefinition;
        dialogRef.close();
      }
    );

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  //for editing new added values only
  public editOpenModal(chargeCodeList: any, index: any): void {
    let chargeLists;
    if (this.addEdit) {
      chargeLists = this.chargeCodeList;
    } else {
      if (this.chardeEdit == false) chargeLists = this.chargeCodeList;
      if (this.chardeEdit) chargeLists = this.chargeCodeList2;
    }

    console.log(chargeLists, 'chargeLists');

    const dialogConfig: MatDialogConfig<any> = {
      panelClass: 'custom',
      disableClose: true,
      data: {
        isEditMode: false,
        chargeCodeList: chargeCodeList,
        chargeTypeId: this.chargeTypeId(),
        chargeCoddeLists: this.chargeCodeList,
        index: index,
      },
    };
    this.dialogRef = this.dialog.open(ChargeTypeComponent, dialogConfig);
    this.dialogRef.afterOpened().subscribe(() => {
      const chargeTypeComponentInstance = this.dialogRef
        .componentInstance as ChargeTypeComponent;
      chargeTypeComponentInstance.getChargeDefinition();
    });
    this.dialogRef.componentInstance.chargeDefinitionSaved.subscribe(
      (chargeDefinition: any) => {
        // if (chargeDefinition) {
        //  const rowIndex = this.chargeCodeList.findIndex(
        //    (item: any) => item === chargeCodeList
        //  );
        //  this.chargeCodeList[rowIndex] = chargeDefinition;
        this.chargeCodeList = chargeDefinition;

        this.dialogRef.close();
      }
    );
  }

  // public editOpenModal(chargeCodeList: any): void {
  //  console.log(this.chargeTypeId());

  //   const dialogConfig: MatDialogConfig<any> = {
  //     panelClass: 'custom',
  //     disableClose: true,
  //     data: {
  //       isEditMode: false,
  //       chargeCodeList: chargeCodeList,
  //       chargeTypeId:this.chargeTypeId()
  //     },
  //   };
  //   this.dialogRef = this.dialog.open(ChargeTypeComponent, dialogConfig);
  //   this.dialogRef.afterOpened().subscribe(() => {
  //     const chargeTypeComponentInstance = this.dialogRef
  //       .componentInstance as ChargeTypeComponent;
  //     chargeTypeComponentInstance.getChargeDefinition();
  //   });
  //   this.dialogRef.componentInstance.chargeDefinitionSaved.subscribe(
  //     (chargeDefinition: any) => {
  //       // if (chargeDefinition) {
  //       const rowIndex = this.chargeCodeList.findIndex(
  //         (item: any) => item === chargeCodeList
  //       );
  //       this.chargeCodeList[rowIndex] = chargeDefinition;
  //       this.dialogRef.close();
  //     }
  //   );
  // }

  public chargeTypeId() {
    if (this.chargeCodeList.length > 0) {
      const chargeTypeId = this.chargeCodeList.map((charge: any) =>
        Number(charge.chargeTypeId)
      );
      return chargeTypeId;
    }
  }

  public clear(): void {
    this.chargeCodeList = [];
    this.chargeCodeSelect.value = '';
  }

  public goToNextForm() {
    this.envFn.goToNextSchemeForm(6);
  }

  public addOrEdit() {
    // Swal.fire({
    //   title: '',
    //   text: 'Do you want to add or edit Charge Code?',
    //   icon: 'question',
    //   showCancelButton: true,
    //   confirmButtonText: 'Add',
    //   cancelButtonText: 'Edit',
    //   confirmButtonColor: '#05a34a',
    //   cancelButtonColor: '#6571ff',
    // });
    // .then((result) => {
    //   if (result.isConfirmed) {
    //     this.addEdit = true;
    //   } else if (result.dismiss === Swal.DismissReason.cancel) {
    //     this.addEdit = false;
    //     this.addDisable = false;
    //     this.formChargeMaster.get('chargeCode')?.clearValidators();
    //     this.formChargeMaster.get('chargeCode')?.updateValueAndValidity();
    //     this.formChargeMaster.get('effectiveDate')?.clearValidators();
    //     this.formChargeMaster.get('effectiveDate')?.updateValueAndValidity();
    //   // this.formChargeMaster.get('effectiveDate')?.disable()

    //   }
    // });
  }

  public searchChargeCode(event: any) {
    let chargeCode = event.target.value;
    let length = event.target.value.length;
    if (length > 3 && this.formChargeMaster.value.chargeCode) {
      this.chargeDefinition
        .searchChargeCode(chargeCode)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res: any) => {
          this.chargeCodeSearch = res;
          console.log(this.chargeCodeSearch, 'abcd');
        });
    } else {
      this.chargeCodeSearch = '';
      // this.ifsc = '';
      // this.ifscMessage = 200;
    }
  }

  //validation>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public getErrorMessage(controlName: string): string {
    return this.envFn.getFormError(this.formChargeMaster, controlName);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
