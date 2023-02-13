import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameFrontComponent } from './components/game.front/game.front.component';


@NgModule({
  declarations: [
	GameFrontComponent
  ],
  imports: [
    CommonModule,
    GameRoutingModule,
  ]
})
export class GameModule { }
