import { Component, OnInit } from '@angular/core';
import {
  Router,
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { CacheKey } from 'src/app/core/cache/cacheKey/cache-key';
import { CacheService } from 'src/app/core/cache/cacheService/cache.service';
import { CommonService } from 'src/app/core/env/common-services/common.service';
import { glInItState } from 'src/app/core/store/Auth/auth.action';
import { getAppStateData } from 'src/app/core/store/Auth/auth.selectors';
import { AppState } from 'src/app/core/store/app.state';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
})
export class BaseComponent implements OnInit {
  isLoading: boolean = false;
  private unsubscription: Subscription;
  public loadValues = false;
  constructor(
    private router: Router,
    private commonService: CommonService,
    private cacheService : CacheService,
    private appStore: Store<AppState>,
  ) {
    // Spinner for lazyload modules
    router.events.forEach((event) => {
      if (event instanceof RouteConfigLoadStart) {
        this.isLoading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.isLoading = false;
      }
    });
  }

  ngOnInit(): void {
    let queryString = window.location.search;
    if (queryString) {
    //   let decodedData = JSON.parse(
    //     decodeURIComponent(queryString.replace('?uid=', ''))
    //   );
    //   this.unsubscription = this.commonService
    //     .getFeature(decodedData)
    //     .subscribe((res) => {
    //       const userStateData = {
    //         userId: res.result.userId,
    //         accessToken: res.result.accessToken,
    //         refreshToken: res.result.refreshToken,
    //         branchName: res.result.branchName,
    //         currentBranchId: res.result.currentBranchId,
    //         currentBranchName: res.result.currentBranchName,
    //         email: res.result.email,
    //         featurelist: res.result.featurelist,
    //         homeBranchId: res.result.homeBranchId,
    //         levelId: res.result.levelId,
    //         loginStatus: res.result.loginStatus,
    //         mobilePhone: res.result.mobilePhone,
    //         name: res.result.name,
    //         userName: res.result.userName,
    //       };
    // this.cacheService.set(CacheKey.custDetails,userStateData,0);
    // this.cacheService.set(CacheKey.accessToken,userStateData.accessToken,0);
    // this.cacheService.set(CacheKey.refreshToken,userStateData.refreshToken,0);
    // this.cacheService.set(CacheKey.userId,userStateData.userId,0);


    //       this.appStore.dispatch(glInItState(userStateData));
    //       this.appStore.select(getAppStateData).subscribe((data) => {
    //         console.log(data, '1111111111111');
    //       });

    //       this.loadValues = true;
    //     });
    }
  }
}
