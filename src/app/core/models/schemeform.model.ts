export interface SchemeFormViewState {
  id: number,
  formName: string,
  jsonName: string,
  completed: boolean,
  editable: boolean,
  editMode: boolean,
  isOpen: boolean
}

export interface SchemeSaveDetails {
  fetchedSchemeId: number | null
  schemeId: number | null
  schemeDetails: string | null,
  schemeAdditionalDetails: string | null,
  schemeInterestDefinition: string | null,
  schemeIntrestDetails: string | null,
  schemeChargeDefenition: string | null,
  // schemeLimitDefenition : string | null
}

export interface SchemeFormState {
  SchemeInterestDefinition: any
  schemeFormView: SchemeFormViewState[],
  schemeDetails: SchemeSaveDetails | null,
  tranSchemDetails: SchemeSaveDetails | null,
  fetchedSchemeDetails: SchemeSaveDetails | null,
  tranNum: number,
  schemeCode: string,
  fetchedProductId: number,
  fetchedSchemeId: number,
  schemeId: number,
  editMode: boolean,
  isTran: boolean,
  viewOnly: boolean
  PendingView: boolean,
  ProductType:string,
  CutomerAccount:boolean,
  editedData: any
}

export interface TransactionData {
  branchId: number,
  customerName: string,
  displayChanges: boolean,
  editedData: any,
  orgData: any,
  reason: string,
  reviewUrl: string,
  tranNumber: number,
  updatedData: any,
}



