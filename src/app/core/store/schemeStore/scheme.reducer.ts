import { createReducer, on } from "@ngrx/store";
import { initSchemeState } from "./scheme.state";
import { updateProductsDetails, updateSchemesDetails } from "./scheme.action";

export const schemeReducer = createReducer(initSchemeState,
  on(updateSchemesDetails, (state,data)=>{
    return {
      ...state,
      schemes : data.schemes
    }
  }),
  on(updateProductsDetails, (state,data)=>{
    return {
      ...state,
      products : data.products
    }
  }))

