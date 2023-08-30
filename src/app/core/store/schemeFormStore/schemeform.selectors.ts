import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  SchemeFormState,
  TransactionData,
} from '../../models/schemeform.model';
const getSchemeFormState =
  createFeatureSelector<SchemeFormState>('schemeformstate');



export const editedData = createSelector(
  getSchemeFormState,
  (state) => {
    return state.editedData
  }
);
// export const transactionData=createSelector(getTransactionData,(state)=>{
//  return state
// })
export const fetchSchemeFormState = createSelector(
  getSchemeFormState,
  (state) => {
    return state;
  }
);
export const fetchSchemeFormStateOnContainer = createSelector(
  getSchemeFormState,
  (state) => {
    return {
      isTran: state.isTran,
      editMode: state.editMode,
      schemeId: state.schemeId,
      fetchedSchemeId: state.fetchedSchemeId,
      fetchedProductId: state.fetchedProductId,
      tranSchemDetails: state.tranSchemDetails,
      tranNum: state.tranNum,
      viewOnly: state.viewOnly,
      PendingView:state.PendingView,
      CutomerAccount: state.CutomerAccount,
      ProductType:state.ProductType,

    };
  }
);

export const fetchSchemeFormView_SchemeInfo = createSelector(
  getSchemeFormState,
  (state) => {
    return state.schemeFormView.find((row) => row.id === 1);
  }
);

export const fetchSchemeFormView_GeneralInfo = createSelector(
  getSchemeFormState,
  (state) => {
    return state.schemeFormView.find((row) => row.id === 2);
  }
);

export const fetchSchemeFormView_ApplicableTo = createSelector(
  getSchemeFormState,
  (state) => {
    return state.schemeFormView.find((row) => row.id === 3);
  }
);

export const fetchSchemeFormView_InterestConfig = createSelector(
  getSchemeFormState,
  (state) => {
    return state.schemeFormView.find((row) => row.id === 4);
  }
);


export const fetchSchemeFormView_InterestDefinition = createSelector(
  getSchemeFormState,
  (state) => {
    return state.schemeFormView.find((row) => row.id === 5);
  }
);

export const fetchSchemeFormView_schemeCharges = createSelector(
  getSchemeFormState,
  (state) => {
    return state.schemeFormView.find((row) => row.id === 6);
  }
);

export const fetchSchemeFormView_AddDetails = createSelector(
  getSchemeFormState,
  (state) => {
    return state.schemeFormView.find((row) => row.id === 7);
  }
);

export const fetchSchemeFormViewState = createSelector(
  getSchemeFormState,
  (state) => {
    return state.schemeFormView;
  }
);

export const fetchedProductIdState = createSelector(
  getSchemeFormState,
  (state) => {
    return state.fetchedProductId
  }
);

export const getSchemeFormTranIdState = createSelector(
  getSchemeFormState,
  (state) => {
    return state.tranNum;
  }
);

export const getSchemeFormOnSaveData = createSelector(
  getSchemeFormState,
  (state) => {
    return {
      editMode: state.editMode,
      schemeId: state.schemeId,
      schemeCode: state.schemeCode,
      schemeDetails: state.schemeDetails,
      tranNum: state.tranNum,
      fetchId: state.fetchedSchemeId,
      ProductType:state.ProductType,
      fetchedProductId:state.fetchedProductId
    };
  }
);
export const getSchemeFormOnSaveDatas = createSelector(
  getSchemeFormState,
  (state) => {
    return {
      editMode: state.editMode,
    };
  }
);
//fetch schemeDetails and liveData
export const fetchSchemeLiveDetails = createSelector(
  getSchemeFormState,
  (state) => {
    return {
      schemeDetails: state ? state.schemeDetails : null,
      TranSchemeDetails: state ? state.tranSchemDetails : null,
    };
  }
);
// return {
//   schemeDetails : jsonSchemeData2 ? jsonSchemeData2.schemeDetails : null,
//   fetchSchemeDetails : jsonSchemeData1 ? jsonSchemeData1.schemeDetails : null,
//   isTran : state.isTran
// };

//fetch scheme details
export const fetchFetchedSchemeForm_Details = createSelector(
  getSchemeFormState,
  (state) => {
    const jsonSchemeData = JSON.parse(String(state.fetchedSchemeDetails));
    return jsonSchemeData ? jsonSchemeData.schemeDetails : null;
  }
);

//fetch scheme additional details
export const fetchFetchedSchemeForm_Additional = createSelector(
  getSchemeFormState,
  (state) => {
    const jsonSchemeData = JSON.parse(String(state.fetchedSchemeDetails));
    return jsonSchemeData ? jsonSchemeData.additionalDetails : null;
  }
);

