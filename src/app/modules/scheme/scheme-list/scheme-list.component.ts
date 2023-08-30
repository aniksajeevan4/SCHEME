import { fetchSchemeFormState_generalInfo } from './../../../core/store/schemeFormStore/schemeform.selectors';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { EnvFunction } from 'src/app/core/env/function/env-function';
import { AppState } from 'src/app/core/store/app.state';
import { showLoader } from 'src/app/core/store/sharedStore/shared.action';
import { SchemeService } from '../services/scheme.service';
import { SchemeDetails } from 'src/app/core/models/scheme.model';
import { EnvVariable } from 'src/app/core/env/variables/env-variable';
import { ActivatedRoute, Router } from '@angular/router';
import {
  updateFetchedProductId,
  updateFetchedProductType,
  updateSchemeFormPendingView,
  updateSchemeFormViewOnly,
  updateSchemeFormsEditMode,
  updateSchemeFormsisTranMode,
  updateSchemeId,
} from 'src/app/core/store/schemeFormStore/schemeform.action';
import Swal from 'sweetalert2';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-scheme-list',
  templateUrl: './scheme-list.component.html',
  styleUrls: ['./scheme-list.component.scss'],
})
export class SchemeListComponent implements OnInit {
  //objects-----------------------------------------------------------------------------------
  private unsubscribe$: Subject<void> = new Subject<void>();
  //form Variables--------------------------------------------------------------------------------
  formScheme: FormGroup;
  dropDownProduct: any = [];

