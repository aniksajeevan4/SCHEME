import {
  Component,
  OnInit,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
  TemplateRef,
  ComponentRef,
  ElementRef,
  Input,
} from '@angular/core';

import {
  MovingDirection,
  WizardCompletionStep,
  WizardComponent as BaseWizardComponent,
} from 'angular-archwizard';

import { OverrideDefinitionComponent } from '../override-definition/override-definition.component';
import Swal from 'sweetalert2';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { EnvFunction } from 'src/app/core/env/function/env-function';
import { ChargeMasterComponent } from '../../master/charge-definition/charge-master/charge-master.component';
import { InterestDefinitionService } from '../../master/service/interest-definition.service';
import { InterestViewComponent } from '../../master/interest-view/interest-view.component';
import { SchemeLimitComponent } from '../../scheme-forms/scheme-limit/scheme-limit.component';
import { CommonService } from 'src/app/core/env/common-services/common.service';
import { LimitViewComponent } from '../../master/limit-definition/limit-view/limit-view.component';


@Component({
  selector: 'app-scheme-override',
  templateUrl: './scheme-override.component.html',
  styleUrls: ['./scheme-override.component.scss']
})
export class SchemeOverrideComponent implements OnInit {
  @ViewChild(OverrideDefinitionComponent) childGeneral: OverrideDefinitionComponent;
  @ViewChild(ChargeMasterComponent) chargeMaster: ChargeMasterComponent;
  @ViewChild(InterestViewComponent) interestView: InterestViewComponent;
  @ViewChild(LimitViewComponent) schemeLimit: LimitViewComponent;




  @ViewChild('wizardForm') wizardForm: BaseWizardComponent;
  @ViewChild(BaseWizardComponent)
  public wizard: BaseWizardComponent;

