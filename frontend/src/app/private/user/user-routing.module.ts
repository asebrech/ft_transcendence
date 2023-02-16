import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoogleAuthComponent } from './components/google-auth/google-auth.component';

const routes: Routes = [
	{
		path: 'google-auth',
		component: GoogleAuthComponent
	},
	{
		path: '**',
		redirectTo: 'user',
		pathMatch: 'full'
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
