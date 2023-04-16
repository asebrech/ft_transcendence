import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FriendsComponent } from './components/friends/friends.component';
import { GoogleAuthComponent } from './components/google-auth/google-auth.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
	{
		path: 'profile',
		component: ProfileComponent,
	},
	{
		path: 'profile/:id',
		component: ProfileComponent,
	},
	{
		path: 'friends',
		component: FriendsComponent
	},
	{
		path: 'google-auth',
		component: GoogleAuthComponent
	},
	{
		path: 'settings',
		component: SettingsComponent
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
