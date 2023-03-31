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
  isCurrentUser: boolean;

  constructor(private authService : AuthService, private userService: UserService, private playerService: PlayerService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.user = this.playerService.user;
    this.username = this.user.username;
    // const username = this.route.snapshot.params['username'];
    // if (username) {
    //   // Si le username est présent dans l'URL, récupérez les informations de l'utilisateur correspondant
    //   this.user = this.userService.findByUsername(username);
    //   this.isCurrentUser = false;
    // } else {
    //   // Sinon, récupérez les informations de l'utilisateur connecté
    //   this.user = this.authService.getLoggedInUser();
    //   this.isCurrentUser = true;
    // }
    this.wins = this.user.wins
    this.losses = this.user.losses;
    this.ratio = this.user.ratio;
    this.timeplayed = this.user.timeplayed;
   }

  addWin() {
    this.playerService.addWin(this.user.id).subscribe((updateUser: UserI) => {
      this.user = updateUser;
      this.wins = updateUser.wins;

    });

    console.table(this.user);
    console.log(this.timeplayed);
   }
}

