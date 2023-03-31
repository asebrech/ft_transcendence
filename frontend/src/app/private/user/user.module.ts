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
import { SettingsComponent } from './components/settings/settings.component';




@NgModule({
  declarations: [
    GoogleAuthComponent,
    ProfileComponent,
    FriendsComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    QRCodeModule,
    FormsModule,
    PrivateModule,
  ]
})
export class UserModule { }
