import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { GoogleAuthComponent } from './components/google-auth/google-auth.component';
import { QRCodeModule } from 'angularx-qrcode';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    GoogleAuthComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
	QRCodeModule,
	FormsModule
  ]
})
export class UserModule { }
