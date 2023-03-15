import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { UserService } from 'src/app/public/services/user-service/user.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  amis = ["alois", "Mago", "Aloise", "Magro", "Ramzi", "Zizi","alois", "Mago", "Aloise", "Magro", "Ramzi", "Zizi","alois", "Mago", "Aloise", "Magro", "Ramzi", "Zizi","alois", "Mago", "Aloise", "Magro", "Ramzi", "Zizi","alois", "Mago", "Aloise", "Magro", "Ramzi", "Zizi","alois", "Mago", "Aloise", "Magro", "Ramzi", "Zizi","alois", "Mago", "Aloise", "Magro", "Ramzi", "Zizi","alois", "Mago", "Aloise", "Magro", "Ramzi", "Zizi","alois", "Mago", "Aloise", "Magro", "Ramzi", "Zizi","alois", "Mago", "Aloise", "Magro", "Ramzi", "Zizi","alois", "Mago", "Aloise", "Magro", "Ramzi", "Zizi","alois", "Mago", "Aloise", "Magro", "Ramzi", "Zizi","alois", "Mago", "Aloise", "Magro", "Ramzi", "Zizi","alois", "Mago", "Aloise", "Magro", "Ramzi", "Zizi","alois", "Mago", "Aloise", "Magro", "Ramzi", "Zizi","alois", "Mago", "Aloise", "Magro", "Ramzi", "Zizi","alois", "Mago", "Aloise", "Magro", "Ramzi", "Zizi", "alois", "Mago", "Aloise", "Magro", "Ramzi", "Zizi","alois", "Mago", "Aloise", "Magro", "Ramzi", "Zizi"];
  suggestions: any[] = [];
  search : string;
  displayList: boolean = false;
  resultats: string[] = [];
  username: string;
  message : string;

  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    if (!this.amis.length)
      this.message = "Liste d'amis vide !";
  }

  chercher(username: string) {
    this.resultats = this.amis.filter(ami => ami.toLowerCase().includes(username.toLowerCase()));
  }

  selectionner(suggestion: string) {
    this.resultats = [];
  }

  test() {
    console.log("ca marche");
  }
}
