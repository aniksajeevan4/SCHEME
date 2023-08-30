import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { getProductDetails, getSchemeDetails, updateProductsDetails, updateSchemesDetails } from "./scheme.action";
import { catchError, exhaustMap, map, of } from "rxjs";
import { SchemeService } from "src/app/modules/scheme/services/scheme.service";
import { EnvFunction } from "../../env/function/env-function";
import { showError } from "../sharedStore/shared.action";
@Injectable()
export class SchemeEffect{
  constructor(
    private actions$:Actions,
    private envFn : EnvFunction,
    private schemeService:SchemeService
  ){}

  $schemeDetails$ = createEffect(() =>
  this.actions$.pipe(
    ofType(getSchemeDetails),
    exhaustMap(action =>
      this.schemeService.getSchemeDetails(action.productId,action.searchData, action.pageNo, action.pageSize).pipe(
        map((data:any) => {
          if(data.statusCode == 200) return updateSchemesDetails({schemes:data.result});
          return showError({message:"something went wront while fetching schemes"})
        }),
        catchError(error => {
          return of(showError({message:error.error}))
        })
      )
    ))
);

$productDetails$ = createEffect(() =>
this.actions$.pipe(
  ofType(getProductDetails),
  exhaustMap(action =>{
    return this.schemeService.getSchemeTypeList().pipe(
      map((data:any) => {
          if(data.statusCode == 200) return updateProductsDetails({products:data.result});
        return showError({message:"something went wront while fetching product details"})
      }),
      catchError(error => {
        return of(showError({message:error.error}))
      })
    )
    }))
);
}
