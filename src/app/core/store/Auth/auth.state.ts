import { AuthModel } from "../../models/auth.model";
export const AUTH_STATE_NAME = 'authState';

export const initAuthState:AuthModel = {
  userId: 1,
  accessToken: '',
  refreshToken : '',
  branchName:'',
  currentBranchId:-1,
  currentBranchName:'',
  email: '',
  featurelist:[],
  homeBranchId:-1,
  levelId:-1,
  loginStatus:false,
  mobilePhone:0,
  name:'',
  userName:''
}



