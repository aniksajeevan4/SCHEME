import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EnvFunction } from 'src/app/core/env/function/env-function';
@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent implements OnInit {

  schemeEditForm: FormGroup
  subimitted = false


  @Output() chargeDefinitionSaved = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<EditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private envFn: EnvFunction,
  ) { }

  ngOnInit(): void {
    this.schemeLimit()
    console.log(this.data.schemeDetails, "hjjhbvbnjnb");

  }

  //form
  private schemeLimit() {
    this.schemeEditForm = this.formBuilder.group({
      branch: new FormControl(''),
      scheme: new FormControl(''),
      maximumAmount: new FormControl('', [Validators.pattern('^[1-9][0-9]*$')]),
      activeLoans: new FormControl('', [Validators.pattern('^[1-9][0-9]*$')]),
    })
  }

  //get data from table for editing
  public getChargeDefinition() {
    const scheme = this.data.row;
    const branch = this.data.branchDetails.branchName
    const schemes = this.data.schemeDetails.name



    this.schemeEditForm.patchValue({
      scheme: schemes,
      branch: branch,
      maximumAmount: scheme.MaxAmount,
      activeLoans: scheme.MaxNumberOfLoan
    })
    this.schemeEditForm.get('branch')?.disable()
    this.schemeEditForm.get('scheme')?.disable()

  }





  onSaveClick(): void {
    this.subimitted = true
    if (this.schemeEditForm.valid) {
      const chargeDefinition = {
        SchemeId: this.data.schemeDetails.schemeId,
        SchemeName: this.data.schemeDetails.name,
        BranchId: this.data.branchDetails.branchId,
        BranchName: this.data.branchDetails.branchName,
        MaxAmount: this.schemeEditForm.get("maximumAmount")?.value,
        MaxNumberOfLoan: this.schemeEditForm.get("activeLoans")?.value,
      }
      this.chargeDefinitionSaved.emit(chargeDefinition)

    }
  }


  // Component code
  onClearClick(): void {
    this.subimitted = true
    this.schemeEditForm.patchValue({
      maximumAmount: '',
      activeLoans: ''
    })
  }
  //validation>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public getErrorMessage(controlName: string): string {
    return this.envFn.getFormError(this.schemeEditForm, controlName);
  }

}
