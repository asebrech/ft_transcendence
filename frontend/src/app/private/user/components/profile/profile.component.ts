import { Component, NgModule, OnInit } from '@angular/core';
import { UserI } from 'src/app/model/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { Math } from 'phaser';
import { PercentPipe } from '@angular/common';
import { UserService } from 'src/app/public/services/user-service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent {

  user = this.authService.getLoggedInUser();
  player : UserI;
  progress: number = 0;

  constructor(private authService : AuthService, private userService: UserService) { }

  ngOnInit() {
    this.player = this.userService.getUser(this.user.id);
    // vérifier si l'objet player existe et a la propriété playerstats
    if (this.player && this.player.playerstats) {
      this.player.playerstats.player_win = 10;
      this.player.playerstats.player_losse = 6;
      this.player.playerstats.total =
        this.player.playerstats.player_win +
        this.player.playerstats.player_losse;
      this.progress =
        (this.player.playerstats.player_win /
          this.player.playerstats.total) *
        100;
  console.log(this.progress);
   }
  }
}
