import { Component, OnInit } from '@angular/core';
import { StarsService } from 'src/app/services/stars-service/stars.service';

@Component({
  selector: 'app-game.invite',
  templateUrl: './game.invite.component.html',
  styleUrls: ['./game.invite.component.scss']
})
export class GameInviteComponent implements OnInit {

  constructor(private starsService: StarsService) { }

  ngOnInit(): void 
  {
    this.starsService.setActive(false);
  }

}
