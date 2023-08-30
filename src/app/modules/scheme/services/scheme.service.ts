import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvUrl } from 'src/app/core/env/url/env-url';

@Injectable({
  providedIn: 'root'
})
export class SchemeService {

  constructor(
    private url : EnvUrl,
    private http: HttpClient
    ) { }

  public getSchemeDetails(productId:number=0, searchData:string='', pageNo:number = 0, pageSize:number=0){
    const paramData = {
      schemeTypeId : productId,
      schemeName : searchData,
      pageNo : pageNo,
      pageSize : pageSize
    }
    return this.http.get(this.url.urlGetSchemeDetailsByProductId,{params:paramData})
  }

  public getSchemeTypeList(){
    return this.http.get(this.url.urlGetDropDownschemetypeList);
  }

  public getProductListByProductGroupId(id:number){
    const paramData = {
      productGroupId : id
    }
    return this.http.get(this.url.urlGetProductListByProductGroupId, {params:paramData});
 }

 public getSchemeList(customerId:number, outStandingFlag:number){
  const paramData = {
    customerId : customerId,
    outStandingFlag : outStandingFlag
  }
  return this.http.get(this.url.urlGetSchemeDetailsByBranchID, {params:paramData});
 }


}