//fetch scheme intrest details
export const fetchFetchedSchemeForm_intrest_Config = createSelector(
  getSchemeFormState,
  (state) => {
    const jsonSchemeData = JSON.parse(String(state.fetchedSchemeDetails));
    return jsonSchemeData ? jsonSchemeData.schemeInterestConfiguration : null;
  }
);

//fetch scheme intrest details
export const fetchFetchedSchemeForm_intrest_View = createSelector(
  getSchemeFormState,
  (state) => {
    const jsonSchemeData = JSON.parse(String(state.fetchedSchemeDetails));
    return jsonSchemeData ? jsonSchemeData.schemeInterestDefinition : null;
  }
);

//fetch scheme charge details
export const fetchFetchedSchemeForm_Charge = createSelector(
  getSchemeFormState,
  (state) => {
    const jsonSchemeData = JSON.parse(String(state.fetchedSchemeDetails));
    return jsonSchemeData ? jsonSchemeData.schemeCharges : null;
  }
);

//fetch scheme Limit details
export const fetchFetchedSchemeForm_ = createSelector(
  getSchemeFormState,
  (state) => {
    const jsonSchemeData = JSON.parse(String(state.fetchedSchemeDetails));
    return jsonSchemeData ? jsonSchemeData.schemeLimitDefenition : null;
  }
);
//  Scheme Info
export const fetchSchemeForm_SchemeInfo = createSelector(
  getSchemeFormState,
  (state) => {
    const jsonSchemeData = JSON.parse(String(state.fetchedSchemeDetails));
    return jsonSchemeData ? jsonSchemeData.schemeInfo : null;
  }
);
// scheme details
export const fetchSchemeForm_Details = createSelector(
  getSchemeFormState,
  (state) => {
    const jsonSchemeData = JSON.parse(String(state.fetchedSchemeDetails));
    return jsonSchemeData ? jsonSchemeData.schemeDetails : null;
  }
);

// scheme Applicable To
export const fetchSchemeForm_ApplicableTo = createSelector(
  getSchemeFormState,
  (state) => {
    const jsonSchemeData = JSON.parse(String(state.fetchedSchemeDetails));
    return jsonSchemeData ?jsonSchemeData.schemeApplicableTo : null;
  }
);

// scheme intrest details
export const fetchSchemeForm_intrest_Config = createSelector(
  getSchemeFormState,
  (state) => {
    const jsonSchemeData = JSON.parse(String(state.fetchedSchemeDetails));
    return jsonSchemeData ? jsonSchemeData.schemeInterestConfiguration : null;
  }
);

// scheme intrest details
export const fetchSchemeForm_intrest_View = createSelector(
  getSchemeFormState,
  (state) => {
    const jsonSchemeData = JSON.parse(String(state.fetchedSchemeDetails));
    return jsonSchemeData ? jsonSchemeData.schemeInterestDefinition : null;
  }
);

// scheme charge details
export const fetchSchemeForm_Charge = createSelector(
  getSchemeFormState,
  (state) => {
    const jsonSchemeData = JSON.parse(String(state.fetchedSchemeDetails));
    return jsonSchemeData ? jsonSchemeData.schemeCharges : null;
  }
);

// scheme Additional Details
export const fetchSchemeForm_AdditionalDetails = createSelector(
  getSchemeFormState,
  (state) => {
    const jsonSchemeData = JSON.parse(String(state.fetchedSchemeDetails));
    return jsonSchemeData ? jsonSchemeData.additionalDetails : null;
  }
);

//updated single selector--------------------------------------------------------------------
//fetch Scheme info
export const fetchSchemeFormState_SchemeInfo = createSelector(
  getSchemeFormState,
  (state) => {
    const jsonSchemeData1 = JSON.parse(String(state.fetchedSchemeDetails));
    const jsonSchemeData2 = JSON.parse(String(state.schemeDetails)); 
       
    return {
      schemeDetails: jsonSchemeData2 ? jsonSchemeData2.schemeInfo : null,
      fetchSchemeDetails: jsonSchemeData1
        ? jsonSchemeData1.schemeInfo
        : null,
      isTran: state.isTran,
      viewOnly: state.viewOnly,
      ProductType:state.ProductType,
      fetchedProductId:state.fetchedProductId,
      editMode: state.editMode,
    };
  }
);
//fetch general info
export const fetchSchemeFormState_generalInfo = createSelector(
  getSchemeFormState,
  (state) => {
    const jsonSchemeData1 = JSON.parse(String(state.fetchedSchemeDetails));
    const jsonSchemeData2 = JSON.parse(String(state.schemeDetails));    
    return {
      schemeDetails: jsonSchemeData2 ? jsonSchemeData2.generalInfo : null,
      fetchSchemeDetails: jsonSchemeData1
        ? jsonSchemeData1.generalInfo
        : null,
      isTran: state.isTran,
      viewOnly: state.viewOnly,
      ProductType:state.ProductType,
      fetchedProductId:state.fetchedProductId


    };
  }
);

