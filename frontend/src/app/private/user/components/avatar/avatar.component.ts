import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, of } from 'rxjs';
import { Event } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WINDOW } from 'src/app/window-token'
import { Inject } from '@angular/core';

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
    const formData = new FormData();
    formData.append('file', this.file.data);
    this.file.inProgress = true;

    this.playerService.uploadProfilePic(formData, this.authService.getLoggedInUser().id).pipe(
      map((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.file.inProgress = false;
        return of('Upload failed');
      })).subscribe((event: any) => {
        if(typeof (event) === 'object') {
          this.form.patchValue({profileImage: event.body.profileImage});
        }
      })
  }
}
