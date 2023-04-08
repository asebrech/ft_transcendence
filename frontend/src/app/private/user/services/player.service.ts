import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserI } from 'src/app/model/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { UserService } from 'src/app/public/services/user-service/user.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  user : UserI = this.authService.getLoggedInUser();

  constructor(private userService: UserService, private authService: AuthService, private httpClient : HttpClient) { }

  addWin(id: number) {
    return this.httpClient.post(`api/users/${id}/addwins/`, null);
  }

  addLosses(id: number) {
    return this.httpClient.post(`api/users/${id}/addlosses/`, null);
  }

  updatePassword(userId: number, oldPassword: string, newPassword: string): Observable<UserI> {
    return this.httpClient.put<UserI>(`api/users/${userId}/change-password`,{oldPassword, newPassword});
  }

  updateEmail(userId: number, oldEmail: string, newEmail: string): Observable<UserI> {
    return this.httpClient.put<UserI>(`api/users/${userId}/change-email`,{oldEmail, newEmail});
  }
  
  updateUsername(userId: number, oldUsername: string, newUsername: string): Observable<UserI> {
    return this.httpClient.put<UserI>(`api/users/${userId}/change-username`,{oldUsername, newUsername});
  }
  
}


