import { createReducer, on } from "@ngrx/store";
import { initSharedState } from "./shared.state";
import { showError, showLoader } from "./shared.action";

export const sharedReducer = createReducer(initSharedState,
  on(showLoader, (state,data)=>{return {...state, isLoading : data.status}}),
  on(showError, (state,data)=>{return {...state, errorMessage : data.message}}),
)
