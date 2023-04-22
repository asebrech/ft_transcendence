import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { Friend, UserI } from 'src/app/model/user.interface';
import { Observable, catchError } from 'rxjs';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { ChatService } from 'src/app/private/chat/services/chat-service/chat.service';
import { HttpHeaders } from '@angular/common/http';

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
  data: any;

  constructor(private cdr: ChangeDetectorRef, private route : Router, private playerService: PlayerService, private authService: AuthService, private chatService: ChatService) { }

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
       this.friends = user.friends;
       this.setMessage();
    });
    this.playerService.getUserList().subscribe(users => {
      this.filteredUsers = users; // affichera les utilisateurs selon l'input
      this.users = users; // tout les users.
      this.users = this.users.filter(users => users.id !== this.user.id);
      this.filteredUsers = this.filteredUsers.filter(users => users.id !== this.user.id);
	  this.chatService.connected();
    });
    this.setMessage();
   // this.playerService.getUserBy
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
    this.checkIfFriend(user);
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
		this.chatService.connected();
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
    		this.chatService.connected();
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

  getImageUrl(user: UserI): string {
    const userToken = localStorage.getItem('token'); // récupère le token depuis le local storage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${userToken}` // ajoute le token dans l'en-tête de la requête
    });
    return `http://localhost:3000/api/users/profile-image/${user.profilPic}`;
  }

  checkIfFriend(user: UserI) {
    this.isMyFriend = false; // remise à false à chaque fois qu'on appelle la fonction
    for (const friend of this.friends) {
      if (friend.id === user.id) { // si l'ami a le même id que l'utilisateur
        this.isMyFriend = true; // utilisateur trouvé dans le tableau
        break;
      }
    }
  }
}
