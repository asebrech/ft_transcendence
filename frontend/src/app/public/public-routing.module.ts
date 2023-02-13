import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { GoogleAuthComponent } from './components/google-auth/google-auth.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
	{
		path: 'home',
		component: HomeComponent
	},
	{
		path: 'register', 
		component : RegisterComponent
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'google-auth',
		component: GoogleAuthComponent
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

