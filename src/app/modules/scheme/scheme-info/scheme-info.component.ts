import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { EnvFunction } from 'src/app/core/env/function/env-function';
import { SchemeFormService } from '../../scheme-forms/services/scheme-form.service';

@Component({
  selector: 'app-scheme-info',
  templateUrl: './scheme-info.component.html',
  styleUrls: ['./scheme-info.component.scss']
})
export class SchemeInfoComponent implements OnInit {
  //objects----------------
  private unsubscribe$: Subject<void> = new Subject<void>();

  //other variables----------------------------------------------------------------
  public schemeId: number = -1;
  public scheme: any = null;

  //lifecycle functions----------------------------------------------------------------------------
  constructor(
    private envFn: EnvFunction,
    private matDialogRef: MatDialogRef<SchemeInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private schemeFormService: SchemeFormService
  ) { }

  ngOnInit(): void {
    this.schemeId = this.data.schemeId;
    this.getSchemeDetails();
  }

private getSchemeDetails(){
  this.schemeId
  this.schemeFormService.getSchemeDetailsById(this.schemeId).pipe().subscribe((data: any) => {
    console.log('schceme', data.result.schemeLimitDefDetails.maxTerm)
    if(data.statusCode==200){
      this.scheme = data.result;

      
    }
    else {
      this.envFn.showResponseErrorMessage('something went wrong while fetching product list')
    }
  },
  (err) => {
    this.envFn.showResponseErrorMessage('something went wrong while fetching product list')
  });
}

  //close Modal---------------------------------------------
  public closeDialog() {
    this.matDialogRef.close(null)
  }

}
