import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoogleAuthComponent } from './components/google-auth/google-auth.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
	{
		path: 'profile',
		component: ProfileComponent
	},
	{
		path: 'friends',
		component: ProfileComponent
	},
	{
		path: 'google-auth',
		component: ProfileComponent
	},
	{
		path: '**',
		redirectTo: 'profile',
		pathMatch: 'full'
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
