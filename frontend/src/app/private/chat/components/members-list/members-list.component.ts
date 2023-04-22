import { Component, ElementRef, HostListener, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DashboardService } from '../../services/dashboard-service/dashboard-service';
import { Console } from 'console';
import { ChatService } from '../../services/chat-service/chat.service';
import { UserI } from 'src/app/model/user.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit {

	imagePath1 = "../../../../../../assets/images/close.png";
	imagePath2 = "../../../../../../assets/images/arrow-down-sign-to-navigate.png";

	selectedUser: UserI;
	isClicked = false;
	connected: boolean = true;
	showOverlay = false;
	heightOverlay = 0;
	overlayPosition = { left: 0, top: 0 };
	selectedIndex: number | null = null;

	users$: Observable<UserI[]> = this.chatservice.getMember();
	users: UserI[] = [];

	@Input() selectedUserInput: UserI;
	  @ViewChild('option') option: ElementRef;

  constructor(private elementRef: ElementRef, public dashService: DashboardService, public chatservice: ChatService) {
  }

  ngOnInit(): void {
	this.chatservice.getConnected().subscribe(val => {
		if (this.users) {
		for (let i = 0; i < this.users.length; i++) {
			this.users[i].isConnected = false;
		}
		for (const user of this.users) {
				for (const valUser of val) {
						if (valUser.id === user.id) {
							user.isConnected = true;
					}
				}
		}
		}
	})
	this.chatservice.listMember();
	this.users$.subscribe(val =>{ this.users = val;
			this.chatservice.connected();
	});
  }

  ngOnDestroy() {
	this.hide();
  }

  checkResize(): void {
	window.addEventListener('resize', this.onResize.bind(this));
  }

  uncheckResize() {
    // Supprimez le gestionnaire d'événements de défilement lorsque le composant est détruit
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  @HostListener('document:click', ['$event'])
	onClick(event: MouseEvent) {
	 if (this.showOverlay && this.elementRef.nativeElement.querySelector('.selected') && !this.elementRef.nativeElement.querySelector('.selected').contains(event.target)
	 	&& !this.elementRef.nativeElement.querySelector('.overlay').contains(event.target)) {
			this.hide();
		}
	}

	onValueChanged(newValue: boolean) {
		this.hide();
	  }

	divHeight(newValue: number) {
		this.heightOverlay = newValue;
	  }

  select() {
	if (this.selectedUser) {
		this.chatservice.checkIfBlocked(this.selectedUser);
	}
	this.selectedUserInput = this.selectedUser;
	//console.log(this.selectedUser);
  }

  hide() {
	this.showOverlay = false;
	this.selectedUser = null;
	this.isClicked = false;
	this.uncheckResize();
  }

  getElementPosition(index: number, event: MouseEvent) {

// 	if (this.selectedUser.id === this.chatservice.currentUser.id){
// 		this.hide();
// 		this.showOverlay = false;
// 		this.isClicked = false;
// 		return;
//   }
	  if (index === this.selectedIndex && this.showOverlay) {
		  this.hide();
		  return;
		}
		// Récupérer l'élément DOM à partir de l'événement de clic
		const domElement = event.target as HTMLElement;

		// Récupérer la position de l'élément en utilisant getBoundingClientRect()
		const rect = domElement.getBoundingClientRect();

		this.selectedIndex = index;

		this.overlayPosition.left = -260;

		const windowHeight = window.innerHeight;
		const overlayHeight = this.heightOverlay + 100;//domElement.offsetHeight;

		if (rect.top + this.heightOverlay > windowHeight) {
			this.overlayPosition.top = windowHeight - overlayHeight;
		} else {
			this.overlayPosition.top = rect.top -95;
		}

		// Afficher la div de 100x100

		this.showOverlay = true;
	this.checkResize();
  }

  onResize(event: Event) {
    // Vérifiez si la fenêtre est visible
    if (this.showOverlay && this.selectedIndex !== null) {
      // Calculez la hauteur de défilement
	  const selectedElement = document.querySelector('.selected') as HTMLAnchorElement;

	  const rect = selectedElement.getBoundingClientRect();
      const scrollTop = window.pageYOffset;

      // Récupérez la hauteur de la fenêtre et la hauteur de la div
      const windowHeight = window.innerHeight;
      const overlayHeight = this.heightOverlay + 100;;

      // Ajustez la position 'top' de la div si nécessaire
      if (this.overlayPosition.top + overlayHeight > windowHeight + scrollTop) {
        this.overlayPosition.top = windowHeight - overlayHeight;
      }
	  else if (this.overlayPosition.top + 100 < rect.top) {
        this.overlayPosition.top = (windowHeight - overlayHeight);
	  }
	  else {
		this.overlayPosition.top = rect.top -95;
	  }
    }
  }

}
