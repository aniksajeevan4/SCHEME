import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../customer.service';
import { CacheService } from 'src/app/core/cache/cacheService/cache.service';
import { CacheKey } from 'src/app/core/cache/cacheKey/cache-key';
import { EnvFunction } from 'src/app/core/env/function/env-function';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-customer-information',
  templateUrl: './customer-information.component.html',
  styleUrls: ['./customer-information.component.scss']
})
export class CustomerInformationComponents implements OnInit {

  //variables>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  branches: any;
  searchMessage: any;
  branchId: any;
  search: any = [];
  count: number = 0;
  hideTable: any = false;
  submitted = false;
  page: number = 1;
  tableSize: number = 5;
  tableSizes: any = [5, 10, 15, 20, 30];
  pageSize: number = 50;
  status: any;
  featureId: any = 0;
  dataNotFound: boolean = false;
  close: any;
  branchName: string | null;
  lastCheckedIndex: number = -1;
  customerId: number | null = null
  @Output() customerDetails = new EventEmitter<any>();
  //froms>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public searchForm: FormGroup;
  currentBranchId: void;

  constructor(private service: CustomerService, private cacheService: CacheService, private fb: FormBuilder, private envFn: EnvFunction,
    private matDialogRef: MatDialogRef<CustomerInformationComponents>,) { }

  ngOnInit(): void {
    this.cacheStorage()
    this.branchId = this.cacheService.get(CacheKey.branchId)
    this.createForm()
    this.branchName = this.cacheService.get(CacheKey.branchName)
    this.branches = [{ branchId: Number(this.branchId), branchName: this.branchName }];
    this.branches = [
      {
        branchId: Number(this.cacheService.get(CacheKey.branchId)),
        branchName: this.cacheService.get(CacheKey.branchName)
      },
    ];
    this.searchForm.get('branch')?.setValue(this.branches[0].branchId);
    this.searchForm.valueChanges.subscribe(() => {
      const selectButton = document.getElementById('selectButton') as HTMLButtonElement;
      if (selectButton) {
        selectButton.disabled = !this.searchForm.value.search.some((customer: any) => customer.selected);
      }
    });

    // this.searchGet()
  }
  //form functions>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  //form declaration>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.
  private createForm(): void {
    this.searchForm = this.fb.group({
      branch: [null],
      id: ['', [Validators.pattern(/^[0-9]+$/)]],
      name: ['', [Validators.pattern(/^[A-Za-z]+$/)]],
      phone: [
        '',
        [Validators.pattern('^(?!0)[0-9]{10}$'), Validators.minLength(10)],
      ],
      aadhar: ['', [Validators.pattern('[a-zA-Z0-9/-]*')]],
      statusId: ['0'],
    });
  }
  get Validation() {
    return this.searchForm.controls;
  }

  keyup(event: any) {
    if (event.target.value.length >= 3) {
      this.branches = [];
      this.service
        .getbranchesByUser(this.cacheService.get(CacheKey.userId), event.target.value)
        .subscribe((res: any) => {
          this.branches = res.result;
          this.searchForm.get('branch')?.setValue(Number(this.branchId));
          // if (this.branches.length == 1)
          //   localStorage.setItem('isCooperateBranch', '');
          // else localStorage.setItem('isCooperateBranch', '1');

        });
      this.searchMessage = null;
    } else {
      if (!this.searchForm.get('branch')?.value)
        this.searchMessage = 'Please enter 3 letters of branch';
    }
  }


  searchGet() {
    // const alertMessage = document.getElementById('alert-message');
    // if (alertMessage) {
    //   alertMessage.textContent = '';
    // }
    // let globSearch = document.getElementById('glbsrch') as HTMLInputElement;

    this.search = [];
    this.count = 0;
    if (
      this.searchForm.controls['branch']?.value == null
      // &&localStorage.getItem('getAllBranch') == ''
    ) {
      const alertMessages = document.getElementById('alert-messages');
      if (alertMessages) {
        alertMessages.textContent = 'Please select a branch';
      }

      this.hideTable = false;
      return;
    }
    this.submitted = true;
    var customerId = !this.searchForm.controls['id']?.value
      ? 0
      : this.searchForm.controls['id']?.value;
    var firstName = !this.searchForm.controls['name']?.value
      ? ''
      : this.searchForm.controls['name']?.value;

    var mobileNumber = !this.searchForm.controls['phone']?.value
      ? ''
      : this.searchForm.controls['phone']?.value;
    var kycDocNumber = !this.searchForm.controls['aadhar']?.value
      ? ''
      : this.searchForm.controls['aadhar']?.value;
    var branchId = this.cacheService.get(CacheKey.branchId)
    // localStorage.getItem('getAllBranch') == '1'
    //   ? 0
    //   : this.searchForm.controls['branch']?.value;

    // if (globSearch) {
    //   globSearch.checked = false;
    //   localStorage.setItem('getAllBranch', '');
    // }
    if (this.searchForm.controls['statusId']?.value == 0) {
      this.status = 1;
    } else {
      this.status = this.searchForm.controls['statusId']?.value;
    }
    var userId = this.cacheService.get(CacheKey.userId)

    this.page = 1;
    this.pageSize = this.tableSize;
    if (
      (parseInt(customerId) > 0 ||
        (firstName && firstName.length >= 3) ||
        mobileNumber != '' ||
        kycDocNumber != '' ||
        branchId,
        userId)
    ) {
      this.service
        .searchGet(
          this.page,
          this.pageSize,
          firstName,
          mobileNumber,
          kycDocNumber,
          customerId,
          this.status,
          branchId,
          this.featureId,
          userId
        )
        .subscribe((res: any) => {
          if (!res.result) {
            this.hideTable = false;
          } else if (res.result.length === 0) {
            this.dataNotFound = true;
          } else {
            this.search = res.result;
            this.hideTable = true;
            this.count = res.result[0].totalCount;
            if (res.result[0].status == 'Closed') {
              this.close = 1;
            } else {
              this.close = 0;
            }
            this.dataNotFound = false;
          }
          if (
            !customerId &&
            !firstName &&
            !mobileNumber &&
            !kycDocNumber &&
            !this.status &&
            this.dataNotFound
          ) {
            this.dataNotFound = true;
          }
        });
    } else {
      this.search = [];
      this.close = 0;

      this.dataNotFound = true;
    }
    // const alertMessages = document.getElementById('alert-messages');
    // if (alertMessages && alertMessages.textContent !== '') {
    //   alertMessages.textContent = '';
    // }
    // const selectButton = document.getElementById('selectButton') as HTMLButtonElement;
    // if (selectButton) {
    //   selectButton.disabled = !this.search.some((customer:any) => customer.selected);
    // }
  }

