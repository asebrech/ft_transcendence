import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserI, playerHistory } from 'src/app/model/user.interface';
import { PlayerService } from '../../services/player.service';
import { Observable, forkJoin, map } from 'rxjs';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { ChatService } from 'src/app/private/chat/services/chat-service/chat.service';
import { Client } from 'colyseus.js';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})


export class ProfileComponent {
  user$: Observable<UserI>;
  toto: UserI = null;
  opponents$ : Observable<UserI[]>;
  user: UserI;
  opponentName: string;
  constructor(private playerService: PlayerService, private route: ActivatedRoute, private authService : AuthService, private chatService: ChatService) {
  }

  ngOnInit() 
  {

	this.chatService.getInGame().subscribe (players => {
		this.printAllRoomWithPlayer()
	})

	this.chatService.getEndGame().subscribe (players => {
		this.printAllRoomWithPlayer()
	})

    this.chatService.getConnected().subscribe(val => {
      this.user$.subscribe(user =>{ this.toto = user
      if (this.toto) {
      this.toto.isConnected = false;

      for (const valUser of val) {
          if (valUser.id === this.toto.id) {
              this.toto.isConnected = true;
          }
      }
	  this.printAllRoomWithPlayer()
	}
    })
    })

    this.chatService.connected();

      const id = +this.route.snapshot.paramMap.get('id');
      if (id) {
        this.user$ = this.playerService.getUserById(id);
      } else {
        this.user$ = this.playerService.getUser();
      }

      this.user$.subscribe();
      this.user = this.authService.getLoggedInUser();

      this.user$.subscribe((user) => {
        this.user = user;
        this.opponents$ = this.getOpponents(this.user.history);
      });
  }

  getOpponents(history: playerHistory[]): Observable<UserI[]> {
    const opponentIds = history.map((h) => h.opponentId);
    return forkJoin(opponentIds.map((id) => this.playerService.getUserById(id)));
  }

  async printAllRoomWithPlayer()
  {
	  
	  let myClient = new Client("ws://" + location.hostname + ":3001");
	  const rooms = await myClient.getAvailableRooms("my_room");
	  if(rooms.length > 0)
	  {
		  for (let i : number = 0 ; i < rooms.length; i++)
		  {
			  const metadata = rooms[i].metadata;
			  if (this.toto) {
				if (this.toto.id === metadata.player_left || this.toto.id == metadata.player_right) {
					this.toto.inGame = true;
				}
			}
		}
	}
  }

}

