import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { Friend, UserI } from 'src/app/model/user.interface';
import { Observable, catchError } from 'rxjs';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { ChatService } from 'src/app/private/chat/services/chat-service/chat.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  users: UserI[] = [];
  user$ : Observable<UserI>;
  filteredUsers: UserI[] = [];
  searchTerm: string = '';
  message: string;
  showContextMenu: boolean;
  contextMenuTop: number;
  contextMenuLeft: number;
  isMyFriend: boolean = true;
  selectedUser: UserI;
  user : UserI = this.authService.getLoggedInUser();
  friends: Friend[] = [];
  isBlocked: boolean = null;


  constructor(private cdr: ChangeDetectorRef, private route : Router, private playerService: PlayerService, private authService: AuthService, private chatService: ChatService) { }

  ngOnInit(): void {
	this.chatService.getIfBlocked().subscribe(toto => this.isBlocked = toto);
    this.user$ = this.playerService.getUser();
    this.user$.subscribe((user: UserI) => {
       this.friends = user.friends;
    });
    this.playerService.getUserList().subscribe(users => {
      this.filteredUsers = users; // affichera les utilisateurs selon l'input
      this.users = users; // tout les users.
      this.users = this.users.filter(users => users.id !== this.user.id);
      this.filteredUsers = this.filteredUsers.filter(users => users.id !== this.user.id);
    });
    this.setMessage();
  }

  sendMessage(user: UserI) {
	this.chatService.joinAndRpivateMessage(user);
  }

  sendMessage(user: UserI) {
	this.chatService.joinAndRpivateMessage(user);
  }

  searchUsers() {
    if (this.searchTerm.trim() !== '') {
      this.filteredUsers = this.users.filter((user: UserI) => {
        return user.username.toLowerCase().startsWith(this.searchTerm.toLowerCase());
      });
    } else
      this.filteredUsers = this.users;
  }

  onContextMenu(event: MouseEvent, user: UserI){
	this.chatService.checkIfBlocked(user);
    event.preventDefault();
    this.showContextMenu = true;
    this.contextMenuTop = event.clientY;
    this.contextMenuLeft = event.clientX;
    this.selectedUser = user; // le profil sur lequel on a fait clic droit.
  }

  closeContextMenu(){
    this.showContextMenu = false;
  }

  removevFriend() {
    console.log("supprimer ami");
  }

  removeFriend(id: number, friend: UserI) {
    this.playerService.removeFriend(id, friend).pipe(
      catchError(error => {
        console.log('An error occurred:', error);
        throw('Something went wrong; please try again later.');
      })
      )
      .subscribe(response => {
        console.log('Friend removed successfully');
        this.user$.subscribe((user: UserI) => {
          const friendIndex = this.friends.findIndex(f => f.id === friend.id);
          this.friends.splice(friendIndex, 1);
          this.setMessage()
        });
      });
      this.showContextMenu = false;
      if (this.friends.length === 0)
        this.message = "Liste d'amis vide !";
    }

    addFriend(userId: number, selectedUser: UserI){
      this.playerService.addFriend(userId, selectedUser).pipe(
        catchError(error => {
          console.log('An error occurred:', error);
          throw('Something went wrong; please try again later.');
        })
        )
        .subscribe((response : UserI) => {
          console.log('Friend added successfully');
          this.user$.subscribe((user: UserI) => {
            this.friends = user.friends;
            this.setMessage()
          });
        });
        this.showContextMenu = false;
      }

    selectUser(user: UserI) {
      this.selectedUser = user;
  }

  goToProfileOf(user: UserI) {
    this.playerService.goToProfileOf(user);
  }

  private setMessage() {
    if (this.friends.length === 0) {
      this.message = "Liste d'amis vide !";
    } else {
      this.message = "";
    }
  }

  block(user: UserI) {
	this.chatService.blockUser(user, null);
	this.showContextMenu = false;
  }
  
  unblock(user: UserI) {
	this.chatService.unBlockUser(user, null);
	this.showContextMenu = false;

  }

}


//tagueul
