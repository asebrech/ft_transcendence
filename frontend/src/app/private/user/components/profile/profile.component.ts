import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserI } from 'src/app/model/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { PlayerService } from '../../services/player.service';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { NgCircleProgressModule } from 'ng-circle-progress';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})

export class ProfileComponent {
  user$: Observable<UserI>;
  win$: Observable<number>;
  loss$: Observable<number>;
  dataSubject = new BehaviorSubject(null);

  constructor(private authService : AuthService, private playerService: PlayerService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    const userId = this.authService.getLoggedInUser().id;
    this.playerService.getUser().subscribe(user => {
      this.win$ = of(user.wins / (user.wins + user.losses) * 100);
      this.loss$ = of(user.losses / (user.wins + user.losses) * 100);
      this.dataSubject.next(user);
    });
    this.user$ = this.dataSubject.asObservable();
  }
}
