import { createAction, props } from '@ngrx/store';

export const addToMaster = createAction(
  'addToMaster',
  props<{ data: any }>() 
);

