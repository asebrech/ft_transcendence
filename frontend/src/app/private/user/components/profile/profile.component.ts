import { Component, NgModule, OnInit } from '@angular/core';
import { UserI } from 'src/app/model/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { Math } from 'phaser';
import { PercentPipe } from '@angular/common';
import { UserService } from 'src/app/public/services/user-service/user.service';
import { PlayerService } from '../../services/player-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent {
  user : UserI;
  username : string;
  victories: number;
  defeats: number;
  ratio: number;

  constructor(private authService : AuthService, private userService: UserService, private playerService: PlayerService) { }

  ngOnInit() {
    this.user = this.userService.getUser(this.user.id);
    this.username = this.playerService.username;
    this.victories = this.playerService.victories;
    this.defeats = this.playerService.defeats;
    this.ratio = this.playerService.ratio;
   }
}
