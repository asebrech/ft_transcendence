import { Component, OnInit } from '@angular/core';
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
  friends: Friend[];
  isBlocked: boolean = null;


  constructor(private route : Router, private playerService: PlayerService, private authService: AuthService, private chatService: ChatService) { }

  ngOnInit(): void {
	this.chatService.getConnected().subscribe(val => {
		if (this.filteredUsers) {
		for (let i = 0; i < this.filteredUsers.length; i++) {
			this.filteredUsers[i].isConnected = false;
		}
		for (const user of this.filteredUsers) {
				for (const valUser of val) {
						if (valUser.id === user.id) {
							user.isConnected = true;
					}
				}
		}
		}
		if (this.friends) {
			for (let i = 0; i < this.friends.length; i++) {
				this.friends[i].isConnected = false;
			}
			for (const user of this.friends) {
					for (const valUser of val) {
							if (valUser.id === user.id) {
								user.isConnected = true;
						}
					}
			}
			}
	})
	this.chatService.getIfBlocked().subscribe(toto => this.isBlocked = toto);
    this.user$ = this.playerService.getUser();
    this.user$.subscribe((user: UserI) => {
      if (!user.friends)
       this.message = "Liste d'amis vide !";
       this.friends = user.friends;
    });
    this.playerService.getUserList().subscribe(users => {
      this.filteredUsers = users; // affichera les utilisateurs selon l'input
      this.users = users; // tout les users.
      this.users = this.users.filter(users => users.id !== this.user.id);
      this.filteredUsers = this.filteredUsers.filter(users => users.id !== this.user.id);
	  this.chatService.connected();
    });
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
      console.log('Friend removed successfully:', response);
      this.user$.subscribe((user: UserI) => {
        this.friends = user.friends;
		this.chatService.connected();
      });
    });
    this.showContextMenu = false;
  }

  addFriend(userId: number, selectedUser: UserI){
    console.log(selectedUser);
    this.playerService.addFriend(userId, selectedUser).pipe(
      catchError(error => {
        console.log('An error occurred:', error);
        throw('Something went wrong; please try again later.');
      })
    )
    .subscribe(response => {
      console.log('Friend added successfully:', response);
      this.user$.subscribe((user: UserI) => {
        this.friends = user.friends;
		this.chatService.connected();
      });
    });
    this.showContextMenu = false;
  }

  selectUser(user: UserI) {
    console.table(user);
    this.selectedUser = user;
  }

  goToProfileOf(user: UserI) {
    this.playerService.goToProfileOf(user);
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
