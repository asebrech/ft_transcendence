import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { UserI } from 'src/app/model/user.interface';
import { Observable, catchError } from 'rxjs';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  users: UserI[] = [];
  user$ : Observable<UserI>
  filteredUsers: UserI[] = [];
  searchTerm: string = '';
  friends: string[];
  message: string;
  showContextMenu: boolean;
  contextMenuTop: number;
  contextMenuLeft: number;
  isMyFriend: boolean = true;
  selectedUser: string;
  user : UserI = this.authService.getLoggedInUser();

  constructor(private route : Router, private playerService: PlayerService, private authService: AuthService) { }

  ngOnInit(): void {
    console.table(this.user);
    this.user$ = this.playerService.getUser();
    this.user$.subscribe((user: UserI) => {
      this.friends = user.friend;
      if (user.friend.length === 0)
       this.message = "Liste d'amis vide !";
    });
    this.playerService.getUserList().subscribe(users => {
      this.filteredUsers = users;
      this.users = users;
    });
  }

  searchUsers() {
    if (this.searchTerm.trim() !== '') {
      this.filteredUsers = this.users.filter((user: UserI) => {
        return user.username.toLowerCase().startsWith(this.searchTerm.toLowerCase());
      });
    } else {
      this.playerService.getUserList().subscribe(users => {
        this.filteredUsers = users;
      });
    }
  }

  goToProfileOf(user: string) {
    this.route.navigate(['/private/user/profile', user]);
  }

  onContextMenu(event: MouseEvent, username: string){
    event.preventDefault();
    this.showContextMenu = true;
    this.contextMenuTop = event.clientY;
    this.contextMenuLeft = event.clientX;
    // this.user$.subscribe( (user: UserI) => {
    //   if (!user.friend.includes(username))
    //     this.isMyFriend = true;
    // });
    this.selectedUser = username;
  }

  closeContextMenu(){
    this.showContextMenu = false;
  }

  removevFriend() {
    console.log("supprimer ami");
  }

  removeFriend(id: number, username: string) {
    this.playerService.removeFriend(id, username).pipe(
      catchError(error => {
        console.log('An error occurred:', error);
        throw('Something went wrong; please try again later.');
      })
    )
    .subscribe(response => {
      console.log('Friend removed successfully:', response);
      this.user$.subscribe((user: UserI) => {
        this.friends = user.friend;
      });
    });
    this.showContextMenu = false;
  }

  addFriend(id: number, username: string){
    this.playerService.addFriend(id, username).pipe(
      catchError(error => {
        console.log('An error occurred:', error);
        throw('Something went wrong; please try again later.');
      })
    )
    .subscribe(response => {
      console.log('Friend added successfully:', response);
      this.user$.subscribe((user: UserI) => {
        this.friends = user.friend;
      });
    });
    this.showContextMenu = false;
  }

  selectUser(user: string) {
    console.log(user);
    this.selectedUser = user;
  }
}
