import { createAction, props } from "@ngrx/store";
import {  AuthModel } from "../../models/auth.model";



export interface Action {
    type: string;
} 

export const glInItState = createAction(
    'glInItState',
    props<AuthModel>()
);

