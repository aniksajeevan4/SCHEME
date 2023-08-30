import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SharedState } from "../../models/shared.model";

const getSharedState = createFeatureSelector<SharedState>('sharedstate');

export const getIsLoadingStatus = createSelector(getSharedState, (state)=>{
  return state.isLoading;
})

