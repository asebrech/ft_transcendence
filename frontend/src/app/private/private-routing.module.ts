import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateRoomComponent } from './components/create-room/create-room.component';
import { GameFrontComponent } from './components/game.front/game.front.component';

const routes: Routes = [
	{
		path: 'SpacePong',
		component: GameFrontComponent
	},
	{
		path: 'dashboard',
		component: DashboardComponent
	},
	{
		path: 'create-room',
		component: CreateRoomComponent
	},
	{
		path: '**',
		redirectTo: 'dashboard',
		pathMatch: 'full'
	}
	
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
