import { Action, createReducer, on } from "@ngrx/store"
import { glInItState } from "./auth.action"
import { initAuthState } from "./auth.state"
import { AuthModel } from "../../models/auth.model"

const _authStateReducer = createReducer<AuthModel>(initAuthState,
  on(glInItState, (state, action) => {
    return {
      ...state,
      userId: action.userId,
      accessToken: action.accessToken,
      refreshToken: action.refreshToken,
      branchName: action.branchName,
      currentBranchId: action.currentBranchId,
      currentBranchName: action.currentBranchName,
      email: action.email,
      featurelist: action.featurelist,
      homeBranchId: action.homeBranchId,
      levelId: action.levelId,
      loginStatus: action.loginStatus,
      mobilePhone: action.mobilePhone,
      name: action.name,
      userName: action.userName,
    };
  })
);

export function authStateReducer(state: AuthModel | undefined, action: Action):AuthModel {
    return _authStateReducer(state, action);
  }


  