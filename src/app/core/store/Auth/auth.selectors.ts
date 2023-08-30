import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthModel } from "../../models/auth.model";


const getAppState = createFeatureSelector<AuthModel>('authState');

export const getAppStateData = createSelector(getAppState, (state) => {
    return state;
});

export const getUserId = createSelector(getAppState, (state) => {
    return state.userId;
});