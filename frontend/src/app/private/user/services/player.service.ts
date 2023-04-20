import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { UserI, playerHistory } from 'src/app/model/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { UserService } from 'src/app/public/services/user-service/user.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  user : UserI;
  friend : string[] = [];
  usersList: Observable<UserI[]>;
  colorBall : string;
  colorPad : string;

  constructor(private userService: UserService, private authService: AuthService, private httpClient : HttpClient, private route: Router) {

  }

  getUser(): Observable<UserI> {
    const userId = this.authService.getLoggedInUser().id;
    return this.httpClient.get<UserI>(`/api/users/${userId}`);
  }

  getUserById(userId: number) : Observable<UserI> {
    return this.httpClient.get<UserI>(`api/users/${userId}`);
  }

  addWin(id: number) {
    return this.httpClient.post(`api/users/${id}/addwins/`, null);
  }

  addLosses(id: number) {
    return this.httpClient.post(`api/users/${id}/addlosses/`, null);
  }

  addFriend(userId: number, newFriend: UserI) : Observable<UserI> {
    return this.httpClient.post<UserI>(`api/users/${userId}/addfriend`,{newFriend});
  }

  removeFriend(userId: number, friend: UserI) : Observable<UserI> {
    return this.httpClient.post<UserI>(`api/users/${userId}/remove-friend`,{friend});
  }

  updatePassword(userId: number, oldPassword: string, newPassword: string): Observable<UserI> {
    return this.httpClient.put<UserI>(`api/users/${userId}/change-password`,{oldPassword, newPassword});
  }

  updateEmail(userId: number, oldEmail: string, newEmail: string): Observable<UserI> {
    return this.httpClient.put<UserI>(`api/users/${userId}/change-email`,{oldEmail, newEmail});
  }

  updateUsername(userId: number, newUsername: string): Observable<UserI> {
    return this.httpClient.put<UserI>(`api/users/${userId}/change-username`,{newUsername});
  }

  getUserList() : Observable<UserI[]> {
    return this.httpClient.get<UserI[]>(`api/users/all`);
  }

  goToProfileOf(user: UserI) {
    this.route.navigate(['/private/user/profile', user.id]);
  }

  updateColorPad(userId: number, color: string) : Observable<UserI> {
    return this.httpClient.put<UserI>(`api/users/${userId}/update-color-pad`, {color});
  }

  uploadProfilePic(formData: FormData, userId : number): Observable<any> {
    return this.httpClient.post<FormData>(`/api/users/${userId}/upload-profil-pic`, formData, {
      reportProgress: true,
      observe: 'events'
    })
  }


  updateColorBall(userId: number, color: string) : Observable<UserI> {
    return this.httpClient.put<UserI>(`api/users/${userId}/update-color-ball`, {color});
  }

    getColorPad() : Observable<string> {
      return this.getUser().pipe(map((user: UserI) => {
        this.colorPad = user.colorPad;
        return this.colorPad;
      }));
    }

    getColorBall() : Observable<string> {
      return this.getUser().pipe(map((user: UserI) => {
        this.colorBall = user.colorBall;
        return this.colorBall;
      }));
    }

  setHistory(userId: number, history: playerHistory) : Observable<UserI> {
    return this.httpClient.post<UserI>(`api/users/${userId}/add-to-history`, {history});
  }

  incrLevel(id: number) {
    return this.httpClient.post(`api/users/${id}/incr-level/`, null);
  }

  decrLevel(id: number) {
    return this.httpClient.post(`api/users/${id}/decr-level/`, null);
  }
}

