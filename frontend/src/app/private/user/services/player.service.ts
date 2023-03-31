import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserI } from 'src/app/model/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { UserService } from 'src/app/public/services/user-service/user.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  user : UserI = this.authService.getLoggedInUser();


  constructor(private userService: UserService, private authService: AuthService, private httpClient : HttpClient) { }

  // addFriend(friend: string) {
  //   this.httpClient.post()
  // }

  addWin(id: number) {
    return this.httpClient.post(`api/users/${id}/addwins/`, null);
  }

}


