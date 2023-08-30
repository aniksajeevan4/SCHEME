import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EnvFunction } from 'src/app/core/env/function/env-function';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.state';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { EditModalComponent } from '../edit-modal/edit-modal.component';
import { InterestDefinitionService } from '../../service/interest-definition.service';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/core/env/common-services/common.service';
import { editedData, fetchSchemeFormStateOnContainer, fetchSchemeLiveDetails, getSchemeFormOnSaveData, getSchemeFormOnSaveDatas } from 'src/app/core/store/schemeFormStore/schemeform.selectors';
import { updateSchemeFormViewOnly } from 'src/app/core/store/schemeFormStore/schemeform.action';
@Component({
  selector: 'app-scheme-branch-limit',
  templateUrl: './scheme-branch-limit.component.html',
  styleUrls: ['./scheme-branch-limit.component.scss']
})
export class SchemeBranchLimitComponent implements OnInit {

  //objects>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  private unsubscribe$: Subject<void> = new Subject<void>();

  //view variables
  @ViewChild('myTable', { static: true }) myTable!: ElementRef;
  //form Variables>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  schemeBranch: FormGroup;
  branches: any[] = [];
  dialogRef: MatDialogRef<EditModalComponent>;
  public schemeList: any = [];
  public tableData: any = [];
  public DropDownApplicableTo: any = [];
  public zoneList: any = []
  public regionList: any = []
  public getschemes: any = []
  // additional variables>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public selectedScheme: number = 0;
  public submitted = false
  public isDropdownDisplayed = false;
  public Amount: number = 0
  public loanSum: number = 0
  public buttonshow: boolean = false
  public disableButton = true;
  successMessage = '';
  branchess: any
  branchDetails: any;
  schemeDetails: any;
  tranId: number = 0;
  public isViewOnly: boolean = false;
  public isDisable: boolean = true;
  public patchVariable: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private envFn: EnvFunction,
    private http: InterestDefinitionService,
    private common: CommonService,
    private appStore: Store<AppState>,
    private dialog: MatDialog
  ) {

  }


  ngOnInit(): void {
    this.CreateBranchForm()
    this.getSchemeList()
    this.FormValueChanges()
    this.isDropdownDisplayed = true;
    this.onChangeScheme()
    this.urlChecking()
  }


  //form declaration>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  private CreateBranchForm(): void {
    this.schemeBranch = this.fb.group({
      scheme: new FormControl('', [Validators.required]),
      branch: new FormControl(null, [Validators.pattern('[0-9]*')]),
      maximumAmount: new FormControl('', [Validators.pattern('^[1-9][0-9]*$')]),
      activeLoans: new FormControl('', [Validators.pattern('^[1-9][0-9]*$')]),

    })
  }

  //generateTran in  Scheme Branch Limit>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  generateTran() {
    var userId = 22
    var branchId = 1
    var featureId = 30
    var Amount = this.Amount;
    var Method = 'CREATE';
    var incAuthcount = 0
    let loanCount = this.loanSum;
    console.log('table Datalll - ', this.tableData);
    let edit: any = {
      branchLimitDetails: this.tableData
    }

    let update: any = {
      branchLimitDetails: this.tableData
    };
    let params = new HttpParams();
    params = params.set('editedData', JSON.stringify(edit));
    params = params.set('updatedData', JSON.stringify(update));
    this.isDisable = false;
    this.buttonshow = true
    this.envFn
      .generateTran(
        userId,
        branchId,
        featureId,
        Amount,
        Method,
        incAuthcount,
        loanCount,
        params
      )
      .subscribe(
        (res: any) => {

          this.successMessage =
            'Scheme Branch Limit request ' +
            res.result +
            ' sent for verification successfully';
          if (res.statusCode == 200) {
            this.buttonshow = true
            Swal.fire({
              icon: 'success',
              title: '',
              text: this.successMessage,
              showCloseButton: true,

            }).then((result) => {
              this.router.navigateByUrl('/scheme')
            });
            this.Amount = 0;

          } else {
            this.isDisable = true;
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              title: 'Scheme Branch Limit request Failed',
              icon: 'error',
              showCloseButton: true,
            });
          }
        },
        (err: HttpErrorResponse) => {
          this.buttonshow = false
          this.isDisable = true;

          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            title: 'Something went wrong',
            icon: 'error',
            showCloseButton: true,
          });
        }
      );
  }


  //getTransactionData for scheme branch limit>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public getTransactionData(tranNumber: number, branchId: any) {
    this.envFn.getTransactionDataCommon(tranNumber, branchId).then((res: any) => {
      this.appStore.select(editedData).subscribe((data: any) => {
        this.patchVariable = data.branchLimitDetails[0]
      });
    })
      .catch((error: any) => {
        console.error(error);
      });
  }

  //checking for url for EditTran and ViewTran checking>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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
      this.tranId = this.route.snapshot.params["editTran"];
      this.getTransactionData(this.tranId, branchId)
      this.appStore.select(editedData).subscribe((data: any) => {
        this.patchVariable = data.branchLimitDetails[0]
        this.branches = [{ branchId: this.patchVariable.BranchId, branchName: this.patchVariable.BranchName }];
        this.schemeBranch.patchValue({
          branch: this.branches[0].branchId,
          maximumAmount: this.patchVariable.MaxAmount,
          activeLoans: this.patchVariable.MaxNumberOfLoan,
          scheme: this.patchVariable.SchemeId,
        });
        this.branchLimitApply()
      });
    }
    else if (this.route.snapshot.params['viewTran']) {
      this.tranId = this.route.snapshot.params["viewTran"];
      this.getTransactionData(this.tranId, branchId)
      this.appStore.select(editedData).subscribe((data: any) => {

        // if (data) {
          this.patchVariable = data.branchLimitDetails[0]
          this.branches = [{ branchId: this.patchVariable.BranchId, branchName: this.patchVariable.BranchName }];
          this.schemeBranch.patchValue({
            branch: this.branches[0].branchId,
            maximumAmount: this.patchVariable.MaxAmount,
            activeLoans: this.patchVariable.MaxNumberOfLoan,
            scheme: this.patchVariable.SchemeId,
          });
          this.branchLimitApply()
       
        // }
        this.isViewOnly = true;

        this.schemeBranch.disable()
        
      });

    }
  }


  //sendBack for review function call>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public sendBackReview() {
    let update: any = {
      branchLimitDetails: [{
        scheme: this.schemeBranch.get("scheme")?.value,
        branch: this.schemeBranch.get("branch")?.value,
        maximumAmount: this.schemeBranch.get("maximumAmount")?.value,
        activeLoans: this.schemeBranch.get("activeLoans")?.value,
      }]
    };
    let params = new HttpParams();
    params = params.set('updatedData', JSON.stringify(update));
    this.isDisable = false;
    this.buttonshow = true
    this.envFn.sendBackReview(this.tranId, 22, 1, 28, 'UPDATE', 0, 0, 0, params)
      .subscribe(
        (data: any) => {
          this.successMessage =
            'Scheme Branch Limit request ' +
            data.result +
            ' sent for verification successfully';
          if (data.statusCode == 200) {
            this.buttonshow = true
            Swal.fire({
              icon: 'success',
              title: '',
              text: this.successMessage,
              showCloseButton: true,

            }).then((result) => {
              this.router.navigateByUrl('/scheme')
            });
          } else {
            this.isDisable = true;
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              title: 'Scheme Branch Limit request Failed',
              icon: 'error',
              showCloseButton: true,
            });
            this.envFn.showResponseErrorMessage('Something went wrong');
          }
        },
        (error: any) => {
          this.buttonshow = false
          this.isDisable = true;
          this.envFn.showResponseErrorMessage('Something went wrong');
          (err: HttpErrorResponse) => {
            this.buttonshow = false
            this.isDisable = true;

            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              title: 'Something went wrong',
              icon: 'error',
              showCloseButton: true,
            });
          }
        }
      );

  }
  //validation>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public getErrorMessage(controlName: string): string {
    return this.envFn.getFormError(this.schemeBranch, controlName);
  }


  //formValueChanges>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  private FormValueChanges() {
    this.schemeBranch.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      if (Number(this.schemeBranch.get('branch')?.value) > 0) this.disableButton = false
      else this.disableButton = true
    });
  }


  //apply the deafult value to all branches>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public branchLimitApply() {
    this.submitted = true;

    if (this.schemeBranch.valid) {
      const schemeValue = this.schemeBranch.get('scheme')!.value;
      const branchValue = this.schemeBranch.get('branch')!.value;
      const maximumAmountValue = this.schemeBranch.get('maximumAmount')!.value;
      const activeLoansValue = this.schemeBranch.get('activeLoans')!.value;
      const branchName = this.getBranchNameFromId(branchValue)
      // Create an object with the form values
      const newObject = {
        BranchId: branchValue,
        BranchName: branchName,
        MaxAmount: maximumAmountValue,
        MaxNumberOfLoan: activeLoansValue,
        SchemeId: schemeValue,

      };

      // Check if the newObject already exists in the tableData array
      const isDuplicate = this.tableData.some((item: any) => {
        return (
          item.BranchId === newObject.BranchId &&
          item.MaxAmount === newObject.MaxAmount &&
          item.MaxNumberOfLoan === newObject.MaxNumberOfLoan &&
          item.SchemeId === newObject.SchemeId &&
          item.BranchName === newObject.BranchName
        );
      });

      if (!isDuplicate) {
        // Add the new object to the tableData array
        this.tableData.push(newObject);
      } else {
      }
    }
  }



  //for editing new added vales only>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public openEditModal(row: any): void {
    const dialogConfig: MatDialogConfig<any> = {
      panelClass: 'custom',
      disableClose: true,
      width: '50%',
      height: 'fit-content',
      data: {
        isEditMode: false,
        row: row,
        branchDetails: this.branchDetails,
        schemeDetails: this.schemeDetails
      },
    };
    console.log(this.branchDetails, "test-10");

    this.dialogRef = this.dialog.open(EditModalComponent, dialogConfig);
    this.dialogRef.afterOpened().subscribe(() => {
      const chargeTypeComponentInstance = this.dialogRef
        .componentInstance as EditModalComponent;
      chargeTypeComponentInstance.getChargeDefinition();
    });
    this.dialogRef.componentInstance.chargeDefinitionSaved.subscribe(
      (chargeDefinition: any) => {
        const rowIndex = this.tableData.findIndex(
          (item: any) => item === row
        );

        console.log(chargeDefinition, 'jijijijiiiiiiiiiiiii')
        this.tableData[rowIndex] = chargeDefinition;
        this.tableData[rowIndex].BranchName = this.getBranchNameFromId(this.tableData[rowIndex].BranchId)
        console.log(this.tableData, "table data on modal close");
        this.dialogRef.close();
      }
    );

  }

  //Scheme for Valuecahange>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  onChangeScheme() {
    this.schemeBranch.get('scheme')?.valueChanges.subscribe(
      (data) => {
        if (!this.isViewOnly) this.getScheme(data);
      }
    );
  }

  //scheme list onChange function>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public getScheme(schemeId: any): void {
    this.tableData = []
    this.http
      .SchemeList(schemeId)
      .subscribe((res: any) => {
        console.log(res, "viljoooooooo");

        if (res.statusCode == 200) {
          this.getschemes = res.result
          if (res.result[0].groupTypeId == 1) this.schemeBranch.get('all_branch')?.setValue(res.result[0].groupTypeId)
          if (res.result[0].groupTypeId == 2) this.schemeBranch.get('region')?.setValue(res.result[0].groupTypeId)
          if (res.result[0].groupTypeId == 3) this.schemeBranch.get('zone')?.setValue(res.result[0].groupTypeId)
          if (res.result[0].groupTypeId == 4) this.schemeBranch.get('specific_Branch')?.setValue(res.result[0].groupTypeId)
        } else {
          this.getschemes = []
        }
      });
  }


  //dropdown api for getting SchemeList>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  private getSchemeList() {
    this.common.getSchemeList(false,1).pipe(takeUntil(this.unsubscribe$)).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.schemeList = res.result;
      } else {
        this.schemeList = []
      }
    },
      (error) => {
        console.log('Error occured'); // Handle subscription error
      }
    );
  }


  //get branch in 3 letter after result in dropdown>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  keyup(event: any) {
    const searchTerm = event.target.value.trim();
    if (searchTerm.length >= 3) {
      this.getBranches(searchTerm);
    }
  }

  //get
  getBranches(searchData: string = '') {
    this.common.BranchList(searchData, this.schemeBranch.get('scheme')!.value).subscribe((res: any) => {
      this.branches = res.result.filter((branch: any) => {
        return branch.branchName.toLowerCase().startsWith(searchData.toLowerCase());

      });

    });
  }

  //cancel Scheme Charge>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  cancelSchemeCharge() {
    this.isDisable = true;
    this.tableData = []
    this.schemeBranch.controls['scheme'].reset()
    this.schemeBranch.controls['branch'].reset()
    this.schemeBranch.controls['maximumAmount'].reset()
    this.schemeBranch.controls['activeLoans'].reset()
    this.getschemes = []
    this.branches = []

  }

  //get branch name from id>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public getBranchNameFromId(branchId: number = 0) {
    this.branchDetails = this.branches.find((item: { branchId: number; branchName: string }) => (item.branchId == branchId) ? item : null)
    console.log(this.branchDetails, "test-5");
    return this.branchDetails ? this.branchDetails.branchName : '';

  }

  //get scheme name from id>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public getSchemeNameFromId(schemeId: number = 0) {
    console.log(this.schemeDetails, "vvvvvvvvv");

    this.schemeDetails = this.schemeList.find((item: { schemeId: number; name: string }) => (item.schemeId == schemeId) ? item : null)
    return this.schemeDetails ? this.schemeDetails.name : '';

  }
}