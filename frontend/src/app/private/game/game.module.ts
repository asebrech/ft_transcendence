import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameFrontComponent } from './components/game.front/game.front.component';
import { PrivateModule } from '../private.module';


@NgModule({
  declarations: [
	GameFrontComponent
  ],
  imports: [
    CommonModule,
    GameRoutingModule,
	PrivateModule
  ]
})
export class GameModule { }
