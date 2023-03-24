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
  user;
  username : string;
  victories: number;
  defeats: number;
  ratio: number;
  isCurrentUser: boolean;

  constructor(private authService : AuthService, private userService: UserService, private playerService: PlayerService, private route: ActivatedRoute) { }

  ngOnInit() {
    const username = this.route.snapshot.params['username'];
    if (username) {
      // Si le username est présent dans l'URL, récupérez les informations de l'utilisateur correspondant
      this.user = this.userService.findByUsername(username);
      this.isCurrentUser = false;
    } else {
      // Sinon, récupérez les informations de l'utilisateur connecté
      this.user = this.authService.getLoggedInUser();
      this.isCurrentUser = true;
    }
    this.victories = 17;
    this.defeats = 3;
    this.ratio = 0;
   }
}
