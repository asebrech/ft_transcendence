import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { GoogleAuthComponent } from './components/google-auth/google-auth.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuardReverse } from '../guards/auth.guard.reverse';


const routes: Routes = [
	{
		path: 'home',
		component: HomeComponent,
		canActivate : [AuthGuardReverse]
	},
	{
		path: 'register', 
		component : RegisterComponent,
		canActivate : [AuthGuardReverse]
	},
	{
		path: 'login',
		component: LoginComponent,
		canActivate : [AuthGuardReverse]
	},
	{
		path: 'google-auth',
		component: GoogleAuthComponent,
		canActivate : [AuthGuardReverse]
	},
	{
		path: '**',
		redirectTo: 'home',
		pathMatch: 'full'
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }

