import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvUrl } from 'src/app/core/env/url/env-url';

@Injectable({
  providedIn: 'root'
})
export class InterestDefinitionService {

  constructor(
    private http: HttpClient,
    private url: EnvUrl) { }


  // schemeinterestratebyid(interestDefId:any)
  // {
  //    return this.http.get(environment.schemeinterestratebyid+'?interestDefId='+interestDefId);
  //   UrlGetDropDowngetSchemeInterestRate
  // }
  schemeinterestratebyid(interestDefId: any) {
    const paramData = {
      interestDefId: interestDefId
    }
    return this.http.get(this.url.UrlGetDropDowngetSchemeInterestRate, { params: paramData })
  }
  getinteresttype() {
    // return this.http.get(environment.getinteresttype);
    return this.http.get(this.url.urlGetDropDowngetInterestType)
  }
  getinterestcodelist() {
    return this.http.get(this.url.UrlGetInterestcodeList)
  }

  //chargeDefinition service
  public getChargeCode() {
    return this.http.get<any>(this.url.urlGetChargeCode);
  }

  public getSchemeList() {
    return this.http.get<any>(this.url.urlGetScheme);

  }

  public getChargeDetailsById(chargeDefId: number) {

    return this.http.get<any>(
      this.url.urlGetChargeDetailsById + 'chargeDefId=' + chargeDefId
    );
  }
  public InterestCodeDdupCheck(interestCode:any)
  {
    const paramData = {
      interestCode: interestCode
    }
    return this.http.get<any>(
      this.url.InterestCodeDdupCheck , { params: paramData }
    );
  }
  //http://192.168.12.134:8090/gl/v1/scheme/interestcodes?interestCode=iNT-1


  public getchargeAt() {
    return this.http.get<any>(this.url.urlGetchargeAt);
  }

  public getchargeOn() {
    return this.http.get<any>(this.url.urlGetchargeOn);
  }

  public getChargeType() {
    return this.http.get<any>(this.url.urlGetChargeType);
  }

  public getChargeValueType() {
    return this.http.get<any>(this.url.urlGetChargeValueType);
  }

  public getChargeTypeById(chargeTypeId: number) {
    return this.http.get<any>(this.url.urlGetChargeTypeById + 'chargeTypeId=' + chargeTypeId);
  }
  public getBranchTableList(schemeId: any = '',groupTypeId: any = '',branchGroupId:any='') {
    const paramData = {
      schemeId:schemeId,
      groupTypeId: groupTypeId,
      branchGroupId:branchGroupId
    }
    return this.http.get(this.url.UrlBranchLimit, { params: paramData });
  }

  public getApplicableToList() {
    return this.http.get(this.url.urlGetDropDownApplicableToTypeList)
  }

  public SchemeList(schemeId:number){
    return this.http.get<any>(this.url.UrlSchemeList + 'schemeId=' + schemeId);
  }

  public searchChargeCode(chargeCode:any){
    const paramData = {
      chargeCode: chargeCode
    }
    return this.http.get<any>(this.url.urlSearchChargeCode,{ params: paramData });
  }



  getschemeLimitDetailsbyid(limitDefId: any) {
    const paramData = {
      limitDefId: limitDefId
    }
    return this.http.get(this.url.getschemelimitbyid, { params: paramData })
  }
  getLimittype() {
    return this.http.get(this.url.urlGetDropDowngetInterestType)
  }
  getlimitcodelist() {
    return this.http.get(this.url.UrlGetLimitcodeList)
  }
  LimitCodeDdupCheck(LimitCode:any)
  {
    const paramData = {
      limitCode: LimitCode
    }
    return this.http.get(this.url.schemelimitDDup, { params: paramData })
  }

}

