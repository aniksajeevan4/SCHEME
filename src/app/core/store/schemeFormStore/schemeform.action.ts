import { UPDATE, createAction, props } from "@ngrx/store";
import { SchemeSaveDetails, TransactionData } from "../../models/schemeform.model";

export const UPDATE_FETCHED_PRODUCT_TYPE = 'schemeform : update : fetchedProductType';
export const UPDATE_FETCHED_PRODUCT_ID = 'schemeform : update : fetchedProductId';
export const UPDATE_FETCHED_SCHEME_ID = 'schemeform : update : fetchedSchemeId';
export const UPDATE_SCHEME_ID = 'schemeform : update : schemeId';
export const UPDATE_SCHEME_FORMS_EDIT_MODE = 'schemeform : update : editMode';
export const UPDATE_SCHEME_FORMS_SCHEME_NAME = 'schemeform : update : schemeName';
export const UPDATE_SCHEME_FORMS_IS_TRAN_MODE = 'schemeform : update : isTran';
export const UPDATE_SCHEME_FORM_COMPLETED_STATUS = 'schemeform : update : schemeFormView.completed';
export const UPDATE_SCHEME_FORM_ISOPEN_STATUS = 'schemeform : update : schemeFormView.isOpen';
export const UPDATE_SCHEME_FORM_EDITABLE_STATUS = 'schemeform : update : schemeFormView.editable';
export const UPDATE_SCHEME_FORM_EDITMODE_STATUS = 'schemeform : update : schemeFormView.editMode';
export const SWITCH_SCHEME_FORM_ISOPEN_EDITMODE_STATUS = 'schemeform : update : schemeFormView.isOpen and schemeFormView.editMode';
export const SWITCH_NEXT_SCHEME_FORM = 'schemeform : update : schemeFormView.isOpen and schemeFormView.editMode and schemeFormView.editable';
export const SAVE_SCHEME_FORM_DATA = 'schemeform : save or update : schemeDetails';
export const SAVE_TRAN_SCHEME_FORM_DATA = 'schemeform : save or update : tranSchemeDetails';
export const SAVE_FETCHED_SCHEME_FORM_DATA = 'schemeform : save or update : fetchedSchemeDetails';
export const RESET_SCHEME_FORM_STATE = 'schemeform : reset : all';
export const ENABLE_SCHEME_FORM_VIEW_ALL_EDIT = 'schemeform : update : all->schemeFormView->Editmode';
export const UPDATE_SCHEME_FORM_TRANNUM = 'schemeform : update : tranNum';
export const UPDATE_SCHEME_FORM_VIEWONLY = 'schemeform : update : viewOnly';
export const UPDATE_SCHEME_FORM_PENDINGVIEW = 'schemeform : update : PendingView';
export const UPDATE_SCHEME_FORM_CUSTOMERACCOUNT = 'schemeform : update : CutomerAccount';
export const UPDATE_TRAN_DETAILS = 'schemeform : update : transactionOnly';
export const UPDATE_COMPLETE = 'schemeform :  update : schemeFormView.complete';
export const DISABLE_OTHER_FORMS = 'schemeform :  update : schemeFormView.disable';
export const ENABLE_OTHER_FORMS = 'schemeform :  update : schemeFormView.enable';






export const updateFetchedProductType = createAction(UPDATE_FETCHED_PRODUCT_TYPE, props<{ ProductType: string }>());
export const updateFetchedProductId = createAction(UPDATE_FETCHED_PRODUCT_ID, props<{ productId: number }>());
export const updateFetchedSchemeId = createAction(UPDATE_FETCHED_SCHEME_ID, props<{ schemeId: number }>());
export const updateSchemeId = createAction(UPDATE_SCHEME_ID, props<{ schemeId: number }>());
export const updateSchemeFormsEditMode = createAction(UPDATE_SCHEME_FORMS_EDIT_MODE, props<{ status: boolean }>());
export const updateSchemeFormsisTranMode = createAction(UPDATE_SCHEME_FORMS_IS_TRAN_MODE, props<{ status: boolean }>());
export const updateSchemeFormCompletedStatus = createAction(UPDATE_SCHEME_FORM_COMPLETED_STATUS, props<{ formId: number, status: boolean }>());
export const updateSchemeFormIsOpenStatus = createAction(UPDATE_SCHEME_FORM_ISOPEN_STATUS, props<{ formId: number, status: boolean }>());
export const updateSchemeFormEditableStatus = createAction(UPDATE_SCHEME_FORM_EDITABLE_STATUS, props<{ formId: number, status: boolean }>());
export const updateSchemeFormEditModeStatus = createAction(UPDATE_SCHEME_FORM_EDITMODE_STATUS, props<{ formId: number, status: boolean }>());
export const updateSchemeFormSchemeName = createAction(UPDATE_SCHEME_FORMS_SCHEME_NAME, props<{ schemeCode: string }>());
export const switchSchemeFormIsOpenAndEditModeStatus = createAction(SWITCH_SCHEME_FORM_ISOPEN_EDITMODE_STATUS, props<{ formId: number, status: boolean }>());
export const switchToNextSchemeForm = createAction(SWITCH_NEXT_SCHEME_FORM, props<{ formId: number }>());
export const saveSchemeFormData = createAction(SAVE_SCHEME_FORM_DATA, props<{ schemejson: any }>());
export const saveTranSchemeFormData = createAction(SAVE_TRAN_SCHEME_FORM_DATA, props<{ schemejson: any }>());
export const saveFetchedSchemeFormData = createAction(SAVE_FETCHED_SCHEME_FORM_DATA, props<{ schemejson: any }>());
export const resetSchemeFormState = createAction(RESET_SCHEME_FORM_STATE);
export const enableAllEditSchemeFormViewState = createAction(ENABLE_SCHEME_FORM_VIEW_ALL_EDIT);
export const updateTranNumber = createAction(UPDATE_SCHEME_FORM_TRANNUM, props<{ tranNum: number }>());
export const updateSchemeFormViewOnly = createAction(UPDATE_SCHEME_FORM_VIEWONLY, props<{ viewOnly: boolean }>());
export const updateSchemeFormPendingView = createAction(UPDATE_SCHEME_FORM_PENDINGVIEW, props<{ PendingView: boolean }>());
export const updateSchemeFormCutomerAccount = createAction(UPDATE_SCHEME_FORM_CUSTOMERACCOUNT, props<{ CutomerAccount: boolean }>());
export const updateTransactionDetails = createAction(UPDATE_TRAN_DETAILS, props<{ editedData: any }>());
export const updateComplete = createAction(UPDATE_COMPLETE, props<{ formId: number, completed: boolean }>());
export const disableOtherForms = createAction(DISABLE_OTHER_FORMS, props<{ formId: number }>());
export const enableOtherForms = createAction(ENABLE_OTHER_FORMS, props<{ formId: number }>());

