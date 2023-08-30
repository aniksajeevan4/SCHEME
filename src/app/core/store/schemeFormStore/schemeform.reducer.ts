import { Action, ActionReducer, MetaReducer, createReducer, on } from "@ngrx/store";
import { initSchemeFormState } from "./schemeform.state";
import { resetSchemeFormState, saveFetchedSchemeFormData, saveTranSchemeFormData, saveSchemeFormData, switchSchemeFormIsOpenAndEditModeStatus, switchToNextSchemeForm, updateFetchedProductId, updateFetchedSchemeId, updateSchemeFormCompletedStatus, updateSchemeFormEditModeStatus, updateSchemeFormEditableStatus, updateSchemeFormIsOpenStatus, updateSchemeFormSchemeName, updateSchemeFormsEditMode, updateSchemeFormsisTranMode, updateSchemeId, enableAllEditSchemeFormViewState, updateTranNumber, updateSchemeFormViewOnly, updateComplete, disableOtherForms, enableOtherForms, updateTransactionDetails, updateSchemeFormPendingView, updateSchemeFormCutomerAccount, updateFetchedProductType } from "./schemeform.action";
import { SchemeFormViewState } from "../../models/schemeform.model";
import { localStorageSync } from "ngrx-store-localstorage";



export const schemeFormReducer = createReducer(initSchemeFormState,

  on(updateFetchedProductType, (state, data) => {
    return {
      ...state,
      ProductType: data.ProductType
    }
  }),
  on(updateFetchedProductId, (state, data) => {    
    return {
      ...state,
      fetchedProductId: data.productId
    }

  }),
  on(updateFetchedSchemeId, (state, data) => {
    return {
      ...state,
      fetchedSchemeId: data.schemeId
    }
  }),
  on(updateSchemeId, (state, data) => {
    return {
      ...state,
      schemeId: data.schemeId
    }
  }),
  on(updateSchemeFormsEditMode, (state, data) => {
    return {
      ...state,
      editMode: data.status
    }
  }),
  on(updateSchemeFormsisTranMode, (state, data) => {
    return {
      ...state,
      isTran: data.status
    }
  }),
  on(updateSchemeFormCompletedStatus, (state: any, data) => {
    const updateFormView = state.schemeFormView?.map((tab: SchemeFormViewState) => {
    return tab.id === data.formId ? { ...tab, completed: data.status } : tab;
    });
    return { ...state, schemeFormView: updateFormView };
  }),
  on(updateSchemeFormIsOpenStatus, (state: any, data) => {
    const updateFormView = state.schemeFormView?.map((tab: SchemeFormViewState) => {
      return tab.id === data.formId ? { ...tab, isOpen: data.status } : tab;
    });
    return { ...state, schemeFormView: updateFormView };
  }),
  on(updateSchemeFormEditableStatus, (state: any, data) => {
    const updateFormView = state.schemeFormView?.map((tab: SchemeFormViewState) => {
      return tab.id === data.formId ? { ...tab, editable: data.status } : tab;
    });
    return { ...state, schemeFormView: updateFormView };
  }),
  on(updateSchemeFormEditModeStatus, (state: any, data) => {
    const updateFormView = state.schemeFormView?.map((tab: SchemeFormViewState) => {
      return tab.id === data.formId ? { ...tab, editMode: data.status } : tab;
    });
    return { ...state, schemeFormView: updateFormView };
  }),
  on(updateSchemeFormSchemeName, (state: any, data) => {

    return { ...state, schemeCode: data.schemeCode };
  }),
  on(enableAllEditSchemeFormViewState, (state: any) => {
    const updateFormView = state.schemeFormView?.map((tab: SchemeFormViewState) => {
      return { ...tab, isOpen: false, editMode: true, editable: true, completed: true };
    });
    return { ...state, schemeFormView: updateFormView };
  }),
  on(switchSchemeFormIsOpenAndEditModeStatus, (state: any, data) => {
    const updateFormView = state.schemeFormView?.map((tab: SchemeFormViewState) => {
      return tab.id === data.formId ? { ...tab, isOpen: data.status, editMode: data.status } : tab;
    });
    return { ...state, schemeFormView: updateFormView };
  }),
  on(switchToNextSchemeForm, (state: any, data) => {
    console.log('test')
    let updateFormView = state.schemeFormView?.map((tab: SchemeFormViewState) => {
      if (tab.id === data.formId + 1) {
        return { ...tab, isOpen: true, editMode: true, editable: true }
      }
      else return { ...tab, isOpen: false, editMode: false };
    });
    return { ...state, schemeFormView: updateFormView };
  }),
  on(saveSchemeFormData, (state: any, data) => {
    return { ...state, schemeDetails: data.schemejson, tranSchemDetails: data.schemejson };
  }),
  on(saveTranSchemeFormData, (state: any, data) => {
    return { ...state, tranSchemDetails: data.schemejson };
  }),
  on(saveFetchedSchemeFormData, (state: any, data) => {
    return { ...state, fetchedSchemeDetails: data.schemejson };
  }),
  on(updateTransactionDetails, (state, action) => {
    return {
      ...state,
      editedData: action.editedData,

    };
  }),
  on(resetSchemeFormState, (state) => {
    return {
      ...state,
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
      fetchedSchemeDetails: null,
      tranNum: -1,
      schemeName: '',
      fetchedProductId: 1,
      fetchedSchemeId: -1,
      schemeId: -1,
      editMode: false,
      isTran: false
    };
  }),
  on(updateTranNumber, (state, data) => {
    return {
      ...state,
      tranNum: data.tranNum
    }
  }),
  on(updateSchemeFormViewOnly, (state, data) => {
    return {
      ...state,
      viewOnly: data.viewOnly
    }
  }),
  on(updateSchemeFormPendingView, (state, data) => {
    return {
      ...state,
      PendingView: data.PendingView
    }
  }),

  on(updateSchemeFormCutomerAccount, (state, data) => {
    return {
      ...state,
      CutomerAccount: data.CutomerAccount
    }
  }),
  on(disableOtherForms, (state: any, data) => {
    const updatedSchemeFormView = state.schemeFormView.map((tab: SchemeFormViewState) => {
      if (tab.id === data.formId) {
        return { ...tab, completed: false };
      }
      return { ...tab, editable: false, isOpen: false }; // Create a new object with editable set to false for all other objects
    });

    return {
      ...state,
      schemeFormView: updatedSchemeFormView,
    };
  }),
  on(enableOtherForms, (state: any, data) => {
    const updatedSchemeFormView = state.schemeFormView.map((tab: SchemeFormViewState) => {
      if (tab.id === data.formId) {
        return { ...tab, completed: true };
      }
      return { ...tab, editable: true }; // Create a new object with editable set to false for all other objects
    });

    return {
      ...state,
      schemeFormView: updatedSchemeFormView,
    };
  })
)