//fetch scheme additional details
export const fetchFetchedSchemeFormState_ApplicableTo = createSelector(
  getSchemeFormState,
  (state) => {
    const jsonSchemeData1 = JSON.parse(String(state.fetchedSchemeDetails));
    const jsonSchemeData2 = JSON.parse(String(state.schemeDetails));
    return {
      schemeDetails: jsonSchemeData2 ? jsonSchemeData2.schemeApplicableTo : null,
      fetchSchemeDetails: jsonSchemeData1
        ? jsonSchemeData1.schemeApplicableTo
        : null,
      isTran: state.isTran,
      viewOnly: state.viewOnly,
      ProductType:state.ProductType,
      fetchedProductId:state.fetchedProductId


    };
  }
);

//fetch scheme intrest details
export const fetchFetchedSchemeFormState_intrest_Config = createSelector(
  getSchemeFormState,
  (state) => {
    const jsonSchemeData1 = JSON.parse(String(state.fetchedSchemeDetails));
    const jsonSchemeData2 = JSON.parse(String(state.schemeDetails));
    return {
      schemeDetails: jsonSchemeData2
        ? jsonSchemeData2.schemeInterestConfiguration
        : null,
      fetchSchemeDetails: jsonSchemeData1
        ? jsonSchemeData1.schemeInterestConfiguration
        : null,
      isTran: state.isTran,
      viewOnly: state.viewOnly,
      ProductType:state.ProductType,
      fetchedProductId:state.fetchedProductId


    };
  }
);

//fetch scheme intrest details
export const fetchFetchedSchemeFormState_intrest_View = createSelector(
  getSchemeFormState,
  (state) => {
    const jsonSchemeData1 = JSON.parse(String(state.fetchedSchemeDetails));
    const jsonSchemeData2 = JSON.parse(String(state.schemeDetails));
    return {
      schemeDetails: jsonSchemeData2
        ? jsonSchemeData2.schemeInterestDefinition
        : null,
      fetchSchemeDetails: jsonSchemeData1
        ? jsonSchemeData1.schemeInterestDefinition
        : null,
      isTran: state.isTran,
      viewOnly: state.viewOnly,
      ProductType:state.ProductType,
      fetchedProductId:state.fetchedProductId


    };
  }
);


//fetch scheme charge details
export const fetchFetchedSchemeFormState_Charge = createSelector(
  getSchemeFormState,
  (state) => {
    const jsonSchemeData1 = JSON.parse(String(state.fetchedSchemeDetails));
    const jsonSchemeData2 = JSON.parse(String(state.schemeDetails));
    return {
      schemeDetails: jsonSchemeData2 ? jsonSchemeData2.schemeCharges : null,
      fetchSchemeDetails: jsonSchemeData1
        ? jsonSchemeData1.schemeCharges
        : null,
      isTran: state.isTran,
      viewOnly: state.viewOnly,
      ProductType:state.ProductType,
      fetchedProductId:state.fetchedProductId


    };
  }
);

//fetch scheme Additional details 
export const fetchFetchedSchemeFormState_AdditionalDetails = createSelector(
  getSchemeFormState,
  (state) => {
    const jsonSchemeData1 = JSON.parse(String(state.fetchedSchemeDetails));
    const jsonSchemeData2 = JSON.parse(String(state.schemeDetails));
    return {
      schemeDetails: jsonSchemeData2
        ? jsonSchemeData2.additionalDetails
        : null,
      fetchSchemeDetails: jsonSchemeData1
        ? jsonSchemeData1.additionalDetails
        : null,
      isTran: state.isTran,
      viewOnly: state.viewOnly,
      ProductType:state.ProductType,
      fetchedProductId:state.fetchedProductId

    };
  }
);
//fetch scheme Limit details
export const fetchFetchedSchemeFormState_limit_View = createSelector(
  getSchemeFormState,
  (state) => {
    const jsonSchemeData1 = JSON.parse(String(state.fetchedSchemeDetails));
    const jsonSchemeData2 = JSON.parse(String(state.schemeDetails));
    return {
      schemeDetails: jsonSchemeData2
        ? jsonSchemeData2.schemeLimitDefenition
        : null,
      fetchSchemeDetails: jsonSchemeData1
        ? jsonSchemeData1.schemeLimitDefenition
        : null,
      isTran: state.isTran,
      viewOnly: state.viewOnly,
      ProductType:state.ProductType,
      fetchedProductId:state.fetchedProductId

    };
  }
);
