import { createAction, props } from "@ngrx/store";
export const SHARED_STORE_NAME = 'shared';
export const SHOW_LOADER_ACTION = 'sharedState : showLoader';
export const SHOW_ERROR_ACTION = 'sharedState : showError';
export const showLoader = createAction(SHOW_LOADER_ACTION, props<{status:boolean}>());
export const showError = createAction(SHOW_ERROR_ACTION, props<{message:string|null}>());
