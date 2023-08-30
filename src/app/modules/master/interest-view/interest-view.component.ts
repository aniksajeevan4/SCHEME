import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EnvFunction } from 'src/app/core/env/function/env-function';
import { InterestDefinitionService } from '../service/interest-definition.service';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { InterestDefinitionComponent } from '../interest-definition/interest-definition.component';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.state';
import { fetchFetchedSchemeFormState_intrest_View } from 'src/app/core/store/schemeFormStore/schemeform.selectors';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EnvVariable } from 'src/app/core/env/variables/env-variable';
import { CommonService } from 'src/app/core/env/common-services/common.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-interest-view',
  templateUrl: './interest-view.component.html',
  styleUrls: ['./interest-view.component.scss'],
  providers: [DatePipe]

})
export class InterestViewComponent implements OnInit {
  //froms------------------
  public InterestRateCode: any = [];
  public InterestViewForm: FormGroup;
  public InterestViewFormCheckbox: FormGroup;
  public selectedInterestRateCode: any = -1;
  public schemeinterestRatebyid: any = [];
  public SchemeInterestDefinition: any = [];
  dialogRef: MatDialogRef<InterestDefinitionComponent>;
  fetchSchemeDetails: any;
  schemeDetails: any;
  isTran: any;
  viewOnly: boolean;
  @Input() hideButton: boolean = false;
  @Input() viewSaveScheme: boolean = false;
  @Input() hideButtonOverride: boolean = true;
  

  //variables----------------
  public copyvalid: boolean = false;
  public hide: boolean = false;
  public AddInterestCode: boolean = false;
  public EditInterestCode: boolean = false;
  public NewEffectiveDate:boolean=false;
  public OldEffectiveDate:boolean=false;
  public submitted:boolean=false;
  public validinterestcode:any;
  public interestcodests:string="false";
  public fromdate:any;
  public tranId: any;
  foroldeffectiveschemeinterestRatebyid: any;
  viewSave: boolean;
  public TodayDate: string = new Date().toISOString().split('T')[0];
  isConfirm: boolean;
  
  //constructor---------------
  constructor(
    private fb: FormBuilder,
    private http: InterestDefinitionService,
    private dialog: MatDialog,
    private envFn: EnvFunction,
    private appStore: Store<AppState>,
    private router: Router,
    private actRoute: ActivatedRoute,
    private commonServices: CommonService,
    private datePipe: DatePipe
  ) {
  }
  ngOnInit(): void {
    this.CreateInterestViewForm();
    this.getInterestRateCode();
    this.getSchemDetails();
    this.pathCheck()
    this.Formdisable();
  }
  private getSchemDetails() {
    try {
      this.appStore
        .select(fetchFetchedSchemeFormState_intrest_View)
        .subscribe((data) => {
          this.isTran = data.isTran;
          this.viewOnly = data.viewOnly;
          if (data.schemeDetails) {
            this.patchData(data.schemeDetails);
          } else if (data.fetchSchemeDetails) {
            this.fetchSchemeDetails = data.fetchSchemeDetails
              this.patchData(data.fetchSchemeDetails);
          }
        });
    } catch (error) {
      this.envFn.showResponseErrorMessage(
        'Something went wrong while fetching data from store'
      );
    }
  }

  //Disable form on view mode
  private Formdisable() {
    if (this.viewOnly) {
      this.InterestViewForm.disable();
      this.InterestViewFormCheckbox.disable()
    }
  }

