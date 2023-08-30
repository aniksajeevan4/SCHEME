import { CommonService } from 'src/app/core/env/common-services/common.service';
import { Component, OnInit } from '@angular/core';
import { SchemeFormService } from '../services/scheme-form.service';
import { EnvFunction } from 'src/app/core/env/function/env-function';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.state';
import { saveSchemeFormData, updateFetchedSchemeId, updateSchemeFormSchemeName, updateSchemeFormsEditMode, updateSchemeId } from 'src/app/core/store/schemeFormStore/schemeform.action';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pending-scheme-details',
  templateUrl: './pending-scheme-details.component.html',
  styleUrls: ['./pending-scheme-details.component.scss']
})
export class PendingSchemeDetailsComponent implements OnInit {

  //objects-----------------------------------------------------------------------------------
  private unsubscribe$: Subject<void> = new Subject<void>();
  //variables---------------------------------------------------------------------------------
  public pendingSchemeDetails: any[] = [];
  public pageNo: number = 1;
  public pageSize: number = 5;
  public pageCount: number = 0;
  public tableSizes: number[] = [5, 10, 25, 50, 100];

  constructor(
    private envFn: EnvFunction,
    private schemeFormService: SchemeFormService,
    private CommonService: CommonService,
    private matDialogRef: MatDialogRef<PendingSchemeDetailsComponent>,
    private appStore: Store<AppState>
    ) { }

  ngOnInit(): void {
    this.getPendingSchemeDetails()
  }

  private getPendingSchemeDetails() {
    this.schemeFormService.getPendingSchemeDetails(this.pageNo, this.pageSize).subscribe(

      (data: any) => {
        this.pendingSchemeDetails=[];
        if (data.statusCode == 200) {
          this.pendingSchemeDetails = data.result;
          this.pageCount= this.pendingSchemeDetails[0].totalCount;
          if(this.pendingSchemeDetails.length==0) this.closeDialog();
        }
        else this.envFn.showResponseErrorMessage('something went wrong while fetching schemes')
      },
      (err) => {
        this.envFn.showResponseErrorMessage('something went wrong while fetching schemes')
      });
  }

  editSelectedPendingScheme(scheme:any=null){
    if(scheme){
      try{
      let schemeDtls = JSON.parse(scheme.schemeDetails);
      schemeDtls.schemeId = scheme.schemeTempId;
      console.log(schemeDtls,'JSON file scheme details')
      console.log(schemeDtls,'JSON file scheme details')
      this.appStore.dispatch(saveSchemeFormData({schemejson:JSON.stringify(schemeDtls)}));
      this.appStore.dispatch(updateSchemeFormsEditMode({status:true}))
      this.appStore.dispatch(updateSchemeId({schemeId:scheme.schemeTempId}));
      this.appStore.dispatch(updateSchemeFormSchemeName({schemeCode:scheme.schemeCode}));
      this.appStore.dispatch(updateFetchedSchemeId({schemeId:schemeDtls.fetchedSchemeId}))
      this.closeDialog()
      }
      catch(error){
        alert('not a valid json')
      }
    }
  }
  DeleteSelectedPendingScheme(schemeTempId:any)
  {
    if(schemeTempId){
      Swal.fire({
        text: 'Are you sure you want to delete ?',
        icon: 'warning',
        cancelButtonText: 'Cancel',
        showCancelButton: true,
        confirmButtonText: 'Delete',
      }).then((result) => {
        if (result.isConfirmed) {
          try{
            this.CommonService.DeletePendingEntries(schemeTempId).subscribe(
              (data: any) => {
                if (data.statusCode == 200) {
                  Swal.fire({
                    title: 'Deleted successfully',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    icon: 'success',
                  });
                  this.getPendingSchemeDetails()
                }
                else this.envFn.showResponseErrorMessage('something went wrong while Deleting schemes')
              },
              (err) => {
                this.envFn.showResponseErrorMessage('something went wrong while Deleting schemes')
              });
          }
          catch(error){
            this.envFn.showResponseErrorMessage('something went wrong while Deleting schemes')
         }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    }
  }

  //when pagination of the table change
  onTableDataChange(event: any) {
    this.pageNo = event;
    this.getPendingSchemeDetails();
  }

  public closeDialog() {
    this.matDialogRef.close(null)
  }

}
