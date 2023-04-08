import { HttpClient } from '@angular/common/http';
import { ReturnStatement } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { UserI } from 'src/app/model/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  mail : string;
  // users: UserI[] = [
  //   { id: 1, username: 'John Doe', stats: { player_win: 5, player_losse: 2 , player_id : 'jd', player_name: 'john doe', total:16} },
  //   { id: 2, username: 'Jane Doe', stats: { player_win: 10, player_losse: 5, player_id : 'jda', player_name: 'john dane', total:14 } },
  //   { id: 3, username: 'Bob Smith', stats: { player_win: 2, player_losse: 3, player_id : 'bs', player_name: 'bob smith', total:8 } },
  // ];

  constructor(private http: HttpClient, private snackbar: MatSnackBar ) { }

  findByUsername(username: string) : Observable<UserI[]> {
	return this.http.get<UserI[]>(`/api/users/find-by-username?username=${username}`);
  }

  create(user: UserI): Observable<UserI> {
	return this.http.post<UserI>('api/users', user).pipe(
		tap((createdUser: UserI) => this.snackbar.open(`User ${createdUser.username} created successfuly`, 'Close', {
			duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
		})),
		catchError(e => {
			this.snackbar.open(`User could not be created, due to: ${e.error.message}`, 'Close', {
			duration: 5000, horizontalPosition: 'right', verticalPosition: 'top'
			})
			return throwError(() => e);
		})
	);
  }
}