export const localStorageKeySchemeForm = 'appState2';
const encryptionKey = 'my-secret-key-hbsdhbsjkdakgdjabfajfukgekfbuy3t27t323yg23dgsvdgfsdghvfhjYUVGVT@%^TvgghvGVYUG7g7dsd';

function encrypt(value: string): string {
  const encrypedText = CryptoJS.AES.encrypt(value, encryptionKey);
  return encrypedText.toString();
}

function decrypt(value: string): string {
  const decrypedText = CryptoJS.AES.decrypt(value, encryptionKey);
  return decrypedText.toString(CryptoJS.enc.Utf8);
}

const myStorage: Storage = {
  getItem: (key: string) => {
    const value = localStorage.getItem(key);
    if (value) {
      return decrypt(value);
    }
    return null;
  },
  setItem: (key: string, value: string) => {
    localStorage.setItem(key, encrypt(value));
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
  length: localStorage.length,
  clear: () => {
    localStorage.clear();
  },
  key: (index: number) => {
    return localStorage.key(index);
  }
};


// export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
//   return localStorageSync({
//     keys: [localStorageKey],
//     rehydrate: true,
//     storage: myStorage
//   })(reducer);
// }


export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({keys: [localStorageKeySchemeForm],rehydrate: true})(reducer);
}
export const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];


