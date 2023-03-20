import { Injectable } from '@angular/core';
import { UserI } from 'src/app/model/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { UserService } from 'src/app/public/services/user-service/user.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  user : UserI = this.authService.getLoggedInUser();
  username: string;
  victories: number;
  defeats: number;
  ratio: number;
  playtime: number;
  friends: string[] = [];

  constructor(private userService: UserService, private authService: AuthService) { }

  addFriend(friend: string) {
    this.friends.push(friend);
  }

  getRatio() : number {
    this.ratio = (this.victories / (this.victories + this.defeats)) * 100;
    return this.ratio;
  }
}


