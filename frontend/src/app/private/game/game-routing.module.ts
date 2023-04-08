import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from '../user/components/settings/settings.component';
import { GameFrontComponent } from './components/game.front/game.front.component';
import { LiveComponent } from './components/live/live.component';

const routes: Routes = [
	{
		path: 'spacepong',
		component: GameFrontComponent
	},
	{
		path: 'live',
		component: LiveComponent
	},
	{
		path: '**',
		redirectTo: 'spacepong',
		pathMatch: 'full'
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
