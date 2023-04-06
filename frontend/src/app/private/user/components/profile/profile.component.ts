import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserI } from 'src/app/model/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { UserService } from 'src/app/public/services/user-service/user.service';
import { PlayerService } from '../../services/player.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent {
  user : UserI;
  username : string;
  wins: number;
  losses: number;
  ratio: number;
  timeplayed: number;
  circumference: number = 2 * Math.PI * 52;

  constructor(private authService : AuthService, private userService: UserService, private playerService: PlayerService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.user = this.playerService.user;
    this.username = this.user.username;
    this.timeplayed = this.user.timeplayed;
    this.wins = this.user.wins;
    this.losses = this.user.losses;
    this.ratio = (this.wins / (this.wins + this.losses));
   }

  addWin() {
    this.playerService.addWin(this.user.id).subscribe((updateUser: UserI) => {
      this.user = updateUser;
      this.wins = updateUser.wins;
      this.losses = updateUser.losses;
      this.ratio = (this.wins / (this.wins + this.losses));
    });
   }

   addLosses() {
    this.playerService.addLosses(this.user.id).subscribe((updateUser: UserI) => {
      this.user = updateUser;
      this.wins = updateUser.wins;
      this.losses = updateUser.losses;
      this.ratio = (this.wins / (this.wins + this.losses));
    });
  }
}
