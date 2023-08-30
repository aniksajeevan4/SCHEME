import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvUrl } from 'src/app/core/env/url/env-url';
export interface Override {
  "schemeId": number,
  "customerId": number,
  "groupTypeId": number,
  "branchDetails": any,
  "schemeInterestDefinition": any,
  "schemeCharges": any
  "schemeLimitDefDetails": any
}
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  override: Override = {
    "schemeId": 0,
    "customerId": 0,
    "groupTypeId": 4,
    "branchDetails": [''],
    "schemeInterestDefinition": [],
    "schemeCharges": [],
    "schemeLimitDefDetails": []
  }
  constructor(
    private http: HttpClient,
    private url: EnvUrl) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  };


  public generateTran(userId: any, branchId: number, featureId: number, Amount: number, Method: string, incAuthcount: number, loanCount: number, body: any) {
    const paramData = {
      userId: userId,
      branchId: branchId,
      featureId: featureId,
      Amount: Amount,
      Method: Method,
      incAuthcount: incAuthcount,
      loanCount: loanCount
    }
    return this.http.post(this.url.UrlGetTranGeneration, body, { headers: this.httpOptions.headers, params: paramData })
  }

  public sendBackReview(tranNum: number, userId: any, branchId: number, featureId: number, Reason: string, Amount: number, loanCount: number, incAuthcount: number, body: any) {
    console.log('in scheme service - send back')

    const paramData = {
      tranNumber: tranNum,
      userId: userId,
      branchId: branchId,
      featureId: featureId,
      Reason: Reason,
      Amount: Amount,
      loanCount: loanCount,
      incAuthcount: incAuthcount,
    }
    return this.http.put(this.url.UrlSendBackReview, body, { headers: this.httpOptions.headers, params: paramData })
  }
  public BranchList(branchName: string = '', schemeId: any) {
    const paramData = {
      branchName: branchName,
      schemeId: schemeId
    }
    return this.http.get(this.url.urlGetDropDownBranchList, { params: paramData });
  }

  public getSchemeList(refreshTo: any,schemeTypeId:any) {
    const paramDta = {
      refreshTo: refreshTo,
      schemeTypeId:schemeTypeId
    }
    return this.http.get<any>(this.url.urlGetScheme, { params: paramDta });
  }

  //getZoneList
  public getZoneList() {
    return this.http.get(this.url.urlGetDropDownZoneList);
  }

  //getRegionLIst
  public getRegionList() {
    return this.http.get(this.url.urlGetDropDownRegionList);
  }

  //for fetching custDetails anf tokens
  public getFeature(userId: any) {
    const headers = new HttpHeaders().set('skipInterceptor', 'true');

    const paramData = {
      userId: userId,
      applicationId: 4,
      moduleId: 1
    }
    return this.http.get<any>(this.url.UrlGetFeatureList, { headers: headers, params: paramData })
  }

  getTransactionData(transactionNumber: any, branchId: any) {
    const paramData = {
      transactionNumber: transactionNumber,
      branchId: branchId,
    }
    return this.http.get(this.url.UrlGetTransactionData, { params: paramData });
  }
  //get customer Id
  public getCustomerId(customerId: any) {
    const url = this.url.UrlGetCustomerId + customerId
    return this.http.get(url)

  }

  // public getBranchBySearch(branch:string){
  //   return this.http.get('http://192.168.12.134:8090/gl/v1/Scheme/branchlist?branchName='+branch)
  // }
  public getBranchBySearch(branchName: string) {
    const paramData = {
      branchName: branchName,
    }
    return this.http.get(this.url.UrlBranchSearch, { params: paramData });
  }
  //get Canvassed by
  canvassedByIdGet(id: number | string) {

    return this.http.get<any>(this.url.UrlCanvassedBy + '?CanvassedID=' + id);
  }

  //get Appraised by
  appraisedGet(id: number | string) {
    return this.http.get<any>(this.url.UrlAppraisedBy + '?appraisedId=' + id);
  }

  refreshToken(body: any) {
    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
    });
    let options = { headers: headers };
    return this.http.post<any>(this.url.UrlGetRefreshToken, body, options);

  }

  //Delete From Pending Entries
  DeletePendingEntries(schemeTempId: any) {
    const paramData = {
      schemeTempId :  schemeTempId
    }
    return this.http.delete(this.url.UrlDeletePendingEntries, {params:paramData});
  }

  //transactional------------------------------------------------------------------------------------------------
  //get bank account details of a particular customer
  public getCustomerBankAccounts(cutomerId: number) {
    const paramData = {
      customerId: cutomerId
    }
    return this.http.get(this.url.urlGetCustomerBankAccounts, { params: paramData });
  }

  //check ifsc code
  public checkIFSCExist(ifsc:string){
    const bodyParams = {'IFSC': ifsc.toUpperCase()};
    return this.http.post(this.url.urlCheckIFSC, bodyParams)
  }

  //get nominee details of a particular customer
  public getCustomerNominees(cutomerId: number) {
    const paramData = {
      customerId: cutomerId
    }
    return this.http.get(this.url.urlGetCustomerNominees, { params: paramData });
  }

  //get relationship master data
  public getRelationshipMaster() {
    return this.http.get(this.url.urlGetNomineeRelationship);
  }

  //get relationship master data
  public getGenderMaster() {
    return this.http.get(this.url.urlGetGenderMaster);
  }

  //get Name prefix master data
  public getNamePrefixMaster() {
    return this.http.get(this.url.urlGetNamePrefix);
  }

  //get phone Country code  master data
  public getCountryCodeMaster() {
    return this.http.get(this.url.urlGetPhCountryCode);
  }

  public getModeOfTransfer() {
    return this.http.get(this.url.urlGetModeOfTransfer);
  }

  public getKYCDocumentsByProofId(proofId: number = 1) {
    const paramData = {
      proofTypeId: proofId
    }
    return this.http.get(this.url.urlGetKYCDocumentList, { params: paramData });
  }

  public getOTPSource() {
    return this.http.get(this.url.urlGetOTPSourceList);
  }

  public sendOTP(customerId: number|null, mobileNumber: number, verifiedSourceId:number,  KYCdocumentTypeId: number | null = null, KYCNumber: string | null, flag: string) {
    const bodyData = {
      customerId: customerId,
      mobileNumber: mobileNumber,
      verifiedSourceId: verifiedSourceId,
      KYCdocumentType: KYCdocumentTypeId,
      KYCNumber: KYCNumber,
      Flag: flag
    }
    return this.http.post(this.url.urlGenerateOTP, bodyData)
  }

  public verifyOTP(mobileNumber: number, OTP:number, flag:string) {
    const paramData = {
      mobileNumber: mobileNumber,
      oTP: OTP,
      flag : flag
    }
    return this.http.get(this.url.urlVerifyOTP, {params:paramData});
  }

  public getGoldRate() {
    return this.http.get(this.url.urlGoldRate)
  }

  public glFileUpload(fileName: any, file: any, imageType:number) {
    const paramData = {
      fileName : fileName,
      imageType : imageType
    }
    return this.http.post<any>(this.url.urlPostGLUploadFile,file, {params:paramData});
  }
}
