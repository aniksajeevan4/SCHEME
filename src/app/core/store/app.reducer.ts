import { Action, ActionReducer, MetaReducer } from "@ngrx/store";
import { authStateReducer } from "./Auth/auth.reducer";
import { AUTH_STATE_NAME } from "./Auth/auth.state";
import { AppState } from "./app.state";
import { schemeFormReducer } from "./schemeFormStore/schemeform.reducer";
import { SCHEME_FORM_STATE_NAME } from "./schemeFormStore/schemeform.state";
import { sharedReducer } from "./sharedStore/shared.reducer";
import { SHARED_STATE_NAME } from "./sharedStore/shared.state";
import { localStorageSync } from 'ngrx-store-localstorage';
import * as CryptoJS from 'crypto-js';

export const appReducer = {
  [SHARED_STATE_NAME] : sharedReducer,
  [AUTH_STATE_NAME]:authStateReducer
}

export const localStorageKey = 'appState';
const encryptionKey = 'my-secret-key-hbsdhbsjkdakgdjabfajfukgekfbuy3t27t323yg23dgsvdgfsdghvfhjYUVGVT@%^TvgghvGVYUG7g7dsd';

function encrypt(value: string): string {
  const encrypedText = CryptoJS.AES.encrypt(value, encryptionKey);
  return encrypedText.toString();
}

function decrypt(value: string): string {
  const decrypedText = CryptoJS.AES.decrypt(value, encryptionKey);
  return decrypedText.toString(CryptoJS.enc.Utf8);
}

const myStorage: Storage = {
  getItem: (key: string) => {
    const value = localStorage.getItem(key);
    if (value) {
      return decrypt(value);
    }
    return null;
  },
  setItem: (key: string, value: string) => {
    localStorage.setItem(key, encrypt(value));
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
  length: localStorage.length,
  clear: () => {
    localStorage.clear();
  },
  key: (index: number) => {
    return localStorage.key(index);
  }
};


// export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
//   return localStorageSync({
//     keys: [localStorageKey],
//     rehydrate: true,
//     storage: myStorage
//   })(reducer);
// }


export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({keys: [localStorageKey],rehydrate: true})(reducer);
}
export const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

