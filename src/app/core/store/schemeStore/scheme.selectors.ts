import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SchemeState } from "../../models/scheme.model";

const getSchemeState = createFeatureSelector<SchemeState>('schemeState');

export const fetchSchemesDetails = createSelector(getSchemeState, (state)=>{
  return state.schemes;
})

export const fetchProductsDetails = createSelector(getSchemeState, (state)=>{
  console.log(state.products,'prod select')
  return state.products;
})
