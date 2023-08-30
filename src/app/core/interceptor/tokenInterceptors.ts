import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, switchMap, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { Store } from "@ngrx/store";
import { CommonService } from "../env/common-services/common.service";
import { CacheService } from "../cache/cacheService/cache.service";
import { CacheKey } from "../cache/cacheKey/cache-key";
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private commonService: CommonService,  
    private cacheService : CacheService,
  ) {}
  accessToken: any;
  refreshToken: any;
  userId: any;

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
  
      this.accessToken = this.cacheService.get(CacheKey.accessToken)
      this.userId=this.cacheService.get(CacheKey.userId)
    
      console.log('123456789');

    const request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (req.headers.get("skipInterceptor")) {
      return next.handle(req);
    }

    return next.handle(request).pipe(
      catchError((error: any) => {
        if (
          error.status === 401 &&
          error.error &&
          error.error.Message === "2: Token Expired."
        ) {
            
          const body = new URLSearchParams();
          body.set("userId",this.userId);
          body.set("refreshToken", this.accessToken);
          return this.commonService.refreshToken(body).pipe(
            switchMap((res: any) => {
                this.cacheService.set(CacheKey.accessToken,res.result.accessToken,0);
                this.cacheService.set(CacheKey.refreshToken,res.result.refreshToken,0);
              const newRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${res.result.accessToken}`,
                },
              });
              return next.handle(newRequest);
            })
          );
        } else if (
          error.status === 401 &&
          error.error &&
          error.error.Message === "1: Invalid Token."
        ) {
          this.router.navigate(["/login"]);
        }

        return throwError(error);
      })
    );
  }
}
