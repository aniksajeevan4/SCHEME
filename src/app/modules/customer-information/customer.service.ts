import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvUrl } from 'src/app/core/env/url/env-url';
import { CacheService } from 'src/app/core/cache/cacheService/cache.service';
import { CacheKey } from 'src/app/core/cache/cacheKey/cache-key';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private http: HttpClient,
    private envUrl: EnvUrl,
    private cacheService: CacheService
  ) { }

  getbranchesByUser(userid: any, branchName: any = '') {
    const bodyParam = {
      UserId: userid,
      branchName: branchName,
    };
    return this.http.get(this.envUrl.urlGetBranch, { params: bodyParam });
  }

  searchGet(
    pageno: any,
    pagesize: any,
    firstName: any,
    mobileNumber: any,
    kycDocNumber: any,
    customerId: any,
    statusId: any,
    branchId: any,
    featureId: any,
    userId: any
  ) {
    return this.http.get(
     this.envUrl.urlSearchGet +
        '?pageno=' +
        pageno +
        '&pagesize=' +
        pagesize +
        '&firstName=' +
        firstName +
        '&mobileNumber=' +
        mobileNumber +
        '&kycDocNumber=' +
        kycDocNumber +
        '&customerId=' +
        customerId +
        '&statusId=' +
        statusId +
        '&branchId=' +
        branchId +
        '&featureId=' +
        featureId +
        '&userId=' +
        userId
    );
  }
}