  //form----------------------------------------------------------------------------------------------------------------
  //form declaration>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  private CreateInterestViewForm(): void {
    this.InterestViewFormCheckbox= this.fb.group({
      chkEditInterestCode: new FormControl(''),
      chkNewInterestCode: new FormControl(''),
      chkNewEffective: new FormControl(''),
      chkOldEffective: new FormControl(''),
    });
    this.InterestViewForm = this.fb.group({
      ExistingInterestRateCode: new FormControl('', [Validators.required]),
      ExistingInterestRateCodeCopy: new FormControl(''),
      EffetivefromDate: new FormControl('', [Validators.required]),
      TxtInterestRateCode: new FormControl('', [Validators.required,Validators.pattern(EnvVariable.patternAlphaNumernospace),]),
      DdnOldEffectiveDate: new FormControl('',[Validators.required]),
    });
  }
  //  isValidDateFormat(dateStr: string) {
  //   const dateRegex = /^\d{2}-\d{2}-\d{4}$/; // dd-MM-yyyy format
  //   return dateRegex.test(dateStr);
  // }
  public patchData(data: any) {
 console.log(data,'data');
 
    try {
   
      const isValidDate = this.envFn.isValidDateFormat(data[0]?.fromDate);
      if(!isValidDate)
      {
        const uniqueFromDates = new Set<string>();
        for (let obj of data) {
          if (obj.fromDate) {
            const date = new Date(obj.fromDate);
            obj.fromDate = this.datePipe.transform(date,'dd-MM-yyyy');
            uniqueFromDates.add(obj.fromDate);
          }
        }     
      this.fromdate = Array.from(uniqueFromDates);
      }
      else
      {
        this.fromdate =[data[0].fromDate];
      }
   
    console.log(this.fromdate,'this.fromdateafter');
    
    this.schemeinterestRatebyid = data;    
    this.InterestViewForm.controls['ExistingInterestRateCode'].setValue(this.schemeinterestRatebyid[0].interestDefId)
    this.InterestViewForm.controls['DdnOldEffectiveDate'].setValue(this.schemeinterestRatebyid[0].fromDate)

    } catch (err) {
      console.log('Something went wrong while patching data');
    }
  }
  //Service-------------------------------------------------------------------------------------
  //get Interest Rate Code data for listing>>>>>>>>>>>>>>>>>>
  private getInterestRateCode() {
    this.http.getinterestcodelist().subscribe((res: any) => {
      this.InterestRateCode = res.result;
    });
  }
  //get interestrate code Edit
  public onOptionChange()
  {
   this.InterestViewForm.controls['DdnOldEffectiveDate'].setValue("")
    this.schemeinterestRatebyid = [];
    this.selectedInterestRateCode =
      this.InterestViewForm.get('ExistingInterestRateCode')?.value;
    this.getschemeinterestratebyid();
  }
  //copy from Existing scheme
  public  CopyFromExisting() {
    this.copyvalid=true
    this.schemeinterestRatebyid = [];
    this.selectedInterestRateCode =
    this.InterestViewForm.get('ExistingInterestRateCodeCopy')?.value;
   if(this.selectedInterestRateCode)
    this.getschemeinterestratebyid();
  }

  //InterestCodeDdupChecking
  public InterestCodeDdupCheck()
  {
   const TxtInterestRateCode = this.InterestViewForm.get('TxtInterestRateCode')?.value;
   if(this.InterestViewForm.get('TxtInterestRateCode')?.valid && TxtInterestRateCode.length>=3)
   {
    this.http.InterestCodeDdupCheck(TxtInterestRateCode).subscribe((res:any)=>{
    this.validinterestcode=res.result; 
    this.interestcodests= this.validinterestcode       
    })
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
    if (this.actRoute.snapshot.params['MastereditTran']) {
      this.tranId = this.actRoute.snapshot.params['MastereditTran'];
      this.viewSave=true;
      this.getTransactionData(this.tranId, branchId);
    } else if (this.actRoute.snapshot.params['MasterviewTran']) {
      this.tranId = this.actRoute.snapshot.params['MasterviewTran'];
       this.getTransactionData(this.tranId, branchId);
      this.viewOnly = true;
  }else if(!this.hideButtonOverride){
    this.viewOnly = this.actRoute.snapshot.params['overRideViewTran'] ? true : false;
    this.schemeinterestRatebyid  =  this.commonServices.override.schemeInterestDefinition
    this.AddInterestCode=true
     this.InterestViewFormCheckbox.get('chkNewInterestCode')?.setValue(true);
     this.InterestViewForm.get('TxtInterestRateCode')?.setValue(this.schemeinterestRatebyid[0].interestCode);
     this.InterestViewForm.get('EffetivefromDate')?.setValue(this.schemeinterestRatebyid[0].fromDate);
     this.AddInterestCode=true
  //  this.getTransactionData(this.tranId, branchId);
}
}  
  public getTransactionData(tranNumber: number, branchId: any) {
    this.envFn
      .getCommonTransactionData(tranNumber, branchId)
      .then((res: any) => {
        this.schemeinterestRatebyid = JSON.parse(res[0].updatedData).interestDefDetails;
        if(this.schemeinterestRatebyid[0]?.Mode=='AddInterestCode')
        {
          this.AddInterestCode=true
           this.InterestViewFormCheckbox.get('chkNewInterestCode')?.setValue(true);
           this.InterestViewForm.get('TxtInterestRateCode')?.setValue(this.schemeinterestRatebyid[0].interestCode);
           this.InterestViewForm.get('EffetivefromDate')?.setValue(this.schemeinterestRatebyid[0].fromDate);

        }
       else  if(this.schemeinterestRatebyid[0].Mode=='NewEffectiveDate')
       {
          this.EditInterestCode=true
          this.NewEffectiveDate=true
          this.InterestViewFormCheckbox.get('chkEditInterestCode')?.setValue(true);
          this.InterestViewFormCheckbox.get('chkNewEffective')?.setValue(true);
          this.InterestViewForm.get('ExistingInterestRateCode')?.setValue(this.schemeinterestRatebyid[0].interestDefId);
          this.InterestViewForm.get('EffetivefromDate')?.setValue(this.schemeinterestRatebyid[0].fromDate);

       }
       else if (this.schemeinterestRatebyid[0].Mode=='OldEffectiveDate')
       {
         this.EditInterestCode=true
         this.OldEffectiveDate=true
          this.InterestViewFormCheckbox.get('chkEditInterestCode')?.setValue(true);
          this.InterestViewFormCheckbox.get('chkOldEffective')?.setValue(true);
          this.InterestViewForm.get('ExistingInterestRateCode')?.setValue(this.schemeinterestRatebyid[0].interestDefId);
          this.selectedInterestRateCode=this.schemeinterestRatebyid[0].interestDefId
          for (let obj of this.schemeinterestRatebyid) {
        const uniqueFromDates = new Set();
        this.schemeinterestRatebyid.forEach((obj: { fromDate: unknown; }) => uniqueFromDates.add(obj.fromDate));
        const uniqueFromDateArray = Array.from(uniqueFromDates);  
        this.fromdate=uniqueFromDateArray
        console.log(this.fromdate,'http://localhost:5000/review/Interest-view/viewTran/2608?uid=22&featureId=33&branchId=1');        
        this.InterestViewForm.get('DdnOldEffectiveDate')?.setValue(this.schemeinterestRatebyid[0].fromDate)
         }
        //  this.onOptionChange()

       }
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  // option Changes>>>>>>>>>>>>>>>>>>>>
  public chkNewInterestCode(event: any) {
    this.schemeinterestRatebyid=[]
    // this.viewSave=false; 
    this.InterestViewForm.reset()
    this.AddInterestCode = event.target.checked;
    if(event.target.checked==true)
    {
      this.InterestViewFormCheckbox.get('chkEditInterestCode')?.setValue(false);
      this.InterestViewFormCheckbox.get('chkNewEffective')?.setValue(false);
      this.InterestViewFormCheckbox.get('chkOldEffective')?.setValue(false);
      this.EditInterestCode=false
      this.OldEffectiveDate=false
      this.NewEffectiveDate=false
    }
  }

  public chkEditInterestCode(event: any) {
    this.schemeinterestRatebyid=[]
    // this.viewSave=false;
    this.InterestViewForm.reset()
    this.EditInterestCode = event.target.checked;
    if(event.target.checked==true)
    {
      this.InterestViewFormCheckbox.get('chkNewInterestCode')?.setValue(false);
      this.AddInterestCode=false
      this.OldEffectiveDate=false
      this.NewEffectiveDate=false
    }
    else
    {
      this.InterestViewFormCheckbox.get('chkNewEffective')?.setValue(false);
      this.NewEffectiveDate=false
      this.InterestViewFormCheckbox.get('chkOldEffective')?.setValue(false);
      this.OldEffectiveDate=false
    }
  }

  public chkOldEffective(event:any)
  {
    this.InterestViewFormCheckbox.get('ExistingInterestRateCode')?.setValue(null);
    this.schemeinterestRatebyid=[]
    // this.viewSave=false;
    this.InterestViewForm.reset()
    this.OldEffectiveDate=event.target.checked;
    if(event.target.checked==true)
    {
      this.InterestViewFormCheckbox.get('chkNewEffective')?.setValue(false);
      this.NewEffectiveDate=false
      this.AddInterestCode=false
    }
  }
  public chkNewEffective(event:any)
  {
    this.schemeinterestRatebyid=[]
    // this.viewSave=false;
    this.InterestViewForm.reset()
    this.NewEffectiveDate=event.target.checked;
    if(event.target.checked==true)
    {
      this.InterestViewFormCheckbox.get('chkOldEffective')?.setValue(false);
      this.OldEffectiveDate=false
      this.AddInterestCode=false
    }
  }
  public onChangeEffectivefromdate(event:any)
  {
    this.schemeinterestRatebyid=[]
    this.viewSave=false;
    const desiredFromDate = event.target.value;
    if(desiredFromDate)
    this.schemeinterestRatebyid = this.foroldeffectiveschemeinterestRatebyid.filter((obj: { fromDate: any; }) => obj.fromDate === desiredFromDate);    
  }
  //get Interest Rate Code data for listing>>>>>>>>>>>>>>>>>>
  private getschemeinterestratebyid() {
    this.http
      .schemeinterestratebyid(this.selectedInterestRateCode)
      .subscribe((res: any) => {
        this.foroldeffectiveschemeinterestRatebyid = res.result;
        if(this.AddInterestCode)
        {
        this.schemeinterestRatebyid = res.result;
        const maxFromDate = new Date(Math.max(...this.schemeinterestRatebyid.map((obj: { fromDate: string | number | Date; }) => new Date(obj.fromDate))));
        const objectsWithMaxFromDate = this.schemeinterestRatebyid.filter((obj: { fromDate: string | number | Date; }) => new Date(obj.fromDate).getTime() === maxFromDate.getTime()); // Output
        // Output
        this.schemeinterestRatebyid=objectsWithMaxFromDate
       }
       else if(this.OldEffectiveDate)
       {
        const uniqueFromDates = new Set<string>();
        for (let obj of this.foroldeffectiveschemeinterestRatebyid) {
     
          if (obj.fromDate) {
            const isValidDate = this.envFn.isValidDateFormat(obj.fromDate);
            if(!isValidDate)
            {
            const date = new Date(obj.fromDate);
            obj.fromDate = this.datePipe.transform(date, 'dd-MM-yyyy');
            uniqueFromDates.add(obj.fromDate);
            this.fromdate = Array.from(uniqueFromDates);
          }           
        else{
          this.fromdate =[this.foroldeffectiveschemeinterestRatebyid.fromDate];
        } 
      }
    }
       }
      
       else if(this.NewEffectiveDate)
       {
        this.schemeinterestRatebyid = res.result;
       }
       else{
        console.log(this.foroldeffectiveschemeinterestRatebyid,'foroldeffectiveschemeinterestRatebyid');
     
        const uniqueFromDates = new Set<string>();
        for (let obj of this.foroldeffectiveschemeinterestRatebyid) {
          if (obj.fromDate) {
            const isValidDate = this.envFn.isValidDateFormat(obj.fromDate);
            if(!isValidDate)
            {
            const date = new Date(obj.fromDate);
            obj.fromDate = this.datePipe.transform(date, 'dd-MM-yyyy');
            uniqueFromDates.add(obj.fromDate);
            this.fromdate = Array.from(uniqueFromDates);
          }           
        else{
          this.fromdate =[this.foroldeffectiveschemeinterestRatebyid.fromDate];
        } 
      }
    }
   }

      });  
  }
  //open modal >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public openLgModal() {
    this.submitted=true;
    if(this.AddInterestCode)
    {
      this.InterestViewForm.get('ExistingInterestRateCodeCopy')?.clearValidators()
      this.InterestViewForm.get('ExistingInterestRateCodeCopy')?.updateValueAndValidity();
      this.InterestViewForm.get('ExistingInterestRateCode')?.clearValidators()
      this.InterestViewForm.get('ExistingInterestRateCode')?.updateValueAndValidity();
      this.InterestViewForm.get('DdnOldEffectiveDate')?.clearValidators()
      this.InterestViewForm.get('DdnOldEffectiveDate')?.updateValueAndValidity();
    }
    else if(this.NewEffectiveDate)
    {
      this.InterestViewForm.get('ExistingInterestRateCodeCopy')?.clearValidators()
      this.InterestViewForm.get('ExistingInterestRateCodeCopy')?.updateValueAndValidity();
      this.InterestViewForm.get('TxtInterestRateCode')?.clearValidators()
      this.InterestViewForm.get('TxtInterestRateCode')?.updateValueAndValidity();
      this.InterestViewForm.get('DdnOldEffectiveDate')?.clearValidators()
      this.InterestViewForm.get('DdnOldEffectiveDate')?.updateValueAndValidity();
    }
    else if(this.OldEffectiveDate)
    {
  this.InterestViewForm.get('ExistingInterestRateCodeCopy')?.clearValidators()
  this.InterestViewForm.get('ExistingInterestRateCodeCopy')?.updateValueAndValidity();
  this.InterestViewForm.get('TxtInterestRateCode')?.clearValidators()
  this.InterestViewForm.get('TxtInterestRateCode')?.updateValueAndValidity();
  this.InterestViewForm.get('EffetivefromDate')?.clearValidators()
  this.InterestViewForm.get('EffetivefromDate')?.updateValueAndValidity();
    }
    if(this.InterestViewForm.valid)
    {
    const dialogConfig: MatDialogConfig<any> = {
      panelClass: 'custom',
      disableClose: true,
      data: {
        isEditMode: true,
        schemeinterestRatebyid: this.schemeinterestRatebyid,
        index:-1
      },
    };
    const dialogRef = this.dialog.open(
      InterestDefinitionComponent,
      dialogConfig
    );
    dialogRef.componentInstance.getSchemeInterestDefinition.subscribe(
      (getSchemeInterestDefinition: any) => {
        if(getSchemeInterestDefinition)
        {
          this.schemeinterestRatebyid = getSchemeInterestDefinition;
          this.viewSave=true;
        }
        dialogRef.close();
      }
    );
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
}

  //openmodal for row edit

  openLgModalEdit(index:any)
  {
    this.submitted=true;
    if(this.AddInterestCode)
    {
      this.InterestViewForm.get('ExistingInterestRateCodeCopy')?.clearValidators()
      this.InterestViewForm.get('ExistingInterestRateCodeCopy')?.updateValueAndValidity();
      this.InterestViewForm.get('ExistingInterestRateCode')?.clearValidators()
      this.InterestViewForm.get('ExistingInterestRateCode')?.updateValueAndValidity();
      this.InterestViewForm.get('DdnOldEffectiveDate')?.clearValidators()
      this.InterestViewForm.get('DdnOldEffectiveDate')?.updateValueAndValidity();
    }
    else if(this.NewEffectiveDate)
    {
      this.InterestViewForm.get('TxtInterestRateCode')?.clearValidators()
      this.InterestViewForm.get('TxtInterestRateCode')?.updateValueAndValidity();
      this.InterestViewForm.get('DdnOldEffectiveDate')?.clearValidators()
      this.InterestViewForm.get('DdnOldEffectiveDate')?.updateValueAndValidity();
    }
    else if(this.OldEffectiveDate)
    {
    this.InterestViewForm.get('TxtInterestRateCode')?.clearValidators()
    this.InterestViewForm.get('TxtInterestRateCode')?.updateValueAndValidity();
    this.InterestViewForm.get('EffetivefromDate')?.clearValidators()
    this.InterestViewForm.get('EffetivefromDate')?.updateValueAndValidity();
    }
    if(this.InterestViewForm.valid)
    {
    const dialogConfig: MatDialogConfig<any> = {
      panelClass: 'custom',
      disableClose: true,
      data: {
        isEditMode: true,
        schemeinterestRatebyid: this.schemeinterestRatebyid,
        index:index
      },
    };
    const dialogRef = this.dialog.open(
      InterestDefinitionComponent,
      dialogConfig
    );
    dialogRef.componentInstance.getSchemeInterestDefinition.subscribe(
      (getSchemeInterestDefinition: any) => {
        if(getSchemeInterestDefinition)
        {
          this.schemeinterestRatebyid = getSchemeInterestDefinition;
          this.viewSave=true;
        }
        dialogRef.close();
      }
    );
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
}
  getSchemeInterestDefinition(getSchemeInterestDefinition: any) {
    this.schemeinterestRatebyid = getSchemeInterestDefinition;
  }
   //delete values of corresponding row
   public Deletevalues(index: any) {
    Swal.fire({
      text: 'Are you sure you want to delete ?',
      icon: 'warning',
      cancelButtonText: 'Cancel',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.schemeinterestRatebyid.splice(index, 1);
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
  
  //Submit
  public Submit() {
    this.submitted=true;
    if(this.AddInterestCode)
    {
      this.InterestViewForm.get('ExistingInterestRateCodeCopy')?.clearValidators()
      this.InterestViewForm.get('ExistingInterestRateCodeCopy')?.updateValueAndValidity();
      this.InterestViewForm.get('ExistingInterestRateCode')?.clearValidators()
      this.InterestViewForm.get('ExistingInterestRateCode')?.updateValueAndValidity();
      this.InterestViewForm.get('DdnOldEffectiveDate')?.clearValidators()
      this.InterestViewForm.get('DdnOldEffectiveDate')?.updateValueAndValidity();
      if (
        Array.isArray(this.schemeinterestRatebyid) &&
        this.schemeinterestRatebyid.length >= 1
        ){
        for (let i = 0; i < this.schemeinterestRatebyid.length; i++) {``
          // Add or update the interestDefId property to the current object
          this.schemeinterestRatebyid[i].interestDefId =0
          this.schemeinterestRatebyid[i].interestCode =
            this.InterestViewForm.controls['TxtInterestRateCode'].value;
      
          //Add or update EffetivefromDate
          this.schemeinterestRatebyid[i].fromDate =
          this.envFn.formattedDate(this.InterestViewForm.controls['EffetivefromDate'].value)
          // mOde
          this.schemeinterestRatebyid[i].Mode = 'AddInterestCode';

        }
      } 
    }
    else if(this.NewEffectiveDate)
    {
        this.InterestViewForm.get('ExistingInterestRateCodeCopy')?.clearValidators()
      this.InterestViewForm.get('ExistingInterestRateCodeCopy')?.updateValueAndValidity();
      this.InterestViewForm.get('TxtInterestRateCode')?.clearValidators()
      this.InterestViewForm.get('TxtInterestRateCode')?.updateValueAndValidity();
      this.InterestViewForm.get('DdnOldEffectiveDate')?.clearValidators()
      this.InterestViewForm.get('DdnOldEffectiveDate')?.updateValueAndValidity();
      if (
        Array.isArray(this.schemeinterestRatebyid) &&
        this.schemeinterestRatebyid.length >= 1
         ){
        for (let i = 0; i < this.schemeinterestRatebyid.length; i++) {
          // Add or update the interestDefId property to the current object
          this.schemeinterestRatebyid[i].interestCode =
            this.envFn.getDescriptionById(this.InterestRateCode,'interestDefId',this.InterestViewForm.controls['ExistingInterestRateCode'].value,'interestCode')

          //Add or update EffetivefromDate
          this.schemeinterestRatebyid[i].fromDate =
          this.envFn.formattedDate(this.InterestViewForm.controls['EffetivefromDate'].value)

          //Mode
          this.schemeinterestRatebyid[i].Mode = 'NewEffectiveDate';

        }
        }
    }
    else if(this.OldEffectiveDate)
    {
  this.InterestViewForm.get('ExistingInterestRateCodeCopy')?.clearValidators()
  this.InterestViewForm.get('ExistingInterestRateCodeCopy')?.updateValueAndValidity();
  this.InterestViewForm.get('TxtInterestRateCode')?.clearValidators()
  this.InterestViewForm.get('TxtInterestRateCode')?.updateValueAndValidity();
  this.InterestViewForm.get('EffetivefromDate')?.clearValidators()
  this.InterestViewForm.get('EffetivefromDate')?.updateValueAndValidity();
      if (
        Array.isArray(this.schemeinterestRatebyid) &&
        this.schemeinterestRatebyid.length >= 1
         ){
        for (let i = 0; i < this.schemeinterestRatebyid.length; i++) {
          // Add or update the interestDefId property to the current object
          this.schemeinterestRatebyid[i].interestCode =
          this.envFn.getDescriptionById(this.InterestRateCode,'interestDefId',this.InterestViewForm.controls['ExistingInterestRateCode'].value,'interestCode')

          //Add or update EffetivefromDate
          
        this.schemeinterestRatebyid[i].fromDate =         
        this.envFn.convertDateFormat(this.InterestViewForm.controls['DdnOldEffectiveDate'].value);

          //mode
          this.schemeinterestRatebyid[i].Mode = 'OldEffectiveDate';

        }
        }
    }
    if(this.InterestViewForm.valid &&  
      Array.isArray(this.schemeinterestRatebyid) &&
      this.schemeinterestRatebyid.length >= 1 && !this.viewSaveScheme && !this.hideButton && this.interestcodests=="false"
      )
    { 
    this.isConfirm=true    
    const interestDefDetails={
      interestDefDetails:this.schemeinterestRatebyid
       }
       if (this.actRoute.snapshot.params['MastereditTran']) {
       let   params = new HttpParams()
        params = params.set(
            'updatedData',
            JSON.stringify(interestDefDetails)
          );
            this.envFn.sendBackReview(this.tranId, 22, 1, 28, 'UPDATE', 0, 0, 0, params).subscribe((data: any) => {
            if (data.statusCode == 200) {
              this.isConfirm=true
              this.router.navigate(['/'], { relativeTo: this.actRoute });     
              this.envFn.showSwalAlert('','Interest Rate Code request ' +data.result +' sent for verification successfully !!','success');
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

       let   params = new HttpParams()
         params = params.set(
      'editedData',
      JSON.stringify(interestDefDetails)
    );
    params = params.set(
      'updatedData',
      JSON.stringify(interestDefDetails)
    );
    const userId=22
    const branchId=1
    const FeatureId=32
    const Amount=0
    const Method='CREATE'
    const incAuthcount=0
    const loanCount=0
    this.envFn
              .generateTran(userId,branchId,FeatureId,Amount,Method,incAuthcount,loanCount,params)
              .subscribe(
                (data: any) => {
                  if (data.statusCode == 200) {
                    this.isConfirm=true
                    this.router.navigate(['/'], { relativeTo: this.actRoute });
                    this.envFn.showSwalAlert(
                      '',
                      'Interest Rate Code request ' +
                      data.result +
                      ' sent for verification successfully !!',
                      'success'
                    );
                  } else {
                    // Failure
                    this.isConfirm=false
                    this.envFn.showResponseErrorMessage('Something went wrong');
                  }
                },
                (error: any) => {
                  // Error
                  this.isConfirm=false
                  this.envFn.showResponseErrorMessage('Something went wrong');
                }
              );
  }
}
else if (
  Array.isArray(this.schemeinterestRatebyid) &&
  this.schemeinterestRatebyid.length >= 1 &&  this.hideButton && this.interestcodests =="false"
  )
{ 
  this.InterestViewForm.get('TxtInterestRateCode')?.clearValidators()
  this.InterestViewForm.get('TxtInterestRateCode')?.updateValueAndValidity();
  this.InterestViewForm.get('EffetivefromDate')?.clearValidators()
  this.InterestViewForm.get('EffetivefromDate')?.updateValueAndValidity();
  if(this.InterestViewForm.valid)
  {
    // this.isConfirm=true
        for (let i = 0; i < this.schemeinterestRatebyid.length; i++) {
          // Add or update the interestDefId property to the current object
          this.schemeinterestRatebyid[i].interestCode =
          this.envFn.getDescriptionById(this.InterestRateCode,'interestDefId',this.InterestViewForm.controls['ExistingInterestRateCode'].value,'interestCode')

          //Add or update EffetivefromDate               
          this.schemeinterestRatebyid[i].fromDate =         
          this.envFn.convertDateFormat(this.InterestViewForm.controls['DdnOldEffectiveDate'].value);
          console.log(this.schemeinterestRatebyid[i].fromDate,'this.schemeinterestRatebyid[i].fromDateconver');
          
              if (
                Array.isArray(this.schemeinterestRatebyid) &&
                this.schemeinterestRatebyid.length >= 1
                 ){
                for (let i = 0; i < this.schemeinterestRatebyid.length; i++) {
                  // Add or update the interestDefId property to the current object
                  this.schemeinterestRatebyid[i].interestCode =
                  this.envFn.getDescriptionById(this.InterestRateCode,'interestDefId',this.InterestViewForm.controls['ExistingInterestRateCode'].value,'interestCode')
        
                  //Add or update EffetivefromDate
                  this.schemeinterestRatebyid[i].fromDate =
                  this.envFn.convertDateFormat(this.InterestViewForm.controls['DdnOldEffectiveDate'].value);
                  console.log(this.schemeinterestRatebyid[i].fromDate,'this.schemeinterestRatebyid[i].fromDateconver');
                  //mode
                  this.schemeinterestRatebyid[i].Mode = 'OldEffectiveDate';
                }
              }
        }

        if (this.isTran)
        this.envFn.saveSchemeFormLiveData(5,this.schemeinterestRatebyid);
      else this.envFn.saveSchemeFormTempdata(5,this.schemeinterestRatebyid);
    }
    }
   }


  public saveInteresetOverride() {
    if(this.AddInterestCode)
    {
      this.InterestViewForm.get('ExistingInterestRateCodeCopy')?.clearValidators()
      this.InterestViewForm.get('ExistingInterestRateCodeCopy')?.updateValueAndValidity();
      this.InterestViewForm.get('ExistingInterestRateCode')?.clearValidators()
      this.InterestViewForm.get('ExistingInterestRateCode')?.updateValueAndValidity();
      this.InterestViewForm.get('DdnOldEffectiveDate')?.clearValidators()
      this.InterestViewForm.get('DdnOldEffectiveDate')?.updateValueAndValidity();
      if (
        Array.isArray(this.schemeinterestRatebyid) &&
        this.schemeinterestRatebyid.length >= 1
        ){
        for (let i = 0; i < this.schemeinterestRatebyid.length; i++) {``
          // Add or update the interestDefId property to the current object
          this.schemeinterestRatebyid[i].interestDefId =0
          this.schemeinterestRatebyid[i].interestCode =
            this.InterestViewForm.controls['TxtInterestRateCode'].value;
      
          //Add or update EffetivefromDate
          this.schemeinterestRatebyid[i].fromDate =
          this.InterestViewForm.controls['EffetivefromDate'].value;
          // mOde
          this.schemeinterestRatebyid[i].Mode = 'AddInterestCode';

        }
        this.commonServices.override.schemeInterestDefinition=this.schemeinterestRatebyid
      } 
      
     
    }  
  }
  //Clear
  public ClearDetails() {
    this.schemeinterestRatebyid = [];
    this.InterestViewForm.reset();
    this.copyvalid=false
    this.submitted=false
  }
  public goToNextForm() {
    this.envFn.goToNextSchemeForm(5);
  }
    //validation>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    public getErrorMessage(controlName: string): string {
      return this.envFn.getFormError(this.InterestViewForm, controlName);
    }
}
