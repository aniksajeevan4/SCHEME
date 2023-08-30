import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SchemeFormService } from '../services/scheme-form.service';
import { Subject, takeUntil } from 'rxjs';
import { EnvFunction } from 'src/app/core/env/function/env-function';
import { MatDialogRef } from '@angular/material/dialog';
import { validationIsNumber } from 'src/app/core/validation/is-number.validator';
import { EnvVariable } from 'src/app/core/env/variables/env-variable';
import { MinMaxNumber } from 'src/app/core/validation/min-max-number.validator';

@Component({
  selector: 'app-scheme-form-doc-details',
  templateUrl: './scheme-form-doc-details.component.html',
  styleUrls: ['./scheme-form-doc-details.component.scss']
})
export class SchemeFormDocDetailsComponent implements OnInit {

  //objects-----------------------------------------------------------------------------------
  private unsubscribe$: Subject<void> = new Subject<void>();
  //froms variables-------------------------------------------------------------------------------------
  public formSchemeDocumentDetails: FormGroup;
  public DropDownDocumentList: any = [];
  public submitted:boolean=false

  constructor(
    private envFn: EnvFunction,
    private fb: FormBuilder,
    private matDialogRef : MatDialogRef<SchemeFormDocDetailsComponent>,
    private commonService: SchemeFormService,

  ) { }

  ngOnInit(): void {
    this.getDocList()
    this.createFormDocDetails();
    this.formSchemeDocumentDetails.valueChanges.subscribe(() => {
      this.isGreaterThanOtherValue();
    });
  }

  //froms functions-------------------------------------------------------------------------------------

  //get Document List
  private getDocList() {
    this.commonService.getDocumentTypeList().pipe(takeUntil(this.unsubscribe$)).subscribe(
      (data: any) => {
        if (data.statusCode == 200) {
          this.DropDownDocumentList = [];
          this.DropDownDocumentList = data.result
          console.log(this.DropDownDocumentList,'doc details');
        }
        else this.envFn.showResponseErrorMessage('something went wrong while fetching branches list');
      },
      (error) => { this.envFn.showResponseErrorMessage('something went wrong while fetching Branches list'); }
    );
  }


  //
  private createFormDocDetails() {
      this.formSchemeDocumentDetails = this.fb.group({
      'docFromAmountControl': new FormControl('', [Validators.required,Validators.pattern(EnvVariable.patternOnlyNumbers)]),
      'docToAmountControl': new FormControl('', [Validators.required,Validators.pattern(EnvVariable.patternOnlyNumbers)]),
      'docType': new FormControl('', [Validators.required,Validators.pattern(EnvVariable.patternOnlyNumbers),validationIsNumber(100000000,1)]),
      'docMandatory': new FormControl(false, [Validators.required]),
    },
    {
      Validator : [
        MinMaxNumber('docFromAmountControl','docToAmountControl')
      ],
    })
  }

  //validation
  public getErrorMessage(controlName: string): string {
    return this.envFn.getFormError(this.formSchemeDocumentDetails, controlName);
  }


  isGreaterThanOtherValue(): boolean {
    if(this.formSchemeDocumentDetails.get('docToAmountControl')?.value &&this.formSchemeDocumentDetails.get('docFromAmountControl')?.value){
    return this.formSchemeDocumentDetails.get('docToAmountControl')?.value<this.formSchemeDocumentDetails.get('docFromAmountControl')?.value;
  }return false
}

  //form submit
  onFormSubmit(){
    this.submitted=true
    this.isGreaterThanOtherValue()
    if(this.formSchemeDocumentDetails.valid && !this.isGreaterThanOtherValue()){
      const docDetails = {
        fromAmount :this.formSchemeDocumentDetails.get('docFromAmountControl')?.value,
        toAmount :this.formSchemeDocumentDetails.get('docToAmountControl')?.value,
        documentType :this.getDocumentTypeNameFromId(this.formSchemeDocumentDetails.get('docType')?.value),
        documentTypeId : this.formSchemeDocumentDetails.get('docType')?.value,
        mandatory :this.formSchemeDocumentDetails.get('docMandatory')?.value,
        status : 0
      }
      this.matDialogRef.close(docDetails)
    }else{

    }
  }

  //to close the dialog
  public closeDialog(){
    this.matDialogRef.close(null)
  }
  //get product name from id
  public getDocumentTypeNameFromId(docId:number=0){
    const docDetails = this.DropDownDocumentList.find((item: { idTypeId: number; documentType:string })=>(item.idTypeId == docId)?item:null)
    return docDetails?docDetails.documentType:'';
  }
}
