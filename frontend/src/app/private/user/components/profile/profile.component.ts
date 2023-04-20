import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserI } from 'src/app/model/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { PlayerService } from '../../services/player.service';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { ChatService } from 'src/app/private/chat/services/chat-service/chat.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})

export class ProfileComponent {
  user$: Observable<UserI>;
  toto: UserI = null;
  win: number;
  dataSubject = new BehaviorSubject(null);

  constructor(private authService : AuthService, private playerService: PlayerService, private route: ActivatedRoute, private chatService: ChatService) {
  }

  ngOnInit() {
	this.chatService.getConnected().subscribe(val => {
		this.user$.subscribe(user =>{ this.toto = user
		if (this.toto) {
		this.toto.isConnected = false;

		for (const valUser of val) {
				if (valUser.id === this.toto.id) {
						this.toto.isConnected = true;
				}
		}
		}
	})
	})
	this.chatService.connected();
    const id = +this.route.snapshot.paramMap.get('id');
    if (id) {
		this.playerService.getUserById(id).subscribe(user => {
			if (user.wins == 0 && user.losses == 0)
			this.win = 0;
			else 
			this.win = (user.wins / (user.wins + user.losses)) * 100;
			this.dataSubject.next(user);
		});
		this.user$ = this.dataSubject.asObservable();
    }
    else {
		this.playerService.getUser().subscribe(user => {
			if (user.wins == 0 && user.losses == 0)
			this.win = 0;
			else 
			this.win = (user.wins / (user.wins + user.losses)) * 100;
			this.dataSubject.next(user);
		});
		this.user$ = this.dataSubject.asObservable();
    }
}
}
