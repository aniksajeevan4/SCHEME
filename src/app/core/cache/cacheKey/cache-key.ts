export class CacheKey {
  //Auth
  public static branchId = 'branchId';
  public static branchName = 'branchName';
  public static branchStateCode = 'branchStateCode';
  public static accessToken = 'accessToken';
  public static refreshToken = 'refreshToken';
  public static userId = 'userId';
  public static custDetails = 'custDetails';


  //GoldLoan-Account openning
  public static glFormActiveTabId = 'glFormActiveTabId';
  public static glFormSchemeId = 'glSchemeId';
  public static glFormCurrentGoldRate = 'glCurrentGoldRate';
  public static glFormCustomerId='glCustomerId';
  public static glAccountViewList = 'glAccountViewList'
  public static glAccountDetailsId = 'glAccountDetailsId';
  public static glAccountDetails = 'glAccountDetails';
  public static glTempAccountDetails = 'glTranAccountDetails';
  public static glTotalEligibleWeight='glTotalEligibleWeight';
  public static glSchemeLtvValue = 'glLtvValue';
  public static glSchemeTerm = 'glSchemeTerm';
  public static glSchemeDurationTypeId = 'glSchemeDurationTypeId';
  public static glSchemeDurationType = 'glSchemeDurationType';
  public static glRequestedAmount = 'glRequestedAmount';
  public static glAccountIsTran = 'glAccountIsTran';
  public static glAccountIsEditMode = 'glAccountIsEditMode';
  public static glAccountIsViewOnly = 'glAccountIsViewOnly';
  public static glTotalNetWeight='glTotalNetWeight';

  //OTP
  public static otpMobileNumber = 'otpMobileNumber';
  public static otpCount = 'otpCount';
  public static otpVerified = 'otpVerified';

  //File Upload
  public static fileUploadPath = 'fileUploadPath';
  public static fileUploadStatus = 'fileUploadStatus';

  //tran
  public static tranId = 'tranId';
  public static isTran = 'isTran';
  public static tranIsDisabled = 'tranIsDisabled';
  public static tranGenerated = 'tranGenerated';
  public static partialSavedDataDeleted = 'partialSavedDataDeleted';

  //list
  public static isViewOnly = 'isViewOnly';
  public static isEditMode = 'isEditMode';

}
