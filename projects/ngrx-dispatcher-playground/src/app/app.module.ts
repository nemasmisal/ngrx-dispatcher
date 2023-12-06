import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';

import { UserEffects } from './+store/effects';
import { userReducer } from './+store/reducer';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { UserDetailsComponent } from './user-details/user-details.component';

import { NgrxDispatcherModule } from 'ngrx-dispatcher';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    UserDetailsComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot({ user: userReducer, router: routerReducer }),
    EffectsModule.forRoot([UserEffects]),
    StoreDevtoolsModule.instrument({connectInZone: true}),
    RouterModule.forRoot([]),
    StoreRouterConnectingModule.forRoot(),
    NgrxDispatcherModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
