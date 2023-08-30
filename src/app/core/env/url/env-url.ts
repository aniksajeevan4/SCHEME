export class EnvUrl {

  // public urlRequestType2: string = 'https://';
  // public urlRequestType2: string = 'https://';
  // public urlIp: string = '192.168.12.235:8075';
  // public urlIpMCSI: string = 'mcis.muthoottumini.com'

  // public urlIp8: string = '192.168.12.234:7162';
  // public urlIp1: string = '192.168.12.235:8084'
  // public urlIp4: string = '192.168.12.235:8075';
  // public urlIp5: string = '192.168.12.235:8084'
  // public urlIp6: string = '192.168.12.235:8088';
  // public urlIp9: string = '192.168.12.235:8090';
  public urlIp30: string = '192.168.12.134:8088';
  // public urlIp11: string = '192.168.12.235:8084';
  // public urlIp7: string = '192.168.12.235:8082';

  public urlRequestType: string = 'https://';
  public urlRequestType2: string = 'https://';
  public urlIp: string = '192.168.12.134:8090';
  public urlIpMCSI: string = 'mcis.muthoottumini.com'
  // https://192.168.12.134:8097/,
  public urlIp8: string = '192.168.12.134:7162';
  public urlIp1: string = '192.168.12.134:8084'
  public urlIp4: string = '192.168.12.134:8090';
  public urlIp5: string = '192.168.12.134:8084'
  public urlIp6: string = '192.168.12.134:8088';
  public urlIp9: string = '192.168.12.134:8090';
  public urlIp10: string = '192.168.12.134:8088';
  public urlIp11: string = '192.168.12.134:8084';
  public urlIp12: string = '192.168.12.134:8072';
  public urlIp20: string = '192.168.12.134:8097'
  public urlIp7: string = '192.168.12.235:8082';
  public urlIp15: string = '192.168.12.112:7201'
  public prePath: string = '/gl/product/v1/';
  public prePathCIS: string = '/cis/v1/';
  public prePathCORE: string = '/core/v1/';
  public prePathFILEUP: string = '/fileupload/v1/';
  public prePath2: string = '/fp/v1/';
  public prePath3: string = '/tran/v1/';
  public prePath4: string = '/auth/v1/';
  public prePath5: string = '/gl/scheme/v1/';
  // public prePath6: string = '/gl/v1/account/';
  public prePath7: string = '/cis/v1/canvassedby';
  public prePath8: string = '/gl/account/v1/';
  public prePath9: string = '/fileupload/v1/';
  public prepath10: string = '/cis/v1/'
  public glFilePath:string = '/gl/fileupload/v1/'


  public fileUploadPath:string = this.urlRequestType2 + this.urlIp9;

  //OTP--------------------------------------------------------------------------------------------------------
  public urlGenerateOTP = this.urlRequestType2 + this.urlIp12 + this.prePathCORE + 'generateotp';
  public urlVerifyOTP = this.urlRequestType2 + this.urlIp12 + this.prePathCORE + 'otpverification';
  public urlGetOTPSourceList = this.urlRequestType2 + this.urlIp12 + this.prePathCORE + 'otpverifiedsource';

  //fileUpload-------------------------------------------------------------------------------------------------
  public urlPostGLUploadFile = this.urlRequestType2 + this.urlIp9 + this.glFilePath + 'upload';

  //dpn urls----------------------------------------------------------------------------------------------------

  public urlGetGLActiveAccounts = this.urlRequestType2 + this.urlIp9 + this.prePath8 + 'loanaccounts';
  public urlGetGLDpnPdfData = this.urlRequestType2 + this.urlIp9 + this.prePath8 + 'dpngeneration';

  //Gold Loan Account creation---------------------------------------------------------------------------------
  public urlGetGLLoanCalculator = this.urlRequestType2 + this.urlIp9 + this.prePath8 + 'loancalculator';
  public urlGetCustomerNominees = this.urlRequestType2 + this.urlIp9 + this.prePath8 + 'nomineedetails';
  public urlGetNomineeRelationship = this.urlRequestType2 + this.urlIp12 + this.prePathCORE + 'relationship';
  public urlGetKYCDocumentList = this.urlRequestType2 + this.urlIp9 + this.prePath8 + 'documentlist';
  public urlGetSchemeDetailsByBranchID = this.urlRequestType2 + this.urlIp9 + this.prePath8 + 'schemelist';
  public urlGetGenderMaster = this.urlRequestType2 + this.urlIp12 + this.prePathCORE + 'gender';
  public urlGetNamePrefix = this.urlRequestType2 + this.urlIp12 + this.prePathCORE + 'nameprefix';
  public urlGetPhCountryCode = this.urlRequestType2 + this.urlIp12 + this.prePathCORE + 'countrycode';
  public urlGLPartialSave = this.urlRequestType2 + this.urlIp9 + this.prePath8 + 't_loan';
  public UrlGLDeletePendingEntries = this.urlRequestType2 + this.urlIp9 + this.prePath8 + "t_loan"
  public urlGETGLPending = this.urlRequestType2 + this.urlIp9 + this.prePath8 + 't_loan/list';
  public urlPOSTGLTranSave = this.urlRequestType2 + this.urlIp11 + this.prePath3 + 'generateTran';

  //bank related urls-------------------------------------------------------------------------------------------
  public urlGetModeOfTransfer = this.urlRequestType2 + this.urlIp9 + this.prePath8 + 'modeoftransfer';
  public urlGetCustomerBankAccounts = this.urlRequestType2 + this.urlIp9 + this.prePath8 + 'bankaccount';
  public urlCheckIFSC = this.urlRequestType2 + this.urlIp6 + this.prePathCIS + 'ifsc';

  //SchemeUrl--------------------------------------------------------------------------------------------------

  //create scheme details
  public urlCreateSchemeDetails = this.urlRequestType2 + this.urlIp + this.prePath2 + 'createscheme';

  //save scheme details
  public urlSaveSchemeDetails = this.urlRequestType2 + this.urlIp + this.prePath5 + 't_scheme';

  //get scheme temp details
  public urlGetSchemeDetailsByTempId = this.urlRequestType2 + this.urlIp + this.prePath2 + 't_scheme/updatescheme';

  //getSchemeByProductId
  public urlGetSchemeDetailsByProductId = this.urlRequestType2 + this.urlIp + this.prePath5 + 'details';
  //getSchemeById
  public urlGetSchemeDetailsById = this.urlRequestType2 + this.urlIp + this.prePath5;

  //getPendingSchemeDeatils
  public urlGetPendingSchemeLIst = this.urlRequestType2 + this.urlIp + this.prePath5 + 't_scheme/list';
  //getMasterData----------------------------------------------------------------------------------------------
  //getGenderList with All
  public urlGetDropDownGenderAllList = this.urlRequestType2 + this.urlIp + this.prePath5 + 'gender';

  //getBranchList
  public urlGetDropDownBranchList = this.urlRequestType2 + this.urlIp12 + this.prePathCORE + 'branchlist';
  // public urlGetDropDownBranchList = this.urlRequestType2 + this.urlIp + this.prePath5 + 'limitedbranch?';

  //getZoneList
  public urlGetDropDownZoneList = this.urlRequestType2 + this.urlIp + this.prePath5 + 'zone';
  //getRegionLIst
  public urlGetDropDownRegionList = this.urlRequestType2 + this.urlIp + this.prePath5 + 'region';

  //getProductList
  public urlGetDropDownschemetypeList = this.urlRequestType2 + this.urlIp + this.prePath5+'schemetype';

  //getProductList
  public urlGetDropDownDocumentList = this.urlRequestType2 + this.urlIp + this.prePath5 + 'documenttype';

  //getProductListById
  public urlGetProductListByProductGroupId = this.urlRequestType2 + this.urlIp + this.prePath2 + 'productbyproductgroupid';

  //getGlCdeList
  public urlGetDropDownSubHead = this.urlRequestType2 + this.urlIp + this.prePath5 + 'subhead';

  //getRepaymentList
  public urlGetDropDownRepaymentTypeList = this.urlRequestType2 + this.urlIp + this.prePath5 + 'repaymenttype';

  //getValidationProcedureList
  public urlGetDropDownValidationProceduresList = this.urlRequestType2 + this.urlIp + this.prePath2 + 'validationprocedure';

  //getChannelList
  public urlGetDropDownChannelTypeList = this.urlRequestType2 + this.urlIp + this.prePath5 + 'channeltype';

  //getApplicableList
  public urlGetDropDownApplicableToTypeList = this.urlRequestType2 + this.urlIp + this.prePath5 + 'applicableto';

  //getCustomerTypeList
  public urlGetDropDownCustomerTypeList = this.urlRequestType2 + this.urlIp + this.prePath5 + 'customertype';


  public urlGetChargeCode = this.urlRequestType2 + this.urlIp + this.prePath5 + 'chargecode/list';

  //get SchemeList
  public urlGetScheme = this.urlRequestType2 + this.urlIp + this.prePath5 + 'list';

  public urlGetChargeDetailsById = this.urlRequestType2 + this.urlIp + this.prePath5 + 'chargecode?';

  public urlGetchargeAt = this.urlRequestType2 + this.urlIp + this.prePath5 + 'chargeat';

  public urlGetchargeOn = this.urlRequestType2 + this.urlIp + this.prePath5 + 'chargeon';

  public urlGetChargeType = this.urlRequestType2 + this.urlIp + this.prePath5 + 'chargetype/list';

  public urlGetChargeValueType = this.urlRequestType2 + this.urlIp + this.prePath5 + 'chargevaluetype';

  public urlGetChargeTypeById = this.urlRequestType2 + this.urlIp + this.prePath5 + 'chargetype?';

  public urlSearchChargeCode = this.urlRequestType2 + this.urlIp + this.prePath5 + 'chargecodes?';

  public urlSearchGlCode = this.urlRequestType2 + this.urlIp + this.prePath5 + 'schemecode?';

  //getinteresttype
  public urlGetDropDowngetInterestType = this.urlRequestType2 + this.urlIp + this.prePath5 + 'interesttype';

  //getschemeinterestratebyid
  public UrlGetDropDowngetSchemeInterestRate = this.urlRequestType2 + this.urlIp + this.prePath5 + 'interestrate';
  //getinterestcodelist
  public UrlGetInterestcodeList = this.urlRequestType2 + this.urlIp + this.prePath5 + 'interestcode';

  //getlimitcodelist
  public UrlGetLimitcodeList = this.urlRequestType + this.urlIp + this.prePath5 + 'limitcode/list';

  //getschemelimitbyid
  public getschemelimitbyid = this.urlRequestType + this.urlIp + this.prePath5 + 'schemelimit?';

  //SchemeLimitDDupChecking
  public schemelimitDDup = this.urlRequestType + this.urlIp + this.prePath5 + 'limitcode?';

  //getfrequency
  public UrlDropdownGetfrequency = this.urlRequestType2 + this.urlIp + this.prePath5 + 'frequency';

  //getinterestComputationtype
  public UrlDropdownGetinterestcomputationtype = this.urlRequestType2 + this.urlIp + this.prePath5 + 'interestcomputationtype';

  //getinterestcalculationtype
  public UrlDropdownGetinterestcalculationtype = this.urlRequestType2 + this.urlIp + this.prePath5 + 'interestcalculationtype';

  //getsubhead
  public UrlDropdownGetsubhead = this.urlRequestType2 + this.urlIp + this.prePath5 + 'subhead';

  //getinterestbasis
  public UrlDropdownGetinterestbasis = this.urlRequestType2 + this.urlIp + this.prePath5 + 'interestbasis';


  //tran generation
  // public UrlGetTranGeneration = this.urlRequestType2 + this.urlIp1 + this.prePath3 + 'generateTran?';
  public UrlGetTranGeneration = this.urlRequestType2 + this.urlIp11 + this.prePath3 + 'generateTran?';

  //tran SendBackReview
  public UrlSendBackReview = this.urlRequestType2 + this.urlIp1 + this.prePath3 + 'submitreview?';

  //get Featurelist ang user details
  public UrlGetFeatureList = this.urlRequestType2 + this.urlIp7 + this.prePath4 + 'getfeaturelist/?'

  // get branch Limit
  public UrlBranchLimit = this.urlRequestType2 + this.urlIp + this.prePath5 + 'branchlimit';

  // get branch search
  public UrlBranchSearch = this.urlRequestType2 + this.urlIp + this.prePathCORE + 'branchlist?';


  //getTransactionLabel
  public UrlDropdownGetTransactionLabel = this.urlRequestType2 + this.urlIp + this.prePath5 + 'trantypesettings';

  //get SchemeLimit
  public UrlSchemeList = this.urlRequestType2 + this.urlIp + this.prePath5 + 'limit?';


  //tran TransactionData
  // public UrlGetTransactionData = this.urlRequestType2 + this.urlIp1 + this.prePath3 + "gettransactiondata?"
  public UrlGetTransactionData = this.urlRequestType2 + this.urlIp11 + this.prePath3 + "gettransactiondata?"

  // http://192.168.12.106:7224/gl/v1/scheme/subhead?subHead=10

  //glCodeSearch
  public UrlGlCode = this.urlRequestType2 + this.urlIp + this.prePath5 + 'subhead?';


  //getTransactionLabel
  // public UrlDropdownGetTransactionLabel= 'http://192.168.12.106:7224/gl/v1/scheme/trantypesettings';


  public InterestCodeDdupCheck = this.urlRequestType2 + this.urlIp + this.prePath5 + "interestcodes?"

  //get CanvassedById
  public UrlCanvassedBy = this.urlRequestType2 + this.urlIp6 + this.prePath7

  //get AppraisedById

  public UrlAppraisedBy = this.urlRequestType2 + this.urlIp9 + this.prePath8 + 'appraisedby';

  //refresh token api
  public UrlGetRefreshToken = this.urlRequestType2 + this.urlIp7 + this.prePath4 + 'relogin'





  //gold module url--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  public UrlGetCustomerId = this.urlRequestType2 + this.urlIp9 + this.prePath8 + 'customer/'
  //get CanvassedById

  //get Ornament type>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public urlOrnamentType = this.urlRequestType2 + this.urlIp9 + this.prePath8 + 'ornamenttype'

  //get Deduct Reason>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public urlDeductReason = this.urlRequestType2 + this.urlIp9 + this.prePath8 + 'deductreason'

  //get Carat Type>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public urlCaratType = this.urlRequestType2 + this.urlIp9 + this.prePath8 + 'carattype'

  //get Purity Type>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public urlPurityType = this.urlRequestType2 + this.urlIp9 + this.prePath8 + 'puritytype'

  //upload image>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public urlfileUpload =this.urlRequestType2 + this.urlIp9 + this.glFilePath + 'upload'

  //get charge Detailsby SchemeLimitDDupChecking Id>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.
  public urlChargeDetails = this.urlRequestType2 + this.urlIp9 + this.prePath8 + 'chargedetails?'

  //get intrest Details SchemeLimitDDupChecking Id>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public urlIntrestDetails = this.urlRequestType2 + this.urlIp9 + this.prePath8 + 'interestdetails?'

  //Delete Pending>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public UrlDeletePendingEntries = this.urlRequestType2 + this.urlIp4 + this.prePath5 + "schemebytempid?"

  //get Gold Rate>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.
  public urlGoldRate = this.urlRequestType2 + this.urlIp9 + this.prePath8 + 'goldrate'

   //get eligible amount by schemeid>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
   public urlEligibleAmountBySchemeId=this.urlRequestType2+this.urlIp9+this.prePath8+'eligibleamount?'

  //get documentlist By SchemeLimitDDupChecking id>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.
  public urlDocumentlistBySchemeId = this.urlRequestType2 + this.urlIp9 + this.prePath8 + 'documentlistbyschemeid?'

  //get Branches By User>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  public urlGetBranchesByUser = this.urlRequestType2 + this.urlIp6 + this.prepath10

  //get procedure dropdown>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 public  UrlDropdownGetProcedure=this.urlRequestType2+this.urlIp4+this.prePath8+'validationprocedure?'

 //get Branch User>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
public urlGetBranch=this.urlRequestType2+this.urlIp30+this.prepath10+'branchlistbyuser'

 //get Branch User>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 public urlSearchGet=this.urlRequestType2+this.urlIp30+this.prepath10+'getcustomer'

 //Security Type Get
 public UrlDropdownSecurityType=this.urlRequestType2+this.urlIp9+this.prePath5+'securitytype'
 //Glcode all get
 public UrlDropdownGetGlCode=this.urlRequestType2+this.urlIp9+this.prePath5+'glcode'

}
