import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgModel, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/public/_helpers/custom-validators';
import { PlayerService } from '../../services/player.service';
import { UserI } from 'src/app/model/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

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
  newO: string;
  old: string;

  constructor(private playerService: PlayerService, private authService: AuthService ) {}

  ngOnInit(): void {
  }

  changeUsername() : void {
    this.usernamePopup = true;
  }

  changePwd() : void {
    this.pwdPopup = true;
  }

  changeEmail() : void {
    this.emailPopup = true;
  }

  closePopup(num : number, old: string , newO: string): void{
    if (num == 0) {
      this.playerService.updateEmail(this.user.id, old, newO).pipe(
        catchError(error => {
          console.log('An error occurred:', error);
          throw('Something went wrong; please try again later.');
        })
      )
      .subscribe(response => {
        console.log('Email updated successfully:', response);
      });
      this.emailPopup = false;
    }
    else if (num == 1){
      console.log(this.user.password);
      this.playerService.updatePassword(this.user.id, old, newO).pipe(
        catchError(error => {
          console.log('An error occurred:', error);
          throw('Something went wrong; please try again later.');
        })
      )
      .subscribe(response => {
        console.log('Password updated successfully:', response);
      });
      this.pwdPopup = false;
    }
    else {
      this.playerService.updateUsername(this.user.id, old, newO).pipe(
        catchError(error => {
          console.log('An error occurred:', error);
          throw('Something went wrong; please try again later.');
        })
      )
      .subscribe(response => {
        console.log('Username updated successfully:', response);
      });
      this.usernamePopup = false;
    }
    //this.simpleNotification();
  }


  simpleNotification() {
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('Saved!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }
}
