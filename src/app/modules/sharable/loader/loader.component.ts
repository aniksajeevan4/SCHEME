import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/core/store/app.state';
import { getIsLoadingStatus } from 'src/app/core/store/sharedStore/shared.selectors';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  public isLoading$:Observable<boolean>;
  constructor(
    private appStore : Store<AppState>
  ) { }

  ngOnInit(): void {
    this.subscribeLoader();
  }

  private subscribeLoader(){
    this.isLoading$ = this.appStore.select(getIsLoadingStatus);
  }


}
