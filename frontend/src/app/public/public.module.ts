import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import {MatSnackBarModule} from '@angular/material/snack-bar'; 
import { ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field'; 
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input'; 
import {MatCardModule} from '@angular/material/card';
import { ApiLoginComponent } from './components/api-login/api-login.component';
import { GoogleAuthComponent } from './components/google-auth/google-auth.component'; 
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ApiLoginComponent,
    GoogleAuthComponent,
	HomeComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
	MatSnackBarModule,
	ReactiveFormsModule,
	MatFormFieldModule,
	MatInputModule,
	MatButtonModule,
	MatCardModule,
	FormsModule,
	QRCodeModule
  ]
})
export class PublicModule { }
