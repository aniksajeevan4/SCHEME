import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EnvFunction } from 'src/app/core/env/function/env-function';

@Component({
  selector: 'app-ornaments-master',
  templateUrl: './ornaments-master.component.html',
  styleUrls: ['./ornaments-master.component.scss']
})
export class OrnamentsMasterComponent implements OnInit {
  //form Variables>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  oranamentMaster: FormGroup;

  // additional variables>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  instructionContainerVisible: boolean = false;
  maxFromDate: string;
  submitted = false
  constructor(
    private fb: FormBuilder,
    private envFn: EnvFunction,

  ) {
     this.maxFromDate = new Date().toISOString().split("T")[0];
   }

  ngOnInit(): void {
    this.CreateOrnamentForm()
  }
   //form declaration>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  private CreateOrnamentForm(): void {
    this.oranamentMaster=this.fb.group({
      name: new FormControl('', [Validators.required,Validators.pattern(/^(?!\s+$)[a-zA-Z\s]+$/)]),
      ltv: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
    })

  }
    //validation>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    public getErrorMessage(controlName: string): string {
      return this.envFn.getFormError(this.oranamentMaster, controlName);
    }

  toggleInstructionContainer(event: any) {
    const target = event.target as HTMLInputElement;
    this.instructionContainerVisible = target.checked;
  }
    // form submission>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    public submitForm() {
      this.submitted = true
      if (this.oranamentMaster.valid) {
        const formData = {
          name: this.oranamentMaster.get('name')?.value,
          ltv: this.oranamentMaster.get('ltv')?.value,
          date: this.oranamentMaster.get('date')?.value,
        }
        // this.envFn.saveSchemeFormTempdata(1, formData);
      }
    }

}
