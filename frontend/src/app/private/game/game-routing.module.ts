import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from '../user/components/settings/settings.component';
import { GameFrontComponent } from './components/game.front/game.front.component';
import { LiveComponent } from './components/live/live.component';
import { GameInviteComponent } from './components/game.invite/game.invite.component';
import { EndGamePageComponent } from './components/end-game-page/end-game-page.component';

const routes: Routes = [
	{ ////////////////////////////A SUPPRIMER APRES////////////////////////
		path: 'test',
		component: EndGamePageComponent
	},
	{ ////////////////////////////A SUPPRIMER APRES////////////////////////
		path: 'invite',
		component: GameInviteComponent
	},
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
