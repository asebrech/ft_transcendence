import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameFrontComponent } from './components/game.front/game.front.component';
import { LiveComponent } from './components/live/live.component';
import { SettingsComponent } from './components/settings/settings.component';

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
		path: 'settings',
		component: SettingsComponent
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
