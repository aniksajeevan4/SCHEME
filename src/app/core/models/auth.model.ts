export interface AuthModel{
  userId: number,
  accessToken : string,
  refreshToken : string,
  branchName:string,
  currentBranchId:number,
  currentBranchName:string,
  email: string,
  featurelist:any,
  homeBranchId:number,
  levelId:number,
  loginStatus:boolean,
  mobilePhone:number,
  name:string,
  userName:string
}
