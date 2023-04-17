import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatSnackBarModule} from '@angular/material/snack-bar';
import { JwtModule } from '@auth0/angular-jwt';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { StarsComponent } from './components/stars/stars.component';
import { StarsInteractiveComponent } from './components/stars-interactive/stars-interactive.component';
import { CookieService } from 'ngx-cookie-service';

export function tokenGetter() {
	return localStorage.getItem("access_token");
  }

@NgModule({
  declarations: [
    AppComponent,
    StarsComponent,
    StarsInteractiveComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:3000"]
      }
	    }),
    ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
