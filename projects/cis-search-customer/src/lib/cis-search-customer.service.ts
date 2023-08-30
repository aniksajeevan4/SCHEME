import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvUrl } from 'src/app/core/env/url/env-url';
import { EnvFunction } from 'src/app/core/env/function/env-function';
import { CacheService } from 'src/app/core/cache/cacheService/cache.service';
import { CacheKey } from 'src/app/core/cache/cacheKey/cache-key';

@Injectable({
  providedIn: 'root'
})
export class CisSearchCustomerService {

  constructor(
    // private http: HttpClient,
    //  private url: EnvUrl
    ) { }
  // getbranchesByUser(userid: any, branchName: any = '') {
  //   const bodyParam = {
  //     UserId: userid,
  //     branchName: branchName,
  //   };
  //   return this.http.get(this.url.urlGetBranchesByUser, { params: bodyParam });
  // }
}

