import { AuthModel } from "../models/auth.model";
import { SchemeFormState } from "../models/schemeform.model";
import { SharedState } from "../models/shared.model";
import { AUTH_STATE_NAME } from "./Auth/auth.state";
import { SCHEME_FORM_STATE_NAME } from "./schemeFormStore/schemeform.state";
import { SHARED_STATE_NAME } from "./sharedStore/shared.state";

export interface AppState {
  [SHARED_STATE_NAME] : SharedState,
  [AUTH_STATE_NAME]:AuthModel
}
