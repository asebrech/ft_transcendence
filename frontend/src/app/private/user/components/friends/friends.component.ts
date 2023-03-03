import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { UserService } from 'src/app/public/services/user-service/user.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  friendlist : [];
  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
  }

}
