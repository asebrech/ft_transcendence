import { Component, Inject, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, NgModel, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/public/_helpers/custom-validators';
import { PlayerService } from '../../services/player.service';
import { UserI } from 'src/app/model/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { Observable, catchError, throwError } from 'rxjs';
import { StarsService } from 'src/app/services/stars-service/stars.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {

  form: FormGroup = new FormGroup ({
		newEmail: new FormControl(null, [Validators.required, Validators.email]),
		username: new FormControl(null, [Validators.required]),
    newPassword: new FormControl(null, [Validators.required]),
    oldPasswordConfirm: new FormControl(null, [Validators.required]),
		newPasswordConfirm: new FormControl(null, [Validators.required])
	},
		{ validators: CustomValidators.passwordsMatching }
	);
  email: string;
  usernamePopup: boolean = false;
  pwdPopup: boolean = false;
  emailPopup: boolean = false;
  user: UserI = this.authService.getLoggedInUser();
  user$: Observable<UserI>;
  newO: string;
  old: string;
  username: string;
  colorBall : string = '';
  colorPad : string = '';

  data: any;

  constructor(
    private starsService: StarsService,
    private playerService: PlayerService,
    private authService: AuthService, private route: Router,
    private http: HttpClient) {}

  ngOnInit(): void {
    this.user$ = this.playerService.getUser();
    this.user$.subscribe((user: UserI) => {
      this.colorPad = user.colorPad;
      this.colorBall = user.colorBall;
      this.username = user.username;
      this.email = user.email;
	  this.data = user;
    });
  }

  async goTo2FA() {
	await this.route.navigate(['/private/user/google-auth']);
  }

  changeUsername() {
    this.usernamePopup = true;
  }
  changePwd() {
    this.pwdPopup = true;
  }
  changeEmail() {
    this.emailPopup = true;
  }

  closePopup(num : number, old: string ,newO: string): void{
    console.log(this.username, this.email);
    if (num == 0) {
      if(newO != this.email){
      this.playerService.updateEmail(this.user.id, newO).subscribe(response => {
        console.log('Email updated successfully:', response);
      });
    }
    this.emailPopup = false;
    }
    else {
      if (newO != this.username){
      this.playerService.updateUsername(this.user.id, newO).subscribe(response => {
        console.log('Username updated successfully:', response);
      });
    }
    this.usernamePopup = false;
    }
    //this.simpleNotification();
  }

  retrieveBallSkin(event: Event){
    const clickedImageSrc = (event.target as HTMLImageElement).getAttribute('src');
    this.playerService.updateColorBall(this.user.id,clickedImageSrc).subscribe( (user: UserI) => {
      this.user$.subscribe( (user: UserI) => {
        this.colorBall = user.colorBall;
      })
    });
  }

  onColorBallChange(newColor: string){
    if(newColor) {
      this.playerService.updateColorBall(this.user.id,newColor).subscribe( (user: UserI) => {
        this.user$.subscribe( (user: UserI) => {
        this.colorBall = user.colorBall;
        })
      });
    }
  }

  retrievePaddleSkin(event: Event){
    const clickedImageSrc = (event.target as HTMLImageElement).getAttribute('src');
    this.playerService.updateColorPad(this.user.id,clickedImageSrc).subscribe( (user: UserI) => {
        this.user$.subscribe( (user: UserI) => {
        this.colorPad = user.colorPad;
      })
    });
  }

  onPaddleColorChange(newColor : string){
    if (newColor) {
      this.playerService.updateColorPad(this.user.id, newColor).subscribe( (user: UserI) => {
        this.user$.subscribe( (user: UserI) => {
          this.colorPad = user.colorPad;
        })
      });
    }
  }

  getImageUrl(): string {
    const userToken = localStorage.getItem('token'); // récupère le token depuis le local storage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${userToken}` // ajoute le token dans l'en-tête de la requête
    });
    return `http://localhost:3000/api/users/profile-image/${this.data?.profilPic}`;;
  }

  close() {
    this.usernamePopup = false;
    this.pwdPopup = false;
    this.emailPopup = false;
  }
}
