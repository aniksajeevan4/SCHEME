import { SchemeFormState } from "../../models/schemeform.model";

export const SCHEME_FORM_STATE_NAME = 'schemeformstate';
export const initSchemeFormState: SchemeFormState = {
  schemeFormView: [
    { id: 1, formName: 'Scheme Info', jsonName: 'schemeInfo', completed: false, editable: false, editMode: true, isOpen: false },
        { id: 2, formName: 'Scheme General Info', jsonName: 'generalInfo', completed: false, editable: false, editMode: false, isOpen: false },
        { id: 3, formName: 'Scheme Applicable To', jsonName: 'schemeApplicableTo', completed: false, editable: false, editMode: false, isOpen: false },
        { id: 4, formName: 'Scheme Interest Configuration', jsonName: 'schemeInterestConfiguration', completed: false, editable: false, editMode: false, isOpen: false },
        { id: 5, formName: 'Interest View', jsonName: 'schemeInterestDefinition', completed: false, editable: false, editMode: false, isOpen: false },
        { id: 6, formName: 'Scheme Charges', jsonName: 'schemeCharges', completed: false, editable: false, editMode: false, isOpen: false },
        { id: 7, formName: 'Additional details',jsonName: 'additionalDetails' , completed: false, editable: false, editMode: false, isOpen: false },

  ],
  schemeDetails: null,
  tranSchemDetails: null,
  fetchedSchemeDetails: null,
  tranNum: -1,
  schemeCode: '',
  fetchedProductId: 1,
  fetchedSchemeId: -1,
  schemeId: -1,
  editMode: false,
  isTran: false,
  viewOnly: false,
  PendingView:false,
  ProductType:'',
  CutomerAccount:false,
  editedData: null,
  SchemeInterestDefinition: undefined
}


