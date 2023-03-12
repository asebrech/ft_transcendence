import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { UserService } from 'src/app/public/services/user-service/user.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  amis = [
    {nom: "Alice"},
    {nom: "Bob"},
    {nom: "Charlie"},
    {nom: "David"},
    {nom: "Eve"}
  ];
  suggestions: any[] = [];
  search : string;
  displayList: boolean = false;

  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {

  }

  displaySuggests() {
    const texte = this.search.toLowerCase();
    this.suggestions = this.amis.filter(ami => ami.nom.toLowerCase().includes(texte));
  }

  selectionner(ami) {
    this.search = ami.nom;
    this.suggestions = [];
  }
}
