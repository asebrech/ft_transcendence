import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { GoogleAuthComponent } from './components/google-auth/google-auth.component';
import { QRCodeModule } from 'angularx-qrcode';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from './components/profile/profile.component';
import { PrivateModule } from '../private.module';
import { FriendsComponent } from './components/friends/friends.component';
import { NgCircleProgressModule } from 'ng-circle-progress';




@NgModule({
  declarations: [
    GoogleAuthComponent,
    ProfileComponent,
    FriendsComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    NgCircleProgressModule.forRoot({
      radius: 100,
      space: -10,
      outerStrokeGradient: true,
      outerStrokeWidth: 10,
      outerStrokeColor: "#4882c2",
      outerStrokeGradientStopColor: "#53a9ff",
      innerStrokeColor: "#e7e8ea",
      innerStrokeWidth: 10,
      title: "ratio",
      animateTitle: true,
      animationDuration: 1000,
      showUnits: true,
      showBackground: true,
      clockwise: false,
      startFromZero: true,
      lazy: true,
      responsive: true
    }),
	QRCodeModule,
	FormsModule,
	PrivateModule
  ]
})
export class UserModule { }
