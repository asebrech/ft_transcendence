import { Component, OnInit } from '@angular/core';
import { UserI } from 'src/app/model/user.interface';
import { UserService } from 'src/app/public/services/user-service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user : UserI;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

}
