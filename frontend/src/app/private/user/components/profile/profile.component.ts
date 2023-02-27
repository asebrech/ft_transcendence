import { Component, NgModule, OnInit } from '@angular/core';
import { UserI } from 'src/app/model/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { Math } from 'phaser';
import { PercentPipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent {

  user : UserI = this.authService.getLoggedInUser();
  progress: number = 0;
  victory: number = 15;
  loss: number = 4;

  constructor(private authService : AuthService) { }

  ngOnInit() {
  this.progress = ((this.victory - this.loss) / this.victory) * 100;
  console.log(this.progress);
  }
}
