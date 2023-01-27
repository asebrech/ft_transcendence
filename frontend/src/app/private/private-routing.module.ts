import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
	{
		path: 'game',
		canActivate: [AuthGuard],
		loadChildren: () => import('./game/game.module').then(m => m.GameModule)
	},
	{
		path: 'chat',
		canActivate: [AuthGuard],
		loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule)
	},
	{
		path: '**',
		redirectTo: 'chat',
		pathMatch: 'full'
	}
	
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
