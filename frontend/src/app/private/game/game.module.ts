import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameFrontComponent } from './components/game.front/game.front.component';
import { PrivateModule } from '../private.module';
import { LiveComponent } from './components/live/live.component';
import { StarsBlowComponent } from './components/stars-blow/stars.blow/stars.blow.component';


@NgModule({
  declarations: [
	GameFrontComponent,
 LiveComponent,
 StarsBlowComponent
  ],
  imports: [
    CommonModule,
    GameRoutingModule,
	PrivateModule
  ]
})
export class GameModule { }
