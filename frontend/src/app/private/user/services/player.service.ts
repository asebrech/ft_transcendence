import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { UserI } from 'src/app/model/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { UserService } from 'src/app/public/services/user-service/user.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  user : UserI;
  friend : string[] = [];
  usersList: Observable<UserI[]>;

  constructor(private userService: UserService, private authService: AuthService, private httpClient : HttpClient) {}

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

  addFriend(userId: number, newFriend: UserI) : Observable<number[]> {
    return this.httpClient.post<number[]>(`api/users/${userId}/addfriend`,{newFriend});
  }

  removeFriend(userId: number, friend: UserI) : Observable<number[]> {
    return this.httpClient.post<number[]>(`api/users/${userId}/remove-friend`,{friend});
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
}


