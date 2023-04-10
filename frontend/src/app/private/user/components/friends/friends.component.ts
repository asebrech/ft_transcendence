import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { UserI } from 'src/app/model/user.interface';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

    users: UserI[] = [];
  filteredUsers: UserI[] = [];
  searchTerm: string = '';
  friends: string[] = ['mago','mago','mago','mago','mago','mago','mago','mago','mago','mago','mago','mago','mago','mago','mago','mago','mago','mago','mago','mago','mago','mago','mago','mago'];
  message: string;
  showContextMenu: boolean;
  contextMenuTop: number;
  contextMenuLeft: number;
  isMyFriend: boolean = true;

  constructor(private route : Router, private playerService: PlayerService) { }

  ngOnInit(): void {
    if (!this.friends.length)
      this.message = "Liste d'amis vide !";
    this.playerService.getUserList().subscribe( users => {
      this.users = users;
      this.filteredUsers = [];
    });
  }

  searchUsers() {
    if (this.searchTerm.trim() !== '') {
      this.filteredUsers = this.users.filter((user: UserI) => {
        return user.username.toLowerCase().startsWith(this.searchTerm.toLowerCase());
      });
    } else {
      this.filteredUsers = [];
    }
  }

  // selectionner(user: UserI) {
  //  this.username = user.username; 
  //   this.resultats = [];
  // }

  goToProfileOf(user: string) {
    this.route.navigate(['/private/user/profile', user]);
  }

  onContextMenu(event: MouseEvent){
    event.preventDefault();
    this.showContextMenu = true;
    this.contextMenuTop = event.clientY;
    this.contextMenuLeft = event.clientX;
  }

  option1() {
    console.log("ajouter un ami")
  }

  option2() {
    console.log("supprimer ami");
  }

  option3() {
    console.log("envoyer msg");
  }
}
