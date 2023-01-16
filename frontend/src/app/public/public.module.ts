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
import { HomeComponent } from './components/home/home.component'; 

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
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
	MatCardModule
  ]
})
export class PublicModule { }
