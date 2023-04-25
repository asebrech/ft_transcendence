import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { UserI } from 'src/app/model/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  mail : string;

  constructor(private http: HttpClient, private snackbar: MatSnackBar ) { }

  findByUsername(username: string) : Observable<UserI[]> {
	  return this.http.get<UserI[]>(`/api/users/find-by-username?username=${username}`);
  }

  finAll(): Observable<UserI[]> {
	  return this.http.get<UserI[]>('/api/users');
  }

  create(user: UserI): Observable<UserI> {
    return this.http.post<UserI>('api/users', user);
  }
}
