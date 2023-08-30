import { Component, Input, OnInit } from '@angular/core';
import { EnvFunction } from 'src/app/core/env/function/env-function';
import { SchemeFormService } from '../services/scheme-form.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EnvVariable } from 'src/app/core/env/variables/env-variable';
import { MinMaxNumber } from 'src/app/core/validation/min-max-number.validator';
import { validationIsNumber } from 'src/app/core/validation/is-number.validator';
@Component({
  selector: 'app-branch-selection',
  templateUrl: './branch-selection.component.html',
  styleUrls: ['./branch-selection.component.scss']
})
export class BranchSelectionComponent implements OnInit {

  //view variables-----------------------------------------------------------------------------
  @Input() applicableType: number = -1;

  //objects-----------------------------------------------------------------------------------
  private unsubscribe$: Subject<void> = new Subject<void>();

  //froms variables-------------------------------------------------------------------------------------
  public formApplyToDetails: FormGroup;
  public DropDownDocumentList: any = [];
  constructor(
    private envFn: EnvFunction,
    private schemeFormService: SchemeFormService,
    private fb : FormBuilder,
    private matDialogRef: MatDialogRef<BranchSelectionComponent>
  ) { }

  ngOnInit(): void {
    this.createFormApplicableDetails();
  }

  private createFormApplicableDetails(): void {
    this.formApplyToDetails = this.fb.group({
      'docFromAmountControl': new FormControl('', [Validators.required, Validators.pattern(EnvVariable.patternOnlyNumbers), validationIsNumber(100000000, 1)]),
      'docToAmountControl': new FormControl('', [Validators.required, Validators.pattern(EnvVariable.patternOnlyNumbers), validationIsNumber(100000000, 1)]),
      'docType': new FormControl('', [Validators.required, Validators.pattern(EnvVariable.patternOnlyNumbers), validationIsNumber(100000000, 1)]),
      'docMandatory': new FormControl(false, [Validators.required]),
    }, {
      Validators: [
        MinMaxNumber('docFromAmountControl', 'docToAmountControl')
      ]
    })
  }

  //validation
  public getErrorMessage(controlName: string): string {
    return this.envFn.getFormError(this.formApplyToDetails, controlName);
  }

  //form submit
  onFormSubmit() {
    if (this.formApplyToDetails.valid) {
      const docDetails = {
        fromAmount: this.formApplyToDetails.get('docFromAmountControl')?.value,
        toAmount: this.formApplyToDetails.get('docToAmountControl')?.value,
        documentTypeId: this.formApplyToDetails.get('docType')?.value,
        mandatory: this.formApplyToDetails.get('docMandatory')?.value
      }
      this.matDialogRef.close(docDetails)
    }
  }

  //close dialog
  public closeDialog() {
    this.matDialogRef.close(null)
  }

}
