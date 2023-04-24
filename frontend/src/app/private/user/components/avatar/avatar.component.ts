import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, Inject } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, of } from 'rxjs';
import { Event } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WINDOW } from 'src/app/window-token'

export interface File {
  data: any;
  progress: number;
  inProgress: boolean;
}

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})


export class AvatarComponent implements OnInit {

  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;
  @Output() avatarUpdate = new EventEmitter<boolean>();
  file: File = {
    data: null,
    inProgress: false,
    progress: 0
  }

  form: FormGroup;

  origin = this.window.location.origin;

  constructor(
    private playerService : PlayerService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    @Inject(WINDOW) private window: Window) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [{value: null, disabled: true}, [Validators.required]],
      name: [null, [Validators.required]],
      username: [null, [Validators.required]],
      profileImage: [null]
    });
  }

  onFileSelected(){
      this.file = {
        data: this.fileUpload.nativeElement.files[0],
        inProgress: false,
        progress: 0
      };

      //this.uploadFile();
    }

  uploadFile() {
    // if (!this.file.data)
    //   return ;
    const formData = new FormData();
    formData.append('file', this.file.data);
    this.file.inProgress = true;

    this.playerService.uploadProfilePic(formData, this.authService.getLoggedInUser().id).subscribe();
  }
}