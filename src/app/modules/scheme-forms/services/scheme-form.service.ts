import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { EnvUrl } from 'src/app/core/env/url/env-url';
import { AppState } from 'src/app/core/store/app.state';
import { getSchemeFormTranIdState } from 'src/app/core/store/schemeFormStore/schemeform.selectors';

@Injectable({
  providedIn: 'root'
})
export class SchemeFormService {

  //objects-----------------------------------------------------------------------------------
  private unsubscribe$: Subject<void> = new Subject<void>();

  //other variable
  private tranNum: number = -1;
  private branchId: number = 1;
  private userId: number = 1;


  constructor(
    private http: HttpClient,
    private url: EnvUrl,
    private appStore: Store<AppState>
  ) {
    this.getDataFromStore();
  }

  //get Datas From Store
  private getDataFromStore() {
    this.appStore.select(getSchemeFormTranIdState).pipe(takeUntil(this.unsubscribe$)).subscribe((data) => { this.tranNum = data });
  }

  //getPendingSchemeDetails
  public getPendingSchemeDetails(pageNo:number=0, pageSize:number=0){
    const paramData = {
      pageNo:pageNo,
      pageSize:pageSize
    }
    return this.http.get(this.url.urlGetPendingSchemeLIst, {params:paramData})
  }

  //save or update data on temp table
  public saveSchemeData(schemeName: string, formName: string, formData: any, isNewScheme: boolean = false) {
    const bodyParams = new HttpParams().set('schemeDetails',JSON.stringify(formData));
    let paramData=null;
    if (!isNewScheme) {
      paramData = {
        tempId : formData.schemeId,
        userId: this.userId,
        branchId: this.branchId,
        schemeName : schemeName,
        lastUpdatedStage : formName
      }
      console.log(paramData,'executing put partial save')
      return this.http.put(this.url.urlSaveSchemeDetails, bodyParams, {params:paramData});
    }
    else{
      paramData = {
        userId: this.userId,
        branchId: this.branchId,
        schemeName : schemeName,
        lastUpdatedStage : formName
      }
      console.log('executing post partial save')
      return this.http.post(this.url.urlSaveSchemeDetails, bodyParams, {params:paramData});
    }
  }

  //getScheme Details By temporary scheme Id of partial save
  public getSchemeDetailsByTempId(schemeId: number) {
    const paramData = {schemeTempId: schemeId};
    return this.http.get(this.url.urlGetSchemeDetailsByTempId, { params: paramData });
  }

  //getSchemeDetailsById
  public getSchemeDetailsById(schemeId: number) {
    // const paramData = {schemeId: schemeId}
    const url = this.url.urlGetSchemeDetailsById+schemeId
    return this.http.get(url);
  }

  //getGenderLIst
  public getGenderList() {
    return this.http.get(this.url.urlGetDropDownGenderAllList);
  }

  //getBranchLIst
  public getBranchList(branchName:string='%%') {
    const paramData = {
      branchName : branchName
    }
    return this.http.get(this.url.urlGetDropDownBranchList, {params:paramData});
  }
  //getZoneLIst
  public getZoneList() {
    return this.http.get(this.url.urlGetDropDownZoneList);
  }

  //getRegionLIst
  public getRegionList() {
    return this.http.get(this.url.urlGetDropDownRegionList);
  }

  public getGlCodeList() {
    return this.http.get(this.url.urlGetDropDownSubHead);

  }

  public getSearchGlCodeList(subHead:any) {
    const paramData = {
      name : subHead
    }
    return this.http.get(this.url.UrlGlCode,{params:paramData});
  }

  public getRePaymentTypeList() {
    return this.http.get(this.url.urlGetDropDownRepaymentTypeList);
  }

  public getValidationProcedureList() {
    return this.http.get(this.url.urlGetDropDownValidationProceduresList);
  }

  public getApplicableToList() {
    return this.http.get(this.url.urlGetDropDownApplicableToTypeList)
  }

  public getChannelTypeList() {
    return this.http.get(this.url.urlGetDropDownChannelTypeList)
  }

  public getCustomerTypeList() {
    return this.http.get(this.url.urlGetDropDownCustomerTypeList)
  }

  public getinteresttype(){
    return this.http.get(this.url.urlGetDropDowngetInterestType)
  }

  public getfrequency(){
    return this.http.get(this.url.UrlDropdownGetfrequency)
  }
  public getinterestComputationtype(){
    return this.http.get(this.url.UrlDropdownGetinterestcomputationtype)
  }
  public getinterestcalculationtype(){
    return this.http.get(this.url.UrlDropdownGetinterestcalculationtype)
  }
  public getsubhead(){
    return this.http.get(this.url.UrlDropdownGetsubhead)
  }
  public getDocumentTypeList() {
    return this.http.get(this.url.urlGetDropDownDocumentList)
  }
  public getinterestbasis(){
    return this.http.get(this.url.UrlDropdownGetinterestbasis)
  }
  public getTransactionLabel(){
    return this.http.get(this.url.UrlDropdownGetTransactionLabel)
  }

  //serching glCode
  public searchGlCode(schemeCode:any){
    const paramData = {
      schemeCode: schemeCode
    }
    return this.http.get<any>(this.url.urlSearchGlCode,{ params: paramData });
  }
  public getProcedure(flag:any)
  {
    const paramData = {
      flag: flag
    }
   return this.http.get(this.url.UrlDropdownGetProcedure,{ params: paramData})
  }
  // public RefreshTo()
  // {
  //   return this.http.get(this.url.urlGetScheme)
  // }
  public getSecurityType(){
    return this.http.get(this.url.UrlDropdownSecurityType);
  }
   //getGenderLIst
   public getGLCodeAll() {
    return this.http.get(this.url.UrlDropdownGetGlCode);
  }
}