  enableInterest:any=0;
  enableCharge:any=0;
  enableLimit:any=0;
  public isDisable: boolean = true;
  public tranId: number = 0;
  parentSatus: number=0


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private envFn: EnvFunction,
    private commonServices:CommonService
    ) { }

  ngOnInit(): void {
   this.urlChecking()
  }

  urlChecking(){
   
    let uid;
    let featureId;
    let branchId;
    this.route.queryParams.subscribe((params) => {
      uid = params['uid'];
      featureId = params['featureId'];
      branchId = params['branchId'];
    });
    if (this.route.snapshot.params['editTran']) {
      this.tranId = this.route.snapshot.params['editTran'];
      this.getTransactionData(this.tranId,1)
      // this.parentSatus=0
    } else if (this.route.snapshot.params['overRideViewTran']) {
      this.tranId = this.route.snapshot.params['overRideViewTran'];
      this.getTransactionData(this.tranId,branchId)
    }else{
      this.commonServices.override.schemeId =0
      this.commonServices.override.customerId = 0
      this.commonServices.override.groupTypeId =0
      this.commonServices.override.branchDetails = []
      this.commonServices.override.schemeInterestDefinition = ''
      this.commonServices.override.schemeCharges = ''
      this.commonServices.override.schemeLimitDefDetails = ''
      this.parentSatus=1
    }

  }

  public getTransactionData(tranNumber: number, branchId: any) {
    this.envFn.getCommonTransactionData(tranNumber, branchId)
      .then((res: any) => {
        const schemeOverDetails = JSON.parse(res[0].updatedData).schemeOverrideDetails;
  
        this.commonServices.override = {
          schemeId: schemeOverDetails.schemeId,
          customerId: schemeOverDetails.customerId,
          groupTypeId: schemeOverDetails.groupTypeId,
          branchDetails: schemeOverDetails.branchDetails,
          schemeInterestDefinition: schemeOverDetails.schemeInterestDefinition,
          schemeCharges: schemeOverDetails.schemeCharges,
          schemeLimitDefDetails: schemeOverDetails.schemeLimitDefDetails,
        };
        this.enableInterest = this.commonServices.override.schemeInterestDefinition?.length > 0 ? 1 : 0;
        this.enableCharge = this.commonServices.override.schemeCharges?.length > 0 ? 1 : 0;
        this.enableLimit = this.commonServices.override.schemeLimitDefDetails ? 1 : 0;
        console.log(this.commonServices.override, "``````````````````````````````````````````````");
      })
      .catch((error: any) => {
        console.error(error);
      })
      .finally(() => {
        this.parentSatus = 1;
      });
  }
  
  
  finishFunction(){
      let userId=22
      let branchId=1
      let featureId=31
      this.send(userId,branchId,featureId)
  }

  send(userId:number,brnchId:number,featureId:number) {
    let method="create"
    let edit: any = { schemeOverrideDetails: this.commonServices.override};
    let update: any = { schemeOverrideDetails: this.commonServices.override };
    let params = new HttpParams();
    params = params.set('updatedData', JSON.stringify(update));

    if (this.route.snapshot.params['editTran']) {
       method="UPDATE"
      this.isDisable = false;
      this.envFn.sendBackReview(this.tranId, userId, brnchId, featureId, method, 0, 0, 0, params).subscribe(
        (data: any) => {
          this.handleSendResponse(data, 'sent for verification');
        },
        (error: any) => {
          this.handleSendError();
        }
      );
    } else {
      this.isDisable = false;
      params = params.set('editedData', JSON.stringify(edit));
      this.envFn.generateTran(userId, brnchId, featureId, 0, method, 0, 0, params).subscribe(
        (data: any) => {
          this.handleSendResponse(data, 'sent for verification');
        },
        (error: any) => {
          this.handleSendError();
        }
      );
    }
  }
  
  private handleSendResponse(data: any, message: string) {
    this.isDisable = false;
    if (data.statusCode == 200) {
      this.isDisable = true;
      this.router.navigate(['/'], { relativeTo: this.route });
      this.envFn.showSwalAlert('', 'Scheme OverRide request ' + data.result + ' ' + message + ' successfully !!', 'success');
    } else {
      this.handleSendError();
    }
  }
  
  private handleSendError() {
    this.isDisable = true;
    this.envFn.showSwalAlert('', 'Something went wrong !!', 'error');
  }
  

  canExitStep1: (MovingDirection:any) => boolean = (direction): any => {
    switch (direction) {
      case MovingDirection.Forwards:{
        if (this.route.snapshot.params['overRideViewTran']) {
          return true
        }else {
          this.childGeneral.submitted=true
          console.log(this.childGeneral.formOverrideDetails.value);
          
         if(this.childGeneral.formOverrideDetails.valid && this.childGeneral.valueList.length>0){
          this.childGeneral.saveValue()
          return true;
         }
        else {
          if(this.childGeneral.valueList.length==0)
          this.swal('Data should be added to the table')
           return false
        }
        }
       
     
      break;
      }
        
      case MovingDirection.Backwards:
        return true;
      break;
    }
  };

  canExitStep2: (MovingDirection:any) => boolean = (direction): any => {
    switch (direction) {
      case MovingDirection.Forwards:{
        if (this.route.snapshot.params['overRideViewTran']) {
          return true
        }else {
        this.interestView.submitted=true
        this.interestView.saveInteresetOverride()
       if(this.interestView.InterestViewForm.valid && Array.isArray(this.interestView.schemeinterestRatebyid) && this.interestView.schemeinterestRatebyid.length >= 1 
            && this.interestView.interestcodests=="false"){
        return true;
       }
      else {
        if(this.interestView.schemeinterestRatebyid.length<1){
          this.swal('Data should be added to the table')
        }else if(this.interestView.InterestViewForm.invalid){
          this.swal('Please provide a InterestCode')
        }
        return false
      }
    }
     
      break;
      }
        
      case MovingDirection.Backwards:
        return true;
      break;
    }
  };

  canExitStep3: (MovingDirection:any) => boolean = (direction): any => {
    switch (direction) {
      case MovingDirection.Forwards:{
        if (this.route.snapshot.params['overRideViewTran']) {
          return true
        }else {
        this.chargeMaster.submitted=true
        // this.childGeneral.saveValue()
       if(this.chargeMaster.chargeCodeList.length>=1 &&  this.chargeMaster.formChargeMaster.get('chargeCode')?.valid && this.chargeMaster.formChargeMaster.get('effectiveDate')?.valid &&this.chargeMaster.chargeCodeSearch.result === 'false'){
        this.chargeMaster.saveChargeDefinitionOverRide()
        return true;
       }

      else {
        if(this.chargeMaster.chargeCodeList.length<1)
           this.swal('Data should be added to the table')
           if(this.chargeMaster.formChargeMaster.get('chargeCode')?.valid && this.chargeMaster.formChargeMaster.get('effectiveDate')?.valid)
           this.swal('Invalid charge code or effective Date')
           if(this.chargeMaster.chargeCodeSearch.result != 'false')
           this.swal('Same charge code cannot be created')

        return false
      }
    }
     
      break;
      }
        
      case MovingDirection.Backwards:
        return true;
      break;
    }
  };

  canExitStep4: (MovingDirection:any) => boolean = (direction): any => {
    switch (direction) {
      case MovingDirection.Forwards:{
        if (this.route.snapshot.params['overRideViewTran']) {
          return true
        }else {
        this.schemeLimit.submitted=true
        if(this.schemeLimit.LimitViewForm.get('EffetivefromDate')?.valid && this.schemeLimit.SchemeLimitDefDetails.length!==0 && !this.schemeLimit.viewSaveScheme && !this.schemeLimit.hideButton && this.schemeLimit.limitcodests=="false"){
          this.schemeLimit.saveLimitOverride()
          return true
        }
        else {
          if(this.schemeLimit.LimitViewForm.get('EffetivefromDate')?.invalid)
          this.swal('Invalid limit code or effective Date')
          if(this.schemeLimit.SchemeLimitDefDetails.length < 1)
          this.swal('Data should be added to the table')
          if(this.schemeLimit.limitcodests != 'false')
          this.swal('Same limit code cannot be created')
          return false
         }  
        
       }
      break;
      }
        
      case MovingDirection.Backwards:
        return true;
      break;
    }
  };

  parentFun(event:any){
   console.log(event,"klkl")
   const found= event.find((element:any)=> {
    return element.name === 'Interest';
  })
  const found1= event.find((element:any)=> {
    return element.name === 'Charge';
  })
  const found2= event.find((element:any)=> {
    return element.name === 'Limit';
  })
    if(found){
      this.enableInterest=1
    }else{
      this.enableInterest=0
    }
    if(found1){
      this.enableCharge=1

    }else{
      this.enableCharge=0
    } 
    if(found2){
      this.enableLimit=1
    }else{
      this.enableLimit=0
    }
    
 
   
  }

  public swal(message:string){
    Swal.fire( {  toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      title: message,
      icon: 'error',
      showCloseButton: true,
    });
  }


}
