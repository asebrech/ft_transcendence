import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserI } from 'src/app/model/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { UserService } from 'src/app/public/services/user-service/user.service';
import { PlayerService } from '../../services/player.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent {
  user$ : Observable<UserI>;
  username : string;
  wins: number;
  losses: number;
  ratio: number;
  timeplayed: number;
  winPercentage: number;
  lossPercentage: number;

  constructor(private authService : AuthService, private userService: UserService, private playerService: PlayerService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.user$ = this.playerService.getUser();
    this.winPercentage = (this.wins / (this.wins + this.losses)) * 100;
    this.lossPercentage = (this.losses / (this.wins + this.losses)) * 100;
   }

  addWin() {
    this.playerService.addWin(this.authService.getLoggedInUser().id).subscribe((updateUser: UserI) => {
      this.wins = updateUser.wins;
    });
   }

   addLosses() {
    this.playerService.addLosses(this.authService.getLoggedInUser().id).subscribe((updateUser: UserI) => {
      this.losses = updateUser.losses;
    });
  }
}
