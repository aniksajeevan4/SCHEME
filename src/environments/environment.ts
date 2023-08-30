
const url='http://192.168.12.134:8090/'


export const environment = {
  production: false,

getChargeCode:url+'fp/v1/chargecode',
getChargeDetailsById:url+'fp/v1/chargecodebychargedef?',
getchargeAt:url+'fp/v1/getchargeat',
getchargeOn:url+'fp/v1/getchargeon',
getChargeType:url+'fp/v1/getchargetype',
getChargeValueType:url+'fp/v1/getchargevaluetype',
getChargeTypeById:url+'fp/v1/chargetypebychargetypeid?'
};










/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
