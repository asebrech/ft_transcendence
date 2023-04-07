import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from '../../../services/dashboard-service/dashboard-service';
import { MessageI } from 'src/app/model/message.interface';
import { ChatService } from '../../../services/chat-service/chat.service';
import { Observable, delay, tap } from 'rxjs';
import { room } from 'src/app/private/game/components/game.front/game.front.component';
import { RoomI } from 'src/app/model/room.interface';

@Component({
	selector: 'app-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

	message: string = '';
	ChannelName$: Observable<RoomI> = this.chatService.roomName$;

	messages$: Observable<MessageI[]> = this.chatService.messages$;

	isEditing = false;
	placeholderText: string = null;
	placeTmp: string;
	inputText: string = "";

	@ViewChild('messageList') messageList: ElementRef;
	@ViewChild('inputElement') inputElementRef: ElementRef;


	constructor(private formBuilder: FormBuilder, public dashService: DashboardService, private changeDetector: ChangeDetectorRef,
		private elementRef: ElementRef, public chatService: ChatService) {

		this.ChannelName$.subscribe(name =>{if(name){ this.placeholderText = name.name}});
	}

	@HostListener('document:click', ['$event'])
	onClick(event: MouseEvent) {
		if (!this.dashService.addUsers && this.elementRef.nativeElement.querySelector('.enableAddUser').contains(event.target)) {
			this.dashService.addUsers = true;
		}
		else if (this.dashService.addUsers && this.elementRef.nativeElement.querySelector('.addUser') && !this.elementRef.nativeElement.querySelector('.addUser').contains(event.target)) {
			this.dashService.addUsers = false;
		}
	}

	ngOnInit(): void {
		this.chatService.getMessages().subscribe();
		this.ChannelName$.subscribe(name =>{ if(name){this.ajusterLargeurInput(this.inputElementRef.nativeElement, name.name)}});
		this.chatService.getSelectedRoom().subscribe(() => this.placeTmp = 'toto');
		this.messages$.pipe(
			tap(() => {
				setTimeout(() => {
					this.scrollToBottom();
				});
			}),
			delay(500)
		)
			.subscribe();
	}

	ngAfterViewInit(): void {
		this.ajusterLargeurInput(this.inputElementRef.nativeElement, null)
	}

	addUserEnable() {
		this.dashService.addUsers = true;
	}

	onSubmit() {
		if (this.message) {
			
			this.chatService.sendMessage({ text: this.message, room: this.chatService.selectedRoom });
			this.message = '';
		}
		this.messages$.pipe(
			tap(() => {
				setTimeout(() => {
					this.scrollToBottom();
				});
			}),
			delay(500)
		)
			.subscribe();
	}

	scrollToBottom(): void {
		try {
			this.messageList.nativeElement.scrollTop = this.messageList.nativeElement.scrollHeight;
		} catch (err) { }
	}

	members() {
		this.dashService.members = !this.dashService.members;
	}

	onFocus(): void {
		this.inputText = this.placeholderText;
		this.placeTmp = this.placeholderText;
		this.placeholderText = '';
		this.changeDetector.detectChanges();
	}

	validerPlaceholder(inputElement: HTMLInputElement): void {
		this.placeholderText = this.placeTmp;
		const tmp: string = this.inputText.trim();
		if (tmp !== '' && tmp != this.placeholderText) {
			this.placeholderText = this.inputText;
			this.chatService.changeName(this.placeholderText, this.chatService.selectedRoom);
		}
		this.ajusterLargeurInput(inputElement, this.placeholderText);
		this.inputText = "";
		this.changeDetector.detectChanges();
	}

	validerPlaceholderEnter(inputElement: HTMLInputElement): void {
		inputElement.blur();
	}

	onInput(inputElement: HTMLInputElement): void {
		this.ajusterLargeurInput(inputElement, this.inputText);
	}

	ajusterLargeurInput(inputElement: HTMLInputElement, text: string): void {
		// Créez un élément span temporaire pour mesurer la largeur du texte
		const span = document.createElement('span');
		span.style.position = 'absolute';
		span.style.visibility = 'hidden';
		span.style.whiteSpace = 'pre';
		// span.textContent = inputElement.placeholder;
		span.textContent = text || inputElement.placeholder;

		// Copiez les propriétés de style pertinentes de l'input vers le span
		const inputStyle = getComputedStyle(inputElement);
		const propertiesToCopy = ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing'];
		for (const property of propertiesToCopy) {
			span.style[property] = inputStyle[property];
		}

		// Ajoutez le span au DOM, mesurez sa largeur et retirez-le du DOM
		document.body.appendChild(span);
		const textWidth = span.getBoundingClientRect().width;
		document.body.removeChild(span);

		// Ajoutez un peu d'espace supplémentaire pour éviter que le texte ne soit coupé
		const padding = 0;

		// Définissez la largeur de l'input en fonction de la largeur du texte mesurée
		inputElement.style.width = `${textWidth + padding}px`;
	}

}
