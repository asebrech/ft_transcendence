import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameFrontComponent } from './components/game.front/game.front.component';

const routes: Routes = [
	{
		path: 'spacepong',
		component: GameFrontComponent
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
