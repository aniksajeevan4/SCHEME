import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { appReducer } from './core/store/app.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EnvFunction } from './core/env/function/env-function';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { EnvUrl } from './core/env/url/env-url';
import { SharableModule } from './modules/sharable/sharable.module';
import { TokenInterceptor } from './core/interceptor/tokenInterceptors';
import { CustomerInformationModule } from './modules/customer-information/customer-information.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
  BrowserModule,
    EffectsModule.forRoot([]),
    StoreModule.forRoot(appReducer),
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    SharableModule,
    HttpClientModule,
    CustomerInformationModule,
    // StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ],
  providers: [
    EnvUrl,
    EnvFunction,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true
      },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