  onCheckboxChange(index: number, customerId: number) {
    // Toggle the selected state of the customer at the given index
    this.search[index].selected = !this.search[index].selected;

    // If a new checkbox is checked, uncheck the previously checked checkbox
    if (this.lastCheckedIndex !== -1 && this.lastCheckedIndex !== index) {
      this.search[this.lastCheckedIndex].selected = false;
    }

    // Update the lastCheckedIndex to the currently checked index
    this.lastCheckedIndex = this.search[index].selected ? index : -1;
    this.customerId = customerId;

  }
  anyCheckboxSelected(): boolean {
    // Check if any checkbox is selected in the search array
    return this.search.some((customer:any) => customer.selected);
  }

  hasSelected() {
    console.log("cxfgh", this.customerId);
    if (this.customerId) this.closeDialog(this.customerId)
    else this.envFn.showSwalToast('', 'No customer selected', 'error', 1000)
    this.customerId=null
  }

  onTableSizeChange(event: any) {
    this.tableSize = event.target.value;
    this.page = 1;
    this.searchGet();
  }

  onTableDataChange(event: any) {
    const alertMessage = document.getElementById('alert-message');
    if (alertMessage) {
      alertMessage.textContent = '';
    }

    this.search = [];
    this.count = 0;
    if (
      this.searchForm.controls['branch']?.value == null
      // &&
      // localStorage.getItem('getAllBranch') == ''
    ) {
      const alertMessage = document.getElementById('alert-messages');
      if (alertMessage) {
        alertMessage.textContent = 'Please select a branch';
      }

      this.hideTable = false;
      return;
    }
    this.submitted = true;
    this.page = event;

    var customerId = !this.searchForm.controls['id']?.value
      ? 0
      : this.searchForm.controls['id']?.value;
    var firstName = !this.searchForm.controls['name']?.value
      ? ''
      : this.searchForm.controls['name']?.value;
    var mobileNumber = !this.searchForm.controls['phone']?.value
      ? ''
      : this.searchForm.controls['phone']?.value;
    var kycDocNumber = !this.searchForm.controls['aadhar']?.value
      ? ''
      : this.searchForm.controls['aadhar']?.value;
    var branchId = this.cacheService.get(CacheKey.branchId)

    if (this.searchForm.controls['statusId']?.value == 0) {
      this.status = 1;
    } else {
      this.status = this.searchForm.controls['statusId']?.value;
    }
    var userId = this.cacheService.get(CacheKey.userId)
    this.pageSize = this.tableSize;
    if (
      parseInt(customerId) > 0 ||
      (firstName && firstName.length >= 3) ||
      mobileNumber != '' ||
      kycDocNumber != '' ||
      branchId ||
      userId
    ) {
      this.search = [];
      this.service
        .searchGet(
          this.page,
          this.pageSize,
          firstName,
          mobileNumber,
          kycDocNumber,
          customerId,
          this.status,
          branchId,
          this.featureId,
          userId
        )
        .subscribe((res: any) => {
          if (!res.result) {
            this.hideTable = false;
          } else if (res.result.length === 0) {
            this.dataNotFound = true;
          } else {
            this.search = res.result;
            this.hideTable = true;
            this.count = res.result[0].totalCount;
            if (res.result[0].status == 'Closed') {
              this.close = 1;
            } else {
              this.close = 0;
            }
            this.dataNotFound = false;
          }
          if (
            !customerId &&
            !firstName &&
            !mobileNumber &&
            !kycDocNumber &&
            !this.status &&
            this.dataNotFound
          ) {
            this.dataNotFound = true;
          }
        });
    } else {
      this.search = [];
      this.close = 0;

      this.dataNotFound = true;
    }
    const alertMessages = document.getElementById('alert-messages');
    if (alertMessages && alertMessages.textContent !== '') {
      alertMessages.textContent = '';
    }
  }
  clearSearch() {
    this.search = [];
    this.count = 0;
    this.hideTable = false;
    this.searchForm.patchValue({
      id: '',
      name: '',
      phone: '',
      aadhar: '',
      branch: null,
      statusId: ''
    });
    this.dataNotFound = false;
    this.submitted = false;
    const alertMessage = document.getElementById('alert-message');
    if (alertMessage) {
      alertMessage.textContent = '';
    }
    const alertMessages = document.getElementById('alert-messages');
    if (alertMessages) {
      alertMessages.textContent = '';
    }
  }
  private cacheStorage() {
    this.cacheService.set(CacheKey.branchId, 1, 0);
    this.cacheService.set(CacheKey.userId, 17, 0);
    this.cacheService.set(CacheKey.branchName, "CORPORATE KALOOR-KER", 0)

  }

  //close Modal---------------------------------------------
  public closeDialog(dialogData: number | null = null) {
    this.matDialogRef.close(dialogData)

  }
}
