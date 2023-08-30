import { ProductDetails } from "./shared.model"

export interface SchemeDetails {
  schemeId:number,
  name : "WELCOME",
  schemeCode : "1",
  description : "loan",
  productId : 1,
  startDate : "2020-12-12T00:00:00",
  endDate : "2022-12-12T00:00:00",
  minAge : 18,
  maxAge : 50,
  newCustomer : true,
  dormantCustomer : true,
  validateProcedure : "yes",
  limitDefId : 1,
  interestDefId : 1,
  chargeDefId : 1,
  activeLoansAllowed : 2,
  maxLoanAmount : 100000,
  branchMaxLoanAmount : 200000,
  branchActiveLoansAllowed : 2,
  fieldVerificationApplicability : true,
  fieldVerificationLimitAmt : true,
  prePayment : true,
  preClosure : true,
  rePaymentTypeId : 1,
  perGramRateId : 0,
  subHead : 1,
  accountNumber : 1212,
  topUpAllowed : true,
  takeOverLoansAllowed : true,
  channelId : 1,
  newBranch : true,
  status : 0,
  totalCount : 1,
  schemeType:''
  }


  export interface SchemeState {
    schemes : SchemeDetails[],
    products : ProductDetails[]
  }