  //additional variables--------------------------------------------------------------------------
  schemeDetails: SchemeDetails[] = [];
  pageNo: number = 1;
  pageSize: number = 5;
  pageCount: number = 30;
  tableSizes: number[] = [5, 10, 25, 50, 100];
  schemeDetailsDelete: any;
  CutomerAccount: boolean;
  SchemeTypeval: boolean = false;
  //Life cycle function---------------------------------------------------------------------------
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private envFn: EnvFunction,
    private schemeService: SchemeService,
    private appStore: Store<AppState>
  ) {
    this.appStore.dispatch(showLoader({ status: true }));
  }

  ngOnInit(): void {
    this.AccountSelect();
    this.createForm();
    this.getProductList();
    // this.getSchemeDetails();
    this.onChangeProductValue();
    this.onChangeSearchValue();
    this.appStore.dispatch(showLoader({ status: false }));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  protected AccountSelect() {
    // Swal.fire({
    //   // title: "Place the order?",
    //   text: "You want Customer Account or Office Account !!",
    //   icon: "question",
    //   showCancelButton: true,
    //   confirmButtonText: "Customer Account",
    //   cancelButtonText: "Office Account",
    //   showLoaderOnConfirm: true, // Display a loading spinner in the confirm button
    //   preConfirm: (choice) => {
    //     if (choice === "Customer Account") {
    //       return "Customer Account";
    //       this.appStore.dispatch(updateSchemeFormCutomerAccount({CutomerAccount:true}));
    //       this.CutomerAccount=true;
    //     } else {
    //       this.appStore.dispatch(updateSchemeFormCutomerAccount({CutomerAccount:false}));
    //       this.CutomerAccount=false;
    //       return "Office Account";
    //     }
    //   },
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     const choice = result.value;
    //     switch (choice) {
    //       case "Customer Account":
    //         // Proceed with payment
    //         console.log("Customer");
    //         break;
    //       case "Office Account":
    //         // Proceed without payment
    //         console.log("Office");
    //         break;
    //     }
    //   }
    // });
  }
  //Service functions-------------------------------------------------------------------------------------

  //get product list from store
  private getProductList() {
    this.dropDownProduct = [];
    this.schemeService
      .getSchemeTypeList()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (data: any) => {
          if (data.statusCode == 200) {
            const allProductJson = [{ schemeTypeId: 0, schemeType: 'All' }];
            this.dropDownProduct = allProductJson.concat(data.result);
          } else {
            this.envFn.showResponseErrorMessage(
              'something went wrong while fetching product list'
            );
          }
        },
        (err) => {
          this.envFn.showResponseErrorMessage(
            'something went wrong while fetching product list'
          );
        }
      );
  }

  //get scheme details from store
  private getSchemeDetails(searchData: string = '') {
    const productId: number = Number(
      this.formScheme.get('productControl')?.value
    );
    this.schemeDetails = [];
    console.log(this.formScheme.get('searchControl')?.valid, 'valid');
    console.log(
      !(String(this.formScheme.get('searchControl')?.value).trim().length > 2),
      'length'
    );
    if (
      !(
        String(this.formScheme.get('searchControl')?.value).trim().length > 2
      ) &&
      !this.formScheme.get('searchControl')?.valid
    )
      return;
    this.schemeService
      .getSchemeDetails(productId, searchData, this.pageNo, this.pageSize)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (data: any) => {
          if (data.statusCode == 200) {
            if (data.result != 'NODATA') {
              this.schemeDetails = data.result;
              this.pageCount = this.schemeDetails[0].totalCount;
              console.log(this.schemeDetails, 'ssss');
            }
          } else
            this.envFn.showResponseErrorMessage(
              'something went wrong while fetching schemes'
            );
        },
        (err) => {
          this.envFn.showResponseErrorMessage(
            'something went wrong while fetching schemes'
          );
        }
      );
  }

  //form functions-----------------------------------------------------------------------------------------------
  //form declaration-----------------------------------------------------
  private createForm(): void {
    this.formScheme = this.fb.group({
      productControl: new FormControl(0, [
        Validators.required,
        Validators.pattern(EnvVariable.patternStringAndNumberAndSomeSpecial),
      ]),
      searchControl: new FormControl('', [
        Validators.minLength(EnvVariable.minSearchLength),
      ]),
    });
  }

  //onChange product
  private onChangeProductValue() {
    this.schemeDetails = [];
    this.formScheme
      .get('productControl')
      ?.valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe((productId) => {
        this.pageNo = 1;
        const searchData: string = String(
          this.formScheme.get('searchControl')?.value
        );
        if (
          String(this.formScheme.get('searchControl')?.value).trim().length >
            2 &&
          searchData.length > 3
        )
          this.getSchemeDetails(searchData);
        // else this.getSchemeDetails()
        else this.schemeDetails = [];
      });
  }

  //onChange search value
  private onChangeSearchValue() {
    this.schemeDetails = [];
    this.formScheme
      .get('searchControl')
      ?.valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe((searchData) => {
        this.getSchemeDetails(searchData);
        // else if (String(this.formScheme.get('searchControl')?.value).length == 0) this.getSchemeDetails()
      });
  }

  //validation
  public getErrorMessage(controlName: string): string {
    return this.envFn.getFormError(this.formScheme, controlName);
  }

  //form submission
  public validateForm() {
    if (this.formScheme.get('productControl')?.value) {
    }
  }

  //Other functions----------------------------------------------------------------------------------------

  //when table size is changed
  onTableSizeChange(event: any) {
    this.pageSize = event.target.value;
    const searchData = this.formScheme.get('searchControl')?.value;
    this.getSchemeDetails(searchData);
  }

  //when pagination of the table change
  onTableDataChange(event: any) {
    this.pageNo = event;
    const searchData = this.formScheme.get('searchControl')?.value;
    this.getSchemeDetails(searchData);
  }

  //get product name from id
  // public getProductNameFromId(productId:number=0){
  //   const productDetail = this.dropDownProduct.find((item: { productId: number; name:string })=>(item.productId == productId)?item:null)
  //   return productDetail?productDetail.name:'';
  // }

  //go to scheme data entry page By clicking Pending Entries
  public goToSchemeEntryPage() {
    this.appStore.dispatch(updateSchemeFormPendingView({ PendingView: true }));
    const schemeTypeId = Number(this.formScheme.get('productControl')?.value);
    const schemeType = this.envFn.getDescriptionById(
      this.dropDownProduct,
      'schemeTypeId',
      this.formScheme.get('productControl')?.value,
      'schemeType'
    );
    if (schemeTypeId != 0) {
      if (schemeTypeId == 3) {
        this.appStore.dispatch(
          updateFetchedProductId({ productId: schemeTypeId })
        );
        console.log(schemeTypeId, 'productId');
        this.router.navigate(['schemeform/officeAccount'], {
          relativeTo: this.route,
        });
        // this.router.navigate(['schemeform'], { relativeTo: this.route });
      } else {
        this.appStore.dispatch(
          updateFetchedProductId({ productId: schemeTypeId })
        );
        console.log(schemeTypeId, 'productId');
        this.router.navigate(['schemeform'], { relativeTo: this.route });
      }
    } else {
      this.SchemeTypeval = true;
    }
  }
  //go to scheme data entry page By clicking NewScheme
  public goToSchemeEntryPageNew() {
    this.appStore.dispatch(updateSchemeFormPendingView({ PendingView: false }));
    const schemeTypeId = Number(this.formScheme.get('productControl')?.value);
    const schemeType = this.envFn.getDescriptionById(
      this.dropDownProduct,
      'schemeTypeId',
      this.formScheme.get('productControl')?.value,
      'schemeType'
    );
    if (schemeTypeId != 0) {
      if (schemeTypeId == 3) {
        this.appStore.dispatch(
          updateFetchedProductId({ productId: schemeTypeId })
        );
        console.log(schemeTypeId, 'productId');
        this.router.navigate(['schemeform/officeAccount'], {
          relativeTo: this.route,
        });
        // console.log(schemeTypeId,'productId');
        // this.router.navigate(['schemeform'], { relativeTo: this.route });
      } else {
        this.appStore.dispatch(
          updateFetchedProductId({ productId: schemeTypeId })
        );
        console.log(schemeTypeId, 'productId');
        this.router.navigate(['schemeform'], { relativeTo: this.route });
      }
    } else {
      this.SchemeTypeval = true;
    }
  }
  goEditPage(schemeId: number) {
    console.log(schemeId, 'kkk');

    this.appStore.dispatch(updateSchemeId({ schemeId: schemeId }));
    this.appStore.dispatch(updateSchemeFormsisTranMode({ status: true }));
    this.appStore.dispatch(updateSchemeFormsEditMode({ status: true }));
    this.appStore.dispatch(updateSchemeFormViewOnly({ viewOnly: false }));
    this.appStore.dispatch(updateSchemeFormPendingView({ PendingView: false }));
    const schemeTypeId = Number(this.formScheme.get('productControl')?.value);
    this.appStore.dispatch(updateFetchedProductId({ productId: schemeTypeId }));
    if (schemeTypeId != 0) {
      if (schemeTypeId == 3) {
        this.appStore.dispatch(
          updateFetchedProductId({ productId: schemeTypeId })
        );
        console.log(schemeTypeId, 'productId');
        this.router.navigate(['schemeform/officeAccount'], {
          relativeTo: this.route,
        });
      } else {
        this.appStore.dispatch(
          updateFetchedProductId({ productId: schemeTypeId })
        );
        console.log(schemeTypeId, 'productId');
        this.router.navigate(['schemeform'], { relativeTo: this.route });
      }
    } else {
      this.SchemeTypeval = true;
    }
  }
  goViewPage(schemeId: number) {
    this.appStore.dispatch(updateSchemeFormPendingView({ PendingView: false }));
    this.appStore.dispatch(updateSchemeId({ schemeId: schemeId }));
    this.appStore.dispatch(updateSchemeFormsisTranMode({ status: true }));
    this.appStore.dispatch(updateSchemeFormsEditMode({ status: true }));
    this.appStore.dispatch(updateSchemeFormViewOnly({ viewOnly: true }));
    const schemeTypeId = Number(this.formScheme.get('productControl')?.value);
    this.appStore.dispatch(updateFetchedProductId({ productId: schemeTypeId }));
    if (schemeTypeId != 0) {
      if (schemeTypeId == 3) {
        this.appStore.dispatch(
          updateFetchedProductId({ productId: schemeTypeId })
        );
        console.log(schemeTypeId, 'productId');
        this.router.navigate(['schemeform/officeAccount'], {
          relativeTo: this.route,
        });
      } else {
        this.appStore.dispatch(
          updateFetchedProductId({ productId: schemeTypeId })
        );
        console.log(schemeTypeId, 'productId');
        this.router.navigate(['schemeform'], { relativeTo: this.route });
      }
    } else {
      this.SchemeTypeval = true;
    }
  }
  public Delete(schemeId: any) {}
  public Searchbutton() {
    this.getSchemeDetails(this.formScheme.get('searchControl')?.value);
  }
  public generateTran(schemeId: any) {
    this.appStore.dispatch(updateSchemeId({ schemeId: schemeId }));
    try {
      this.appStore
        .select(fetchSchemeFormState_generalInfo)
        .subscribe((data) => {
          this.schemeDetailsDelete = data.schemeDetails;
        });
    } catch (error) {
      this.envFn.showResponseErrorMessage(
        'Something went wrong while fetching data from store'
      );
    }
    let params = new HttpParams();
    const Data = this.schemeDetailsDelete;
    params = params.set('editedData', JSON.stringify(Data));
    params = params.set('updatedData', JSON.stringify(Data));
    const userId = 22;
    const branchId = 1;
    const FeatureId = 34;
    const Amount = 0;
    const Method = 'DELETE';
    const incAuthcount = 0;
    const loanCount = 0;
    // this.envFn
    //           .generateTran(userId,branchId,FeatureId,Amount,Method,incAuthcount,loanCount,params)
    //           .subscribe(
    //             (data: any) => {
    //               if (data.statusCode == 200) {
    //                 // this.isConfirm=true
    //                 this.router.navigate(['/'], { relativeTo: this.route });
    //                 this.envFn.showSwalAlert(
    //                   '',
    //                   'Scheme Delete request ' +
    //                   data.result +
    //                   ' sent for verification successfully !!',
    //                   'success'
    //                 );
    //               } else {
    //                 // Failure
    //                 // this.isConfirm=true
    //                 this.envFn.showResponseErrorMessage('Something went wrong');
    //               }
    //             },
    //             (error: any) => {
    //               // Error
    //               // this.isConfirm=true
    //               this.envFn.showResponseErrorMessage('Something went wrong');
    //             }
    //           );
  }
  public resetData() {}
  onProductChange(event: any) {
    console.log(event.value);
    if (event.value == 0) {
      this.SchemeTypeval = true;
    } else {
      this.SchemeTypeval = false;
    }
  }
}
