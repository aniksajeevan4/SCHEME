
export class EnvVariable {

  //const
  public static pie = 3.14;
  public static languageList: any = require('../../Json/languages.json');
  public static stateLanguageList: any = require('../../Json/stateLanguage.json');
  public static contentDataArray = require('../../Json/dpnTemplate.json');

  //patterns
  public static patternOnlyNumbers = `^[0-9]*$`;
  public static patternNumberswithoutZero = `^[1-9]*$`;

  // public static patternOnlyDecimalNumbers = `^[1-9]\d*(\.\d+)?$`;
  public static patternOnlyNumbersnospace = `^[0-9]*$`;
  public static patternAlphaNumernospace = `^[A-Za-z0-9-]*$`
  public static patternDecimalPoints = /^[0-9]+(\.[0-9]*)?$/;
  public static patternDecimalPointNoZero = /^[1-9]+(\.[1-9]*)?$/;
  public static patternDecimalPoints2 = '^[0-9.][0-9.]*$';
  public static patternOnlyString = `^[a-zA-Z]*$`;
  public static patternStringAndNumber = `^[0-9a-zA-Z ]*$`;
  public static patternStringNumberAndSpecial = `^\[[a-zA-Z0-9@#$!^](?:\/?[a-zA-Z0-9@#$!^])*\]$`;
  public static patterncurrency = `^[0-9,]+$`;
  public static patternStringAndNumberAndSomeSpecial = '^(?!^ +$)[a-zA-Z0-9.@#&,/() -]+$'
  public static patternStringAndNumberAndHyphen='^([A-Za-z0-9-]+)'
  public static patternChargeCode = '^[a-zA-Z0-9!#()-=:|,./]+$'
  public static patternAadharNumber = '^[2-9]{1}[0-9]{11}$';
  public static patternDrivingLicence = '^[a-zA-Z0-9-/]*$';
  public static patternPanCard = '';
  public static patternVoterId = '^[a-zA-Z0-9/-]*';
  public static patternPassport = '^[A-PR-WY][1-9]\\d\\s?\\d{4}[1-9]$';
  public static patternBankIFSC = '^[A-Za-z]{4}[0][0-9A-Za-z]{6}$';
  public static patternAddress = '^[0-9a-zA-Z .,/\(\)\-]+$';
  public static patternMobileNumber = '^(?!0)[0-9]*$';
  public static patternLastName = `^[a-zA-Z. ]*$`;
  public static patternNames = `^[a-zA-Z ]*$`;
  public static patternWeight = '^(?!0\\.0*$)(?!0*$)\\d+(\\.\\d{1,2})?$';


  //min values
  public static minDropDown = 0;
  public static minSearchLength = 3;
  public static minAccountNumber = 99999999;
  public static minAccountIFSC = 8;
  public static minPhoneNumber = 999999999;
  public static minAmount = 0;
  public static minTerms = 1;
  public static minAge = 18;
  public static minNameCharacter = 2;
  public static minDescription = 0;
  public static minAddress = 2;
  public static minPincode = 99999;
  public static minGoldWeight = 0;

  //max values
  public static maxDropDown = 9999999999999999;
  public static maxSearchLength = 100;
  public static maxAccountNumber = 999999999999999999;
  public static maxAccountIFSC = 10;
  public static maxPhoneNumber = 9999999999;
  public static maxAmount = 9999999999999999;
  public static maxTerms = 367;
  public static maxAge = 101;
  public static maxNameCharacter = 50
  public static maxDescription = 1000;
  public static maxAddress = 100;
  public static maxPincode = 999999;
  public static ornamentCount = 21;


}
